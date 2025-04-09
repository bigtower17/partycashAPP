// src/controllers/locationController.js
const locationService = require('../services/locationService')

const getLocations = async (_req, res) => {
  try {
    const data = await locationService.getAllLocations()
    res.json(data)
  } catch (error) {
    console.error('Error fetching locations:', error)
    res.status(500).send('Error fetching locations')
  }
}
const getAdminLocations = async (_req, res) => {
  try {
    const data = await locationService.getAdminLocations()
    res.json(data)
  } catch (error) {
    console.error('Error fetching locations:', error)
    res.status(500).send('Error fetching locations')
  }
}

const createLocation = async (req, res) => {
  const { name } = req.body
  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Location name is required' })
  }

  try {
    const newLoc = await locationService.createLocation(name)
    res.status(201).json(newLoc)
  } catch (error) {
    console.error('Error creating location:', error)
    res.status(500).send('Error creating location')
  }
}

const getLocationById = async (req, res) => {
  const { id } = req.params
  try {
    const loc = await locationService.getLocationById(id)
    if (!loc) return res.status(404).json({ message: 'Location not found' })
    res.json(loc)
  } catch (error) {
    console.error('Error fetching location:', error)
    res.status(500).send('Error fetching location')
  }
}

const updateLocation = async (req, res) => {
  const { id } = req.params
  const { name } = req.body

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Name is required' })
  }

  try {
    const updated = await locationService.updateLocation(id, name)
    if (!updated) return res.status(404).json({ message: 'Location not found' })
    res.json(updated)
  } catch (error) {
    console.error('Error updating location:', error)
    res.status(500).send('Error updating location')
  }
}

const deleteLocation = async (req, res) => {
  const { id } = req.params
  try {
    const deleted = await locationService.deleteLocation(id)
    if (!deleted) return res.status(404).json({ message: 'Location not found' })
    res.json({ message: 'Location deleted successfully' })
  } catch (error) {
    console.error('Error deleting location:', error)
    res.status(500).send('Error deleting location')
  }
}

const softDeleteLocation = async (req, res) => {
  const { id } = req.params
  try {
    const deleted = await locationService.softDeleteLocation(id)
    if (!deleted) return res.status(404).json({ message: 'Location not found' })
    res.json({ message: 'Location deleted successfully' })
  } catch (error) {
    console.error('Error deleting location:', error)
    res.status(500).send('Error deleting location')
  }
}

const reactivateLocation = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await locationService.reactivateLocation(id);
    if (!result) return res.status(404).json({ message: 'Location non trovata' });
    res.json({ message: 'Location riattivata', location: result });
  } catch (err) {
    console.error('Errore riattivazione:', err);
    res.status(500).send('Errore riattivazione');
  }
};

module.exports = {
  softDeleteLocation,
  reactivateLocation,
  getLocations,
  createLocation,
  getLocationById,
  updateLocation,
  deleteLocation,
  getAdminLocations,
}
