// src/utils/budgetUtils.js

const budgetQueries = require('../models/locationBudgetModel');

/**
 * Ensure the location_budget row exists. If it doesn't, create it with zero balance.
 */
async function ensureLocationBudgetExists(client, locationId, userId) {
  const check = await client.query(budgetQueries.checkBudgetExists(), [locationId]);

  if (check.rows.length === 0) {
    await client.query(budgetQueries.insertNewBudget(), [locationId, 0, userId]);
  }
}

/**
 * Ensure the row exists, and increment (used for deposits/withdrawals).
 */
async function ensureLocationBudget(client, locationId, amount, userId) {
  const check = await client.query(budgetQueries.checkBudgetExists(), [locationId]);

  if (check.rows.length === 0) {
    await client.query(budgetQueries.insertNewBudget(), [locationId, amount, userId]);
  } else {
    await client.query(budgetQueries.incrementExistingBudget(), [amount, userId, locationId]);
  }
}

module.exports = {
  ensureLocationBudget,
  ensureLocationBudgetExists
};
