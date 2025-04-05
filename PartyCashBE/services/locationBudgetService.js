// src/services/locationBudgetService.js
const pool = require('../db')

async function fetchLocationBudget(locationId) {
  const result = await pool.query(`
    SELECT lb.current_balance, l.name AS location_name, lb.updated_at, lb.last_updated_by
    FROM location_budget lb
    JOIN location l ON lb.location_id = l.id
    WHERE lb.location_id = $1
  `, [locationId])

  return result.rows[0] || null
}

async function updateOrCreateLocationBudget(locationId, amount, userId) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const check = await client.query(
      'SELECT current_balance FROM location_budget WHERE location_id = $1 FOR UPDATE',
      [locationId]
    )

    if (check.rows.length === 0) {
      await client.query(`
        INSERT INTO location_budget (location_id, current_balance, updated_at, last_updated_by)
        VALUES ($1, $2, NOW(), $3)
      `, [locationId, amount, userId])

      await client.query('COMMIT')
      return { created: true, new_balance: amount }
    }

    const newBalance = Number(check.rows[0].current_balance) + Number(amount)

    await client.query(`
      UPDATE location_budget
      SET current_balance = $1, updated_at = NOW(), last_updated_by = $2
      WHERE location_id = $3
    `, [newBalance, userId, locationId])

    await client.query('COMMIT')
    return { created: false, new_balance: newBalance }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

module.exports = {
  fetchLocationBudget,
  updateOrCreateLocationBudget
}
