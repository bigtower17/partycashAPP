const { transaction } = require('../services/dbService');
const queries = require('../models/quoteModel');
const locationQueries = require('../models/locationModel');
const locationBudgetQueries = require('../models/locationBudgetModel');
const { validateAmount } = require('../utils/validate');
const { ensureLocationBudget } = require('../utils/budgetUtils');
const operationQueries = require('../models/operationModel');


async function createQuote({ userId, name, notes, amount }) {
  const amountNum = validateAmount(amount);
  return transaction(async (client) => {
    const result = await client.query(queries.insertQuote(), [userId, name, notes, amountNum, 'pending']);
    return result.rows[0];
  });
}

async function updateQuote({ id, name, notes, amount }) {
  const amountNum = validateAmount(amount);
  return transaction(async (client) => {
    const result = await client.query(
      queries.updateQuoteById(),
      [name, notes, amountNum, id, 'pending']
    );
    if (result.rows.length === 0) throw new Error('Quote not found or already processed');
    return result.rows[0];
  });
}

async function deleteQuote(id) {
  return transaction(async (client) => {
    const result = await client.query(queries.softDeleteQuote(), [id]);
    if (result.rows.length === 0) throw new Error('Quote not found or already deleted');
    return result.rows[0];
  });
}

async function payQuote({ id, userId, locationId }) {
  return transaction(async (client) => {
    const quoteResult = await client.query(queries.lockPendingQuote(), [id, 'pending']);
    if (quoteResult.rows.length === 0) throw new Error('Quote not found or already processed');

    const quote = quoteResult.rows[0];
    const quoteAmount = Number(quote.amount);

    if (locationId) {
      const locCheck = await client.query(locationQueries.getLocationNameById(), [locationId]);
      if (locCheck.rows.length === 0) throw new Error('Location not found');

      const locationName = locCheck.rows[0].name;

      // Ensure a budget row exists
      const existingBudget = await client.query(locationBudgetQueries.checkBudgetExists(), [locationId]);
      if (existingBudget.rows.length === 0) {
        await client.query(locationBudgetQueries.insertNewBudget(), [locationId, 0, userId]);
      }

      // Decrease local budget as withdrawal
      await client.query(locationBudgetQueries.incrementExistingBudget(), [
        -Math.abs(quoteAmount), userId, locationId
      ]);

      // Log the local withdrawal
      await client.query(operationQueries.insertOperation(), [
        userId,
        'local_withdrawal',
        -Math.abs(quoteAmount),
        `Withdrawal for quote: ${quote.name}`,
        locationId
      ]);

      // Log the virtual deposit
      await client.query(queries.insertVirtualDeposit(), [
        userId,
        quoteAmount,
        `Virtual deposit from location ${locationName} for direct payment`,
        locationId
      ]);

      // ✅ Increase location budget to reflect virtual deposit
      await client.query(locationBudgetQueries.incrementExistingBudget(), [
        quoteAmount, userId, locationId
      ]);
    } else {
      const budgetRes = await client.query(queries.fetchBudgetForUpdate());
      if (budgetRes.rows.length === 0) throw new Error('Central budget not found');

      const budget = budgetRes.rows[0];
      if (Number(budget.current_balance) < quoteAmount) {
        throw new Error('Insufficient funds in central budget');
      }

      await client.query(queries.updateCentralBudget(), [quoteAmount, userId, budget.id]);

      await client.query(queries.insertWithdrawalOperation(), [
        userId,
        quoteAmount,
        `Payment for quote: ${quote.name}`
      ]);
    }

    await client.query(queries.markQuoteAsPaid(), ['paid', userId, id]);

    return { paid_by: userId };
  });
}



async function getQuotes() {
  const result = await transaction(async (client) => client.query(queries.getAllQuotes()));
  return result.rows;
}

async function getQuoteById(id) {
  const result = await transaction(async (client) => client.query(queries.getQuoteByIdQuery(), [id]));
  if (result.rows.length === 0) throw new Error('Quote not found');
  return result.rows[0];
}

module.exports = {
  createQuote,
  updateQuote,
  deleteQuote,
  payQuote,
  getQuotes,
  getQuoteById
};