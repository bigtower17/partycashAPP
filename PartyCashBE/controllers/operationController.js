// Deposit money into the shared budget
const pool = require('../db');

// Deposit money into the shared budget
const deposit = async (req, res) => {
  const { amount, description, locationId } = req.body;
  const userId = req.user.id;

  if (!locationId) {
    return res.status(400).json({ message: 'Location is required for deposits' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Verifica che la location esista
    const locationCheck = await client.query('SELECT id FROM location WHERE id = $1', [locationId]);
    if (locationCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Invalid location ID' });
    }

    // Registra l'operazione
    const result = await client.query(
      `INSERT INTO operations (user_id, type, amount, description, location_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [userId, 'deposit', amount, description, locationId]
    );

    // Aggiorna il budget condiviso
    await client.query(
      `UPDATE budget 
       SET current_balance = current_balance + $1, updated_at = NOW(), last_updated_by = $2`,
      [amount, userId]
    );

    // 🔁 Aggiorna o crea il totale sviluppato della location
    await client.query(`
      INSERT INTO location_budget (location_id, current_balance, updated_at, last_updated_by)
      VALUES ($1, $2, NOW(), $3)
      ON CONFLICT (location_id) DO UPDATE
      SET current_balance = location_budget.current_balance + $2,
          updated_at = NOW(),
          last_updated_by = $3
    `, [locationId, amount, userId]);

    await client.query('COMMIT');
    res.status(201).json({
      message: 'Deposit registrato (scarico)',
      operationId: result.rows[0].id
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Errore nel deposit:', error);
    res.status(500).send('Errore durante il deposit');
  } finally {
    client.release();
  }
};



  

// Withdraw money from the shared budget
const withdraw = async (req, res) => {
    const { amount, description } = req.body;
    const userId = req.user.id;
    try {
      // Get the current shared budget
      const budgetResult = await pool.query('SELECT current_balance FROM budget LIMIT 1');
      const currentBalance = budgetResult.rows[0]?.current_balance || 0;
      if (currentBalance < amount) {
        return res.status(400).send('Insufficient funds');
      }
      // Log the withdrawal operation (created_at auto-generated)
      const result = await pool.query(
        'INSERT INTO operations (user_id, type, amount, description) VALUES ($1, $2, $3, $4) RETURNING id',
        [userId, 'withdrawal', amount, description]
      );
      // Deduct the amount from the shared budget, update the timestamp, and record who updated it
      await pool.query(
        'UPDATE budget SET current_balance = current_balance - $1, updated_at = NOW(), last_updated_by = $2',
        [amount, userId]
      );
      res.status(201).json({ message: 'Withdrawal successful', operationId: result.rows[0].id });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error processing withdrawal');
    }
  };
  
// Get the last 10 operations
const getLastOperations = async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT description, amount, type, created_at, user_id 
        FROM operations 
        ORDER BY created_at DESC 
        LIMIT 100
      `);
  
      res.json({ operations: result.rows });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving operations');
    }
  };
  
  // Dentro operations.js
  const getOperationsWithLocation = async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          o.id, 
          o.amount, 
          o.type, 
          o.description, 
          o.created_at, 
          o.user_id, 
          o.location_id,
          l.name AS location_name -- 👈 AGGIUNGI QUESTO!
        FROM operations o
        LEFT JOIN location l ON o.location_id = l.id
        ORDER BY o.created_at DESC
        LIMIT 100
      `);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching operations with locations:', error);
      res.status(500).send('Error fetching operations');
    }
  };
  
  

module.exports = {
  deposit,
  withdraw,
  getLastOperations, 
  getOperationsWithLocation,
};
