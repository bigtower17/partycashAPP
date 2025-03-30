const pool = require('../db');

const getBudget = async (req, res) => {
  try {
    const result = await pool.query('SELECT current_balance FROM budget LIMIT 1');
    
    // Check if a row exists
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No budget record found" });
    }

    res.json({ current_balance: result.rows[0].current_balance }); // ✅ Corrected response
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving budget');
  }
};

module.exports = { getBudget };
