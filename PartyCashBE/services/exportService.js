// src/services/exportService.js
const pool = require('../db');
const queries = require('../models/exportModel');
const {
  formatCurrency,
  formatOperationRow,
  formatDate
} = require('../utils/format');
const { generateSignedUrlToken } = require('../utils/signedUrl');

async function fetchOperations() {
  const result = await pool.query(queries.getAllOperations());
  return result.rows.map(formatOperationRow);
}

async function fetchLocationReportData() {
  const locations = await pool.query(queries.getAllLocations());
  const reportData = [];

  for (const loc of locations.rows) {
    const locationId = loc.id;

    const [startingCashRes, incassoRes, opsRes] = await Promise.all([
      pool.query(queries.getStartingCashTotal, [locationId]),
      pool.query(queries.getLocationBudget, [locationId]),
      pool.query(queries.getOperationsCount, [locationId]),
    ]);

    reportData.push({
      location: loc.name,
      starting_cash: formatCurrency(startingCashRes.rows[0].total),
      total_incasso: formatCurrency(incassoRes.rows[0]?.current_balance),
      operations: opsRes.rows[0].count
    });
  }

  return reportData;
}

async function fetchLocationDetailsForPDF() {
  const locations = await pool.query(queries.getAllLocations());
  const data = [];

  for (const loc of locations.rows) {
    const locationId = loc.id;

    const startingCash = await pool.query(queries.getStartingCashTotal(), [locationId]);
    const totalIncasso = await pool.query(queries.getLocationBudget(), [locationId]);
    const operations = await pool.query(queries.getOperationsByLocation(), [locationId]);

    data.push({
      name: loc.name,
      startingCash: formatCurrency(startingCash.rows[0].total),
      totalIncasso: formatCurrency(totalIncasso.rows[0]?.current_balance),
      operations: operations.rows.map(op => ({
        ...op,
        amount: formatCurrency(op.amount),
        created_at: formatDate(op.created_at)
      }))
    });
  }

  return data;
}

async function generateExportUrl(report, type) {
  const allowedReports = ['operations', 'locations'];
  const allowedTypes = ['csv', 'pdf'];

  if (!allowedReports.includes(report) || !allowedTypes.includes(type)) {
    throw new Error('Tipo di report o formato non valido');
  }

  const token = generateSignedUrlToken({ report, type });
  const url = `${process.env.BASE_URL || 'http://localhost:3000'}/export/${report}/${type}?token=${token}`;

  return url;
}


module.exports = {
  fetchOperations,
  fetchLocationReportData,
  fetchLocationDetailsForPDF,
  generateExportUrl
};
