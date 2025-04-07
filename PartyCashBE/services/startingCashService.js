const queries = require('../models/startingCashModel');
const locationQueries = require('../models/locationModel');
const { validateAmount } = require('../utils/validate');
const { query, transaction } = require('../services/dbService');
const { ensureLocationBudget } = require('../utils/budgetUtils'); // ✅ correct import

async function getStartingCashByLocation(locationId) {
  const result = await query(queries.getAssignedStartingCash(), [locationId]);
  return result.rows;
}

async function getAllStartingCash() {
  const result = await query(queries.getAllStartingCash());
  return result.rows;
}

async function assignStartingCash({ locationId, amount, userId }) {
  const validatedAmount = validateAmount(amount);

  return transaction(async (client) => {
    const { rows } = await client.query(locationQueries.getLocationNameById(), [locationId]);
    const locationName = rows[0]?.name || 'Unknown Location';

    const insertResult = await client.query(
      queries.insertStartingCash(),
      [locationId, validatedAmount, userId]
    );

    // ✅ Ensure budget exists but do NOT increment it
    await ensureLocationBudget(client, locationId, 0, userId); // <- 0 to only ensure presence

    // Log operation only (no effect on budget)
    await client.query(
      queries.insertOperation(),
      [
        userId,
        'starting_cash_assigned',
        -Math.abs(validatedAmount),
        `Assegnazione fondocassa per ${locationName}`,
        locationId
      ]
    );

    return {
      starting_cash_id: insertResult.rows[0].id,
      created_at: insertResult.rows[0].created_at
    };
  });
}

async function recoverStartingCash({ id, userId, notes }) {
  return transaction(async (client) => {
    const result = await client.query(queries.selectForRecovery(), [id]);
    if (result.rows.length === 0) {
      throw new Error('Fondo già recuperato o non trovato');
    }

    const sc = result.rows[0];
    const validatedAmount = validateAmount(sc.amount);

    await client.query(
      queries.updateStartingCashRecovery(),
      [userId, notes || null, id]
    );



    await client.query(
      queries.insertOperation(),
      [
        userId,
        'starting_cash_recovered',
        Math.abs(validatedAmount),
        `Recupero fondocassa da ${sc.location_name}`,
        sc.location_id
      ]
    );

    return {
      recovered_id: id,
      created_at: sc.created_at
    };
  });
}

module.exports = {
  getStartingCashByLocation,
  getAllStartingCash,
  assignStartingCash,
  recoverStartingCash
};
