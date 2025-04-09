const pool = require('../db');

async function resetService() {
  const client = await pool.connect();
  try {
    console.log('🔄 Reset database (frontend)...');

    await client.query('BEGIN');
    await client.query('SET session_replication_role = replica');

    const tables = [
      'operations',
      'quotes',
      'starting_cash',
      'location_budget',
      'location',
      'budget' // ✅ incluso anche qui
    ];

    for (const table of tables) {
      console.log(`Truncating ${table}...`);
      await client.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
    }

    // Inserisce una riga default nella tabella budget
    console.log('Inserisco riga default nella tabella budget...');
    await client.query('INSERT INTO budget DEFAULT VALUES');

    await client.query('SET session_replication_role = DEFAULT');
    await client.query('COMMIT');

    console.log('✅ Reset completato (frontend)');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Reset fallito (frontend):', err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = resetService;
