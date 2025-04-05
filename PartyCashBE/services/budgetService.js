const pool = require('../db');
const queries = require('../models/sharedBudgetModel');

async function fetchSharedBudget() {
  const result = await pool.query(queries.getSharedBudget());

  if (result.rows.length === 0) {
    throw new Error('NOT_FOUND');
  }

  return result.rows[0].current_balance;
}

module.exports = { fetchSharedBudget };
