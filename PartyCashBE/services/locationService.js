const pool = require('../db');
const queries = require('../models/locationModel');
const { validateLocationName } = require('../utils/validate');

async function getAllLocations() {
  const result = await pool.query(queries.getAllLocations());
  return result.rows;
}

async function createLocation(name) {
  const validName = validateLocationName(name);
  const result = await pool.query(queries.insertLocation(), [validName]);
  return result.rows[0];
}

async function getLocationById(id) {
  const result = await pool.query(queries.getLocationById(), [id]);
  return result.rows[0] || null;
}

async function updateLocation(id, name) {
  const validName = validateLocationName(name);
  const result = await pool.query(queries.updateLocation(), [validName, id]);
  return result.rows[0] || null;
}

async function deleteLocation(id) {
  const result = await pool.query(queries.deleteLocation(), [id]);
  return result.rows[0] || null;
}

module.exports = {
  getAllLocations,
  createLocation,
  getLocationById,
  updateLocation,
  deleteLocation,
};
