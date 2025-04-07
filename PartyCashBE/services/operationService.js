const pool = require('../db');
const queries = require('../models/operationModel');
const { validateAmount } = require('../utils/validate');

async function deposit({ amount, description, locationId, userId, type = 'deposit' }) {
  const validatedAmount = validateAmount(amount);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // If a locationId is provided and is valid, ensure the location exists and its budget row is present.
    if (locationId && !isNaN(locationId)) {
      const locationCheck = await client.query(queries.checkLocationExists(), [locationId]);
      if (locationCheck.rows.length === 0) {
        throw new Error('Invalid location ID');
      }

      // Ensure the location budget row exists.
      const existingBudget = await client.query(queries.checkLocationBudgetExists(), [locationId]);
      if (existingBudget.rows.length === 0) {
        console.log('⚠️ No location budget row. Inserting one...');
        await client.query(queries.insertLocationBudget(), [locationId, 0, userId]);
        console.log('✅ Location budget row inserted');
      }
    }

    // Insert the operation record.
    const result = await client.query(
      queries.insertOperation(),
      [userId, type, validatedAmount, description, locationId || null]
    );

    // Always update the shared budget.
    await client.query(queries.updateSharedBudget(), [validatedAmount, userId]);

    // If a valid locationId is provided, update the location budget.
    if (locationId && !isNaN(locationId)) {
      await client.query(queries.upsertLocationBudget(), [locationId, validatedAmount, userId]);
    }

    await client.query('COMMIT');
    return result.rows[0].id;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Deposit failed:', error);
    throw error;
  } finally {
    client.release();
  }
}


async function withdraw({ amount, description, userId }) {
  const validatedAmount = validateAmount(amount);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Check the shared budget to ensure enough funds
    const budgetResult = await client.query(queries.getBudgetBalance());
    const currentBalance = budgetResult.rows[0]?.current_balance || 0;

    if (currentBalance < validatedAmount) {
      throw new Error('Insufficient funds');
    }

    // 2. Insert the withdrawal operation as a negative amount
    //    (our query does -$2, so we pass validatedAmount as is).
    const result = await client.query(queries.insertWithdrawal(), [userId, -Math.abs(validatedAmount), description]);

    // 3. Update the shared budget by adding a negative amount.
    //    Because insertWithdrawal() stored a negative, we also pass validatedAmount
    //    to add a negative value. However, let's unify it to pass the negative explicitly:
    await client.query(queries.updateSharedBudgetByAmount(), [-validatedAmount, userId]);

    await client.query('COMMIT');
    return result.rows[0].id;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Withdraw failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function getLastOperations() {
  const result = await pool.query(queries.getLastOperations());
  return result.rows;
}

async function getOperationsWithLocation() {
  const result = await pool.query(queries.getOperationsWithLocation());
  return result.rows;
}

module.exports = {
  deposit,
  withdraw,
  getLastOperations,
  getOperationsWithLocation
};
