// src/models/locationModel.js

function getAllLocations() {
  return 'SELECT * FROM location WHERE is_active = true ORDER BY name';
}

function getAdminLocations() {
  return 'SELECT * FROM location ORDER BY name';
}

function softDeleteLocation() {
  return 'UPDATE location SET is_active = false WHERE id = $1 RETURNING *';
}

function reactivateLocation() {
  return 'UPDATE location SET is_active = true WHERE id = $1 RETURNING *';
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
    softDeleteLocation,
    reactivateLocation,
    getAllLocations,
    getLocationById,
    insertLocation,
    updateLocation,
    deleteLocation,
    getLocationNameById, 
    getAdminLocations,
  };