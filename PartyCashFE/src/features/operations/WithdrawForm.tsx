import { useState } from 'react'
import api from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function WithdrawForm() {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [locationId, setLocationId] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/operations/withdraw', {
        amount: parseFloat(amount),
        description,
        locationId: parseInt(locationId),
      })
          alert('Withdrawal successful!')
          setAmount('')
      setDescription('')
      setLocationId('')
    } catch (err) {
      alert('Error during withdrawal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 space-y-4 bg-white p-6 rounded shadow"
    >
<h2 className="text-xl font-semibold">Make a Withdrawal</h2>
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
      <Input
        type="number"
        placeholder="Location ID"
        value={locationId}
        onChange={(e) => setLocationId(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Processing...' : 'Submit'}
      </Button>
    </form>
  )
}
