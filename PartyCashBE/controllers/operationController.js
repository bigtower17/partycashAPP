// src/controllers/operationController.js
const operationService = require('../services/operationService');

const deposit = async (req, res) => {
  const { amount, description, locationId } = req.body;
  const userId = req.user.id;

  try {
    const operationId = await operationService.deposit({ amount, description, locationId, userId });
    res.status(201).json({ message: 'Deposit registrato', operationId });
  } catch (error) {
    console.error('Errore nel deposit:', error.message);
    res.status(400).json({ message: error.message || 'Errore durante il deposit' });
  }
};

const withdraw = async (req, res) => {
  const { amount, description } = req.body;
  const userId = req.user.id;

  try {
    const operationId = await operationService.withdraw({ amount, description, userId });
    res.status(201).json({ message: 'Withdrawal successful', operationId });
  } catch (error) {
    console.error('Errore nel withdrawal:', error.message);
    res.status(400).json({ message: error.message || 'Errore durante il withdrawal' });
  }
};

const getLastOperations = async (_req, res) => {
  try {
    const operations = await operationService.getLastOperations();
    res.json({ operations });
  } catch (error) {
    console.error('Error retrieving operations:', error.message);
    res.status(500).send('Error retrieving operations');
  }
};

const getOperationsWithLocation = async (_req, res) => {
  try {
    const operations = await operationService.getOperationsWithLocation();
    res.json(operations);
  } catch (error) {
    console.error('Error fetching operations with locations:', error.message);
    res.status(500).send('Error fetching operations');
  }
};

module.exports = {
  deposit,
  withdraw,
  getLastOperations,
  getOperationsWithLocation
};
