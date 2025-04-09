import { useState } from 'react'
import api from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type Props = {
  onQuoteCreated: () => void
}

export default function QuoteForm({ onQuoteCreated }: Props) {
  const [form, setForm] = useState({ name: '', notes: '', amount: '' })
  const [loading, setLoading] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.amount) return
    setLoading(true)
    try {
      await api.post('/quotes', {
        name: form.name,
        notes: form.notes,
        amount: parseFloat(form.amount),
      })
      setForm({ name: '', notes: '', amount: '' })
      onQuoteCreated()
    } catch (err) {
      console.error('Errore creazione spesa:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form 
      onSubmit={handleCreate} 
      className="max-w-md mx-auto mt-10 space-y-4 bg-white p-6 rounded shadow"
    >
      <h2 className="text-xl font-semibold">Aggiungi Spesa</h2>
      <Input
        type="text"
        placeholder="Nome"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <Input
        type="text"
        placeholder="Descrizione"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
      />
      <Input
        type="number"
        placeholder="Importo"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
        required
      />
      <Button 
        type="submit" 
        disabled={loading} 
        className="w-full bg-cyan-900 text-white"
      >
        {loading ? 'Creazione in corso...' : 'Aggiungi Spesa'}
      </Button>
    </form>
  )
}
