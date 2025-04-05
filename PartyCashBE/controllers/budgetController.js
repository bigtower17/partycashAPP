const { fetchSharedBudget } = require('../services/budgetService');

const getBudget = async (req, res) => {
  try {
    const current_balance = await fetchSharedBudget();
    res.json({ current_balance });
  } catch (error) {
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'No budget record found' });
    }

    console.error('Error retrieving budget:', error);
    res.status(500).json({ message: 'Error retrieving budget' });
  }
};

module.exports = { getBudget };
