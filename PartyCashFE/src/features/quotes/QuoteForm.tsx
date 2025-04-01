import { useState } from 'react'
import api from '@/lib/api'

type Props = {
  onQuoteCreated: () => void
}

export default function QuoteForm({ onQuoteCreated }: Props) {
  const [form, setForm] = useState({ name: '', notes: '', amount: '' })

  const handleCreate = async () => {
    if (!form.name || !form.amount) return
    try {
      await api.post('/quotes', {
        name: form.name,
        notes: form.notes,
        amount: parseFloat(form.amount),
      })
      setForm({ name: '', notes: '', amount: '' })
      onQuoteCreated()
    } catch (err) {
      console.error('Error creating quote:', err)
    }
  }

  return (
    <div className="bg-white p-4 shadow rounded-md space-y-3">
      <input
        className="border p-2 rounded w-full"
        placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="border p-2 rounded w-full"
        placeholder="Notes"
        value={form.notes}
        onChange={e => setForm({ ...form, notes: e.target.value })}
      />
      <input
        type="number"
        className="border p-2 rounded w-full"
        placeholder="Amount"
        value={form.amount}
        onChange={e => setForm({ ...form, amount: e.target.value })}
      />
      <button
        onClick={handleCreate}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Add Quote
      </button>
    </div>
  )
}
