const pool = require('../db');

const getLocationReports = async (req, res) => {
  try {
    const locationsResult = await pool.query('SELECT id, name FROM location ORDER BY name');
    const locations = locationsResult.rows;

    const report = [];

    for (const loc of locations) {
      const locationId = loc.id;

      // Fondocassa iniziale non ancora recuperato
      const startingCashResult = await pool.query(`
        SELECT COALESCE(SUM(amount), 0) AS total
        FROM starting_cash
        WHERE location_id = $1 AND recovered_at IS NULL
      `, [locationId]);
      const startingCash = Number(startingCashResult.rows[0].total);

      // Totale sviluppato (storico incassi)
      const budgetResult = await pool.query(`
        SELECT current_balance FROM location_budget WHERE location_id = $1
      `, [locationId]);

      const developedTotal = budgetResult.rows.length > 0
        ? Number(budgetResult.rows[0].current_balance)
        : 0;

      // Operazioni associate alla location
      const operationsResult = await pool.query(`
        SELECT id, type, amount, description, created_at
        FROM operations
        WHERE location_id = $1
        ORDER BY created_at DESC
      `, [locationId]);

      const formattedOps = operationsResult.rows.map(op => ({
        id: op.id,
        type: op.type,
        amount: Number(op.amount).toFixed(2),
        description: op.description || '-',
        created_at: new Date(op.created_at).toLocaleString()
      }));

      report.push({
        location_id: locationId,
        location: loc.name,
        starting_cash: startingCash.toFixed(2),
        total_collected: developedTotal.toFixed(2),
        operations: formattedOps
      });
    }

    res.json(report);
  } catch (error) {
    console.error('Errore generazione report location:', error);
    res.status(500).send('Errore generazione report location');
  }
};

module.exports = { getLocationReports };
