const pool = require('../db');

// Create a new expense quote
const createQuote = async (req, res) => {
  const { name, notes, amount } = req.body;
  const userId = req.user.id;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Validate amount
    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0 || amountNum > 99999999.99) {
      await client.query('ROLLBACK');
      return res.status(400).send('Invalid amount. Must be a positive number less than 99,999,999.99');
    }

   /* // Check budget
    const budgetResult = await client.query('SELECT current_balance FROM budget LIMIT 1');
    if (budgetResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).send('Budget not found');
    }
    const currentBalance = Number(budgetResult.rows[0].current_balance);
    if (isNaN(currentBalance)) {
      await client.query('ROLLBACK');
      return res.status(500).send('Invalid budget balance');
    }
    if (currentBalance < amountNum) {
      await client.query('ROLLBACK');
      return res.status(400).send(
        `Quote amount exceeds current budget. Available: ${currentBalance.toFixed(2)}, Required: ${amountNum.toFixed(2)}`
      );
    }
*/
    const result = await client.query(
      'INSERT INTO quotes (user_id, name, notes, amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [userId, name, notes, amountNum, 'pending']
    );

    await client.query('COMMIT');
    res.status(201).json({ message: 'Quote created', quoteId: result.rows[0].id });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating quote:', error);
    res.status(500).send('Error creating quote');
  } finally {
    client.release();
  }
};

// Update an existing expense quote (only if it is still pending and not deleted)
const updateQuote = async (req, res) => {
  const { id } = req.params;
  const { name, notes, amount } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Validate amount
    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0 || amountNum > 99999999.99) {
      await client.query('ROLLBACK');
      return res.status(400).send('Invalid amount. Must be a positive number less than 99,999,999.99');
    }

   /* // Check budget
    const budgetResult = await client.query('SELECT current_balance FROM budget LIMIT 1');
    if (budgetResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).send('Budget not found');
    }
    const currentBalance = Number(budgetResult.rows[0].current_balance);
    if (isNaN(currentBalance)) {
      await client.query('ROLLBACK');
      return res.status(500).send('Invalid budget balance');
    }
    if (currentBalance < amountNum) {
      await client.query('ROLLBACK');
      return res.status(400).send(
        `Quote amount exceeds current budget. Available: ${currentBalance.toFixed(2)}, Required: ${amountNum.toFixed(2)}`
      );
    }
*/
    const result = await client.query(
      'UPDATE quotes SET name = $1, notes = $2, amount = $3, updated_at = NOW() WHERE id = $4 AND status = $5 AND deleted = false RETURNING id',
      [name, notes, amountNum, id, 'pending']
    );
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).send('Quote not found, already paid, or deleted');
    }

    await client.query('COMMIT');
    res.json({ message: 'Quote updated', quoteId: result.rows[0].id });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating quote:', error);
    res.status(500).send('Error updating quote');
  } finally {
    client.release();
  }
};

// Soft delete a quote by marking it as deleted
const deleteQuote = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await client.query(
      'UPDATE quotes SET deleted = true, updated_at = NOW() WHERE id = $1 AND deleted = false RETURNING id',
      [id]
    );
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).send('Quote not found or already deleted');
    }

    await client.query('COMMIT');
    res.json({ message: 'Quote soft deleted', quoteId: result.rows[0].id });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting quote:', error);
    res.status(500).send('Error deleting quote');
  } finally {
    client.release();
  }
};

// Confirm a quote as paid (if needed)
const payQuote = async (req, res) => {
  const { id } = req.params;
  const { locationId } = req.body;
  const userId = req.user.id;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Recupera la quote da pagare
    const quoteResult = await client.query(
      'SELECT * FROM quotes WHERE id = $1 AND status = $2 AND deleted = false FOR UPDATE',
      [id, 'pending']
    );

    if (quoteResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).send('Spesa non trovata o già processata');
    }

    const quote = quoteResult.rows[0];
    const quoteAmount = Number(quote.amount);

    let locationName = null;

    if (locationId) {
      // Ottieni nome location
      const locCheck = await client.query(
        'SELECT name FROM location WHERE id = $1',
        [locationId]
      );
      if (locCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).send('Location non trovata');
      }

      locationName = locCheck.rows[0].name;

      // 1. Aggiungi importo come "deposit" (sviluppato)
      await client.query(`
        INSERT INTO operations (user_id, type, amount, description, location_id)
        VALUES ($1, 'deposit', $2, $3, $4)
      `, [
        userId,
        quoteAmount,
        `Sviluppato da location ${locationName} per pagamento diretto`,
        locationId
      ]);

      // 2. Rimuovi stesso importo come "local_withdrawal"
      await client.query(`
        INSERT INTO operations (user_id, type, amount, description, location_id)
        VALUES ($1, 'local_withdrawal', $2, $3, $4)
      `, [
        userId,
        quoteAmount,
        `Pagamento diretto da location ${locationName}`,
        locationId
      ]);

      // 3. Nessun impatto sulla cassa centrale
      // 4. Il saldo location non cambia, ma statisticamente abbiamo le info
    } else {
      // 🏦 Pagamento da cassa centrale
      const budgetResult = await client.query('SELECT id, current_balance FROM budget LIMIT 1 FOR UPDATE');
      if (budgetResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).send('Budget centrale non trovato');
      }

      const budget = budgetResult.rows[0];
      if (Number(budget.current_balance) < quoteAmount) {
        await client.query('ROLLBACK');
        return res.status(400).send('Fondi insufficienti nella cassa centrale');
      }

      await client.query(`
        UPDATE budget
        SET current_balance = current_balance - $1, updated_at = NOW(), last_updated_by = $2
        WHERE id = $3
      `, [quoteAmount, userId, budget.id]);

      await client.query(`
        INSERT INTO operations (user_id, type, amount, description)
        VALUES ($1, 'withdrawal', $2, $3)
      `, [
        userId,
        quoteAmount,
        `Pagamento spesa: ${quote.name}`
      ]);
    }

    // Marca la quote come pagata
    await client.query(`
      UPDATE quotes SET status = $1, paid_by = $2, updated_at = NOW() WHERE id = $3
    `, ['paid', userId, id]);

    await client.query('COMMIT');
    res.status(200).json({
      message: `Spesa pagata da ${locationId ? 'location' : 'cassa centrale'}`,
      paid_by: userId
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Errore nel pagamento della spesa:', error);
    res.status(500).send('Errore nel pagamento della spesa');
  } finally {
    client.release();
  }
};




// Get all quotes
const getQuotes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM quotes WHERE deleted = false ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).send('Error fetching quotes');
  }
};

// Get a single quote by ID
const getQuoteById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM quotes WHERE id = $1 AND deleted = false', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Quote not found');
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).send('Error fetching quote');
  }
};

module.exports = {
  getQuotes,
  getQuoteById,
  createQuote,
  updateQuote,
  deleteQuote,
  payQuote,
};