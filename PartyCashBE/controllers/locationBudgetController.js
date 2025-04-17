// src/controllers/locationBudgetController.js
const locationBudgetService = require('../services/locationBudgetService')

const getLocationBudget = async (req, res) => {
  const { locationId } = req.params

  try {
    const data = await locationBudgetService.fetchLocationBudget(locationId)
    if (!data) return res.status(404).json({ message: 'Budget per location non trovato' })
    res.json(data)
  } catch (error) {
    console.error('Errore nel recupero del budget:', error)
    res.status(500).send('Errore nel recupero del budget della location')
  }
}

const updateLocationBudget = async (req, res) => {
  const { locationId } = req.params;
  const { amount, init } = req.body;
  const userId = req.user.id; // ← viene già preso dal token (non serve passarlo dal client se usi JWT)
  

  if (!init && (isNaN(amount) || Number(amount) <= 0)) {
    return res.status(400).json({ message: 'L\'importo deve essere un numero positivo' })
  }

  try {
    const result = await locationBudgetService.updateOrCreateLocationBudget(locationId, amount, userId)
    res.status(result.created ? 201 : 200).json({
      message: result.created ? 'Budget creato' : 'Budget aggiornato',
      new_balance: result.new_balance
    })
  } catch (error) {
    console.error('Errore aggiornamento budget location:', error)
    res.status(500).send('Errore aggiornamento budget location')
  }
}

const getAllLocationBudgets = async (req, res) => {
  try {
    const budgets = await locationBudgetService.fetchAllLocationBudgets();
    res.json(budgets);
  } catch (err) {
    console.error('Error fetching location budgets:', err);
    res.status(500).send('Errore del server');
  }
};
// src/controllers/operationController.js

const operationService = require('../services/operationService');

const getPosOperations = async (_req, res) => {
  try {
    const operations = await operationService.getPosOperations();
    res.json({ operations });
  } catch (error) {
    console.error('Error retrieving POS operations:', error.message);
    res.status(500).send('Error retrieving POS operations');
  }
};

const getCashOperations = async (_req, res) => {
  try {
    const operations = await operationService.getCashOperations();
    res.json({ operations });
  } catch (error) {
    console.error('Error retrieving cash operations:', error.message);
    res.status(500).send('Error retrieving cash operations');
  }
};


module.exports = {
  getLocationBudget,
  updateLocationBudget,
  getAllLocationBudgets,
  getPosOperations,
  getCashOperations

};
