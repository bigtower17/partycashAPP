const pool = require('../db');

const getStartingCashByLocation = async (req, res) => {
  const { locationId } = req.params;

  try {
    const result = await pool.query(`
      SELECT sc.amount, sc.created_at, u.username AS assigned_by
      FROM starting_cash sc
      LEFT JOIN users u ON sc.assigned_by = u.id
      WHERE sc.location_id = $1
    `, [locationId]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Errore recupero fondocassa');
  }
};



const assignStartingCash = async (req, res) => {
  const { locationId, amount } = req.body;
  const userId = req.user.id;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Recupera il nome della location
    const locationRes = await client.query(
      'SELECT name FROM location WHERE id = $1',
      [locationId]
    );
    const locationName = locationRes.rows[0]?.name || 'Unknown Location';

    // Inserisci fondocassa
    const insertResult = await client.query(`
      INSERT INTO starting_cash (location_id, amount, assigned_by)
      VALUES ($1, $2, $3)
      RETURNING id, created_at
    `, [locationId, amount, userId]);

    // Aggiorna il budget location
    await client.query(`
      UPDATE location_budget
      SET current_balance = current_balance + $1, updated_at = NOW(), last_updated_by = $2
      WHERE location_id = $3
    `, [amount, userId, locationId]);

    // Registra operazione come USCITA dalla cassa generale
    await client.query(`
      INSERT INTO operations (user_id, type, amount, description, location_id)
      VALUES ($1, 'starting_cash_assigned', $2, $3, $4)
      RETURNING id, created_at
    `, [
      userId,
      -Math.abs(amount), // 👈 negativo: uscita dalla cassa
      `Assegnazione fondocassa per ${locationName}`,
      locationId
    ]);

    await client.query('COMMIT');
    res.status(201).json({
      message: 'Fondocassa assegnato',
      starting_cash_id: insertResult.rows[0].id,
      created_at: insertResult.rows[0].created_at
    });  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).send('Errore assegnazione fondocassa');
  } finally {
    client.release();
  }
};

const recoverStartingCash = async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;
  const userId = req.user.id;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(`
      SELECT sc.*, l.name AS location_name
      FROM starting_cash sc
      JOIN location l ON sc.location_id = l.id
      WHERE sc.id = $1 AND sc.recovered_at IS NULL
      FOR UPDATE
    `, [id]);

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Fondo già recuperato o non trovato' });
    }

    const sc = result.rows[0];

    // Marca come recuperato
    await client.query(`
      UPDATE starting_cash
      SET recovered_at = NOW(), recovered_by = $1, recovery_notes = $2
      WHERE id = $3
      RETURNING id, created_at

    `, [userId, notes || null, id]);

    // Scala dal budget della location
    await client.query(`
      UPDATE location_budget
      SET current_balance = current_balance - $1, updated_at = NOW(), last_updated_by = $2
      WHERE location_id = $3
    `, [sc.amount, userId, sc.location_id]);

    // Registra operazione come ENTRATA nella cassa generale
    await client.query(`
      INSERT INTO operations (user_id, type, amount, description, location_id)
      VALUES ($1, 'starting_cash_recovered', $2, $3, $4)
      RETURNING id, created_at

    `, [
      userId,
      Math.abs(sc.amount), // 👈 positivo: rientro in cassa
      `Recupero fondocassa da ${sc.location_name}`,
      sc.location_id
    ]);

    await client.query('COMMIT');
    res.json({
      message: 'Fondocassa recuperato',
      recovered_id: id,
      created_at: sc.created_at // oppure result.rows[0].created_at se preferisci usare l'update
    });
      } catch (error) {
    await client.query('ROLLBACK');
    console.error('Errore nel recupero del fondocassa:', error);
    res.status(500).send('Errore nel recupero del fondocassa');
  } finally {
    client.release();
  }
};

const getAllStartingCash = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        sc.id,
        sc.location_id,
        l.name AS location,
        sc.amount,
        sc.created_at,
        u.username AS assigned_by,
        ru.username AS recovered_by,
        sc.recovered_at,
        sc.recovery_notes
      FROM starting_cash sc
      LEFT JOIN users u ON sc.assigned_by = u.id
      LEFT JOIN users ru ON sc.recovered_by = ru.id
      LEFT JOIN location l ON sc.location_id = l.id
      ORDER BY sc.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Errore nel recupero fondocassa globale:', err);
    res.status(500).send('Errore nel recupero fondocassa');
  }
};




module.exports = {
  assignStartingCash,
  getStartingCashByLocation,
  recoverStartingCash,
  getAllStartingCash, // 👈 aggiunto
};
