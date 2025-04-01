import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function LocationForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id) {
      api.get(`/locations/${id}`)
        .then(res => setName(res.data.name))
        .catch(console.error)
    }
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.put(`/locations/${id}`, { name })
      alert('Location updated')
      navigate('/locations')
    } catch (err) {
      alert('Error updating location')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold">Edit Location</h2>
      <Input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Location Name"
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </form>
  )
}
