import { useState, FormEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Location } from '@/types'
import api from '@/lib/api'
import LocationDropdown from '@/components/ui/LocationDropdown'

type Props = {
  locations: Location[]
  onAssigned: () => void
}

export default function StartingCashForm({ locations, onAssigned }: Props) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [amount, setAmount] = useState('')
  const [loadingAssign, setLoadingAssign] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!selectedLocation || !selectedLocation.id) {
      alert('Seleziona una postazione valida')
      return
    }

    setLoadingAssign(true)
    try {
      await api.post('/starting-cash', {
        locationId: selectedLocation.id,
        amount: parseFloat(amount)
      })
      alert('Fondocassa assegnato correttamente')
      setAmount('')
      setSelectedLocation(null)
      onAssigned()
    } catch (err) {
      console.error(err)
      alert('Errore nell\'assegnazione del fondocassa')
    } finally {
      setLoadingAssign(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold">Assegna Fondocassa</h2>

      <LocationDropdown
        value={selectedLocation?.id?.toString() || ''}
        onChange={() => {}}
        onSelectLocation={(loc) => setSelectedLocation(loc)}
      />

      <Input
        type="number"
        placeholder="Importo"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <div className="flex justify-center">
        <Button className="bg-cyan-800 text-white w-full" variant='outline' type="submit" disabled={loadingAssign}>
          {loadingAssign ? 'Assegnando...' : 'Assegna Fondocassa'}
        </Button>
      </div>
    </form>
  )
}
