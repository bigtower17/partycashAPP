// src/models/locationModel.js

function getAllLocations() {
    return 'SELECT * FROM location ORDER BY name';
  }
  
  function getLocationById() {
    return 'SELECT * FROM location WHERE id = $1';
  }
  
  function insertLocation() {
    return 'INSERT INTO location (name) VALUES ($1) RETURNING *';
  }
  
  function updateLocation() {
    return 'UPDATE location SET name = $1 WHERE id = $2 RETURNING *';
  }
  
  function deleteLocation() {
    return 'DELETE FROM location WHERE id = $1 RETURNING *';
  }
  
  function getLocationNameById() {
    return 'SELECT name FROM location WHERE id = $1';
  }
  
  module.exports = {
    getAllLocations,
    getLocationById,
    insertLocation,
    updateLocation,
    deleteLocation,
    getLocationNameById, // 👈 add here
  };