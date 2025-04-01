import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

type Location = {
  id: number
  name: string
  // Add other fields as needed
}

export function LocationList() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Assuming you have a GET /locations endpoint
    api.get('/locations')
      .then(res => setLocations(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await api.delete(`/locations/${id}`)
        setLocations(locations.filter(loc => loc.id !== id))
      } catch (err) {
        alert('Error deleting location')
      }
    }
  }

  if (loading) return <p>Loading locations...</p>

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-bold mb-4">Locations</h2>
      {locations.map(loc => (
        <Card key={loc.id}>
          <CardHeader>
            <CardTitle>{loc.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button variant="outline" onClick={() => navigate(`/locations/${loc.id}`)}>
              Edit
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(loc.id)}>
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
