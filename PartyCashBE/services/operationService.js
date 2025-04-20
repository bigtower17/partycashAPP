const pool = require('../db');
const queries = require('../models/operationModel');
const { validateAmount } = require('../utils/validate');

async function deposit({ amount, description, locationId, userId, type = 'deposit', is_pos = false }) {
  const isPos = is_pos
  const validatedAmount = validateAmount(amount);
  const client = await pool.connect();

  try {
    console.log('SQL:', queries.insertOperation());

    await client.query('BEGIN');

    // If a locationId is provided and is valid, ensure the location exists and its budget row is present.
    if (locationId && !isNaN(locationId)) {
      const locationCheck = await client.query(queries.checkLocationExists(), [locationId]);
      if (locationCheck.rows.length === 0) {
        throw new Error('Invalid location ID');
      }

      // Ensure the location budget row exists only if it's a cash transaction (not POS)
      if (!isPos) {
        const existingBudget = await client.query(queries.checkLocationBudgetExists(), [locationId]);
        if (existingBudget.rows.length === 0) {
          console.log('⚠️ No location budget row. Inserting one...');
          await client.query(queries.insertLocationBudget(), [locationId, 0, userId]);
          console.log('✅ Location budget row inserted');
        }
      }
    }

    // Insert the operation record with `is_pos`
    const result = await client.query(
      queries.insertOperation(),
      [userId, type, validatedAmount, description, locationId || null, is_pos]
    );

    // Always update the shared budget (this will handle POS and cash transactions)
    await client.query(queries.updateSharedBudget(), [validatedAmount, userId]);

    // If it's a cash transaction (not POS), update the location budget
    if (!isPos && locationId) {
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

    // Check the shared budget to ensure enough funds for withdrawal
    const budgetResult = await client.query(queries.getBudgetBalance());
    const currentBalance = budgetResult.rows[0]?.current_balance || 0;

    if (currentBalance < validatedAmount) {
      throw new Error('Insufficient funds');
    }

    // Insert the withdrawal operation as a negative amount (we pass validatedAmount as is).
    const result = await client.query(queries.insertWithdrawal(), [userId, -Math.abs(validatedAmount), description]);

    // Update the shared budget by subtracting the withdrawal amount (negative value)
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
async function getPosOperations() {
  const result = await pool.query(queries.getPosOperations()); // Fetch POS operations
  return result.rows;
}

async function getCashOperations() {
  const result = await pool.query(queries.getCashOperations()); // Fetch cash operations
  return result.rows;
}

module.exports = {
  deposit,
  withdraw,
  getLastOperations,
  getOperationsWithLocation,
  getPosOperations,
  getCashOperations
};
