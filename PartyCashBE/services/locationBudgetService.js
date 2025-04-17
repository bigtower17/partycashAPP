const pool = require('../db');
const budgetQueries = require('../models/locationBudgetModel'); // All queries come from here

async function fetchLocationBudget(locationId) {
  const result = await pool.query(budgetQueries.getLocationBudget(), [locationId]);
  return result.rows[0] || null;
}

async function updateOrCreateLocationBudget(locationId, amount, userId, isPos) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Ensure location budget can only be updated with cash transactions (not POS)
    if (isPos) {
      // Skip updating the location budget for POS transactions
      console.log('POS transaction - Skipping location budget update');
      await client.query('COMMIT');
      return { created: false, new_balance: null }; // No change to location budget
    }

    // Check if a budget row exists for the given location
    const check = await client.query(budgetQueries.checkBudgetExists(), [locationId]);

    if (check.rows.length === 0) {
      // If not, create a new row with the specified amount
      await client.query(budgetQueries.insertNewBudget(), [locationId, amount, userId]);
      await client.query('COMMIT');
      return { created: true, new_balance: amount };
    }

    // If exists, update the row with the new balance
    const newBalance = Number(check.rows[0].current_balance) + Number(amount);
    await client.query(budgetQueries.updateBudget(), [newBalance, userId, locationId]);
    await client.query('COMMIT');
    return { created: false, new_balance: newBalance };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}


async function fetchAllLocationBudgets() {
  const result = await pool.query(budgetQueries.getAllBudgets());
  return result.rows;
}

module.exports = {
  fetchLocationBudget,
  updateOrCreateLocationBudget,
  fetchAllLocationBudgets,
};
