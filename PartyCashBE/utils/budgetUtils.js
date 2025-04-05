// src/utils/budgetUtils.js

const budgetQueries = require('../models/locationBudgetModel');

async function ensureLocationBudget(client, locationId, amount, userId) {
  const check = await client.query(budgetQueries.checkExists(), [locationId]);

  if (check.rows.length === 0) {
    await client.query(budgetQueries.insertNewBudget(), [locationId, amount, userId]);
  } else {
    await client.query(budgetQueries.incrementExistingBudget(), [amount, userId, locationId]);
  }
}

module.exports = { ensureLocationBudget };
