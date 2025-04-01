import { useState } from 'react'
import api from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import LocationDropdown from '@/components/LocationDropdown' // adjust the import path as needed

export default function DepositForm() {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [locationId, setLocationId] = useState('')
  const [selectedLocationName, setSelectedLocationName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const finalDescription = selectedLocationName
        ? `${selectedLocationName}: ${description}`
        : description
      await api.post('/operations/deposit', {
        amount: parseFloat(amount),
        description: finalDescription,
        locationId: parseInt(locationId),
      })
      alert('Deposit successful!')
      setAmount('')
      setDescription('')
      setLocationId('')
      setSelectedLocationName('')
    } catch (err) {
      alert('Error during deposit')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 space-y-4 bg-white p-6 rounded shadow"
    >
      <h2 className="text-xl font-semibold">Make a Deposit</h2>
      <Input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <Input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <LocationDropdown
        value={locationId}
        onChange={setLocationId}
        onSelectLocation={(location) => {
          setSelectedLocationName(location ? location.name : '')
        }}
      />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Processing...' : 'Submit'}
      </Button>
    </form>
  )
}