import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import api from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function LocationForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()  // Catturiamo lo state della navigazione per sapere da dove siamo arrivati
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const isEdit = id && id !== 'new'

  useEffect(() => {
    if (isEdit) {
      api.get(`/locations/${id}`)
        .then(res => setName(res.data.name))
        .catch(console.error)
    }
  }, [id, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isEdit) {
        await api.put(`/locations/${id}`, { name })
        alert('Location updated')
      } else {
        await api.post('/locations', { name })
        alert('Location created')
      }
      // Se nel location.state è definita una proprietà "from", naviga su quella, altrimenti naviga a '/locations'
      const from = (location.state && location.state.from) || '/locations'
      navigate(from)
    } catch (err) {
      alert('Errore salvataggio location')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold">
        {isEdit ? 'Modifica Location' : 'Nuova Location'}
      </h2>
      <Input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Nome della Postazione"
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Salvataggio...' : isEdit ? 'Salva Modifiche' : 'Crea'}
      </Button>
    </form>
  )
}
