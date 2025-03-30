const pool = require('../db');

// ...già esistenti:
const getLocations = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM location ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).send('Error fetching locations');
  }
};

const createLocation = async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Location name is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO location (name) VALUES ($1) RETURNING *',
      [name.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating location:', error);
    res.status(500).send('Error creating location');
  }
};

// ✅ GET one location
const getLocationById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM location WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).send('Error fetching location');
  }
};

// ✅ UPDATE location
const updateLocation = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Name is required' });
  }

  try {
    const result = await pool.query(
      'UPDATE location SET name = $1 WHERE id = $2 RETURNING *',
      [name.trim(), id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).send('Error updating location');
  }
};

// ✅ DELETE location
const deleteLocation = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM location WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).send('Error deleting location');
  }
};

module.exports = {
  getLocations,
  createLocation,
  getLocationById,
  updateLocation,
  deleteLocation
};
