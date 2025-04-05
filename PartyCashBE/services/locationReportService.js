const pool = require('../db');
const queries = require('../models/locationReportModel');
const { formatOperations } = require('../utils/reportUtils');

async function getLocationReports() {
  const locationsResult = await pool.query(queries.getAllLocations());
  const locations = locationsResult.rows;

  const report = [];

  for (const loc of locations) {
    const locationId = loc.id;

    const startingCashResult = await pool.query(queries.getStartingCashSum(), [locationId]);
    const startingCash = Number(startingCashResult.rows[0].total);

    const budgetResult = await pool.query(queries.getLocationBudget(), [locationId]);
    const developedTotal = budgetResult.rows.length > 0
      ? Number(budgetResult.rows[0].current_balance)
      : 0;

    const operationsResult = await pool.query(queries.getOperationsByLocation(), [locationId]);
    const formattedOps = formatOperations(operationsResult.rows);

    report.push({
      location_id: locationId,
      location: loc.name,
      starting_cash: startingCash.toFixed(2),
      total_collected: developedTotal.toFixed(2),
      operations: formattedOps
    });
  }

  return report;
}

module.exports = { getLocationReports };
