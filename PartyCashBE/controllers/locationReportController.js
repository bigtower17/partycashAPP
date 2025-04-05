// src/controllers/reportController.js
const reportService = require('../services/locationReportService');

const getLocationReports = async (_req, res) => {
  try {
    const data = await reportService.getLocationReports();
    res.json(data);
  } catch (error) {
    console.error('Errore generazione report location:', error);
    res.status(500).send('Errore generazione report location');
  }
};

module.exports = { getLocationReports };
