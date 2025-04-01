import { useState, FormEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Location } from './types'
import api from '@/lib/api'

type Props = {
  locations: Location[]
  onAssigned: () => void
}

export default function StartingCashForm({ locations, onAssigned }: Props) {
  const [selectedLocation, setSelectedLocation] = useState<number>(locations[0]?.id || 0)
  const [amount, setAmount] = useState('')
  const [loadingAssign, setLoadingAssign] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoadingAssign(true)
    try {
      await api.post('/starting-cash', {
        locationId: selectedLocation,
        amount: parseFloat(amount)
      })
      alert('Starting cash assigned')
      setAmount('')
      onAssigned()
    } catch (err) {
      console.error(err)
      alert('Error assigning starting cash')
    } finally {
      setLoadingAssign(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold">Assign Starting Cash</h2>
      <div className="flex flex-col space-y-2">
        <label className="font-medium">Select Location</label>
        <select
          className="border border-gray-300 p-2 rounded"
          value={selectedLocation}
          onChange={e => setSelectedLocation(Number(e.target.value))}
        >
          {locations.map(loc => (
            <option key={loc.id} value={loc.id}>{loc.name}</option>
          ))}
        </select>
      </div>
      <Input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        required
      />
      <Button type="submit" disabled={loadingAssign}>
        {loadingAssign ? 'Assigning...' : 'Assign Starting Cash'}
      </Button>
    </form>
  )
}
