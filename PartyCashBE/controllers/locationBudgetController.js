const pool = require('../db');

// GET budget di una location
const getLocationBudget = async (req, res) => {
  const { locationId } = req.params;

  try {
    const result = await pool.query(`
      SELECT lb.current_balance, l.name AS location_name, lb.updated_at, lb.last_updated_by
      FROM location_budget lb
      JOIN location l ON lb.location_id = l.id
      WHERE lb.location_id = $1
    `, [locationId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Budget per location non trovato' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Errore nel recupero del budget:', error);
    res.status(500).send('Errore nel recupero del budget della location');
  }
};

// POST o PATCH per registrare l'incasso totale sviluppato da una location
const updateLocationBudget = async (req, res) => {
  const { locationId } = req.params;
  const { amount } = req.body;
  const userId = req.user.id;

  if (isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({ message: 'L\'importo deve essere un numero positivo' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const check = await client.query(
      'SELECT current_balance FROM location_budget WHERE location_id = $1 FOR UPDATE',
      [locationId]
    );

    if (check.rows.length === 0) {
      // Crea il primo record per la location
      await client.query(
        `INSERT INTO location_budget (location_id, current_balance, updated_at, last_updated_by)
         VALUES ($1, $2, NOW(), $3)`,
        [locationId, amount, userId]
      );

      await client.query('COMMIT');
      return res.status(201).json({ message: 'Budget creato', new_balance: amount });
    }

    // Aggiorna il totale sviluppato sommando l'incasso
    const currentBalance = Number(check.rows[0].current_balance);
    const newBalance = currentBalance + Number(amount);

    await client.query(
      `UPDATE location_budget
       SET current_balance = $1, updated_at = NOW(), last_updated_by = $2
       WHERE location_id = $3`,
      [newBalance, userId, locationId]
    );

    await client.query('COMMIT');
    res.json({ message: 'Budget aggiornato', new_balance: newBalance });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Errore aggiornamento budget location:', error);
    res.status(500).send('Errore aggiornamento budget location');
  } finally {
    client.release();
  }
};

module.exports = {
  getLocationBudget,
  updateLocationBudget
};
