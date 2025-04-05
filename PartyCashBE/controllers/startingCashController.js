// src/controllers/startingCashController.js
const startingCashService = require('../services/startingCashService');

const getStartingCashByLocation = async (req, res) => {
  try {
    const rows = await startingCashService.getStartingCashByLocation(req.params.locationId);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Errore recupero fondocassa');
  }
};

const getAllStartingCash = async (_req, res) => {
  try {
    const rows = await startingCashService.getAllStartingCash();
    res.json(rows);
  } catch (err) {
    console.error('Errore nel recupero fondocassa globale:', err);
    res.status(500).send('Errore nel recupero fondocassa');
  }
};

const assignStartingCash = async (req, res) => {
  const { locationId, amount } = req.body;
  const userId = req.user.id;

  try {
    const result = await startingCashService.assignStartingCash({ locationId, amount, userId });
    res.status(201).json({ message: 'Fondocassa assegnato', ...result });
  } catch (err) {
    console.error(err);
    res.status(500).send('Errore assegnazione fondocassa');
  }
};

const recoverStartingCash = async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;
  const userId = req.user.id;

  try {
    const result = await startingCashService.recoverStartingCash({ id, userId, notes });
    res.json({ message: 'Fondocassa recuperato', ...result });
  } catch (err) {
    console.error('Errore nel recupero del fondocassa:', err.message);
    res.status(404).json({ message: err.message });
  }
};

module.exports = {
  getStartingCashByLocation,
  getAllStartingCash,
  assignStartingCash,
  recoverStartingCash
};
