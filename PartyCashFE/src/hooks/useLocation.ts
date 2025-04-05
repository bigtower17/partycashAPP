import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Location } from '@/types'

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all locations from the API
  const fetchLocations = async () => {
    setLoading(true)
    try {
      const res = await api.get('/locations')
      setLocations(res.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching locations:', err)
      setError('Error fetching locations')
    } finally {
      setLoading(false)
    }
  }

  // Create a new location
  const createLocation = async (locationData: Partial<Location>) => {
    try {
      const res = await api.post('/locations', locationData)
      // Assuming the API returns the newly created location in res.data
      setLocations((prev) => [...prev, res.data])
    } catch (err) {
      console.error('Error creating location:', err)
      throw new Error('Error creating location')
    }
  }

  // Update an existing location
  const updateLocation = async (id: number, locationData: Partial<Location>) => {
    try {
      await api.put(`/locations/${id}`, locationData)
      setLocations((prev) =>
        prev.map((loc) => (loc.id === id ? { ...loc, ...locationData } : loc))
      )
    } catch (err) {
      console.error('Error updating location:', err)
      throw new Error('Error updating location')
    }
  }

  // Delete a location
  const deleteLocation = async (id: number) => {
    try {
      await api.delete(`/locations/${id}`)
      setLocations((prev) => prev.filter((loc) => loc.id !== id))
    } catch (err) {
      console.error('Error deleting location:', err)
      throw new Error('Error deleting location')
    }
  }

  // Optionally, fetch locations on mount
  useEffect(() => {
    fetchLocations()
  }, [])

  return { locations, loading, error, fetchLocations, createLocation, updateLocation, deleteLocation }
}
