import { useEffect, useState } from 'react'
import api from '@/lib/api'

type Location = {
  id: number
  name: string
}

type LocationDropdownProps = {
  value: string
  onChange: (value: string) => void
  onSelectLocation?: (location: Location | null) => void
}

export default function LocationDropdown({ value, onChange, onSelectLocation }: LocationDropdownProps) {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true)
      try {
        const response = await api.get('/locations')
        setLocations(response.data)
      } catch (error) {
        console.error('Errore caricamento postazioni:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchLocations()
  }, [])

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value
    onChange(selectedValue)
    if (onSelectLocation) {
      const selectedLocation = locations.find(loc => String(loc.id) === selectedValue) || null
      onSelectLocation(selectedLocation)
    }
  }

  return (
    <div>
      <label className="block mb-1 font-medium">Postazione</label>
      <select
        value={value}
        onChange={handleSelect}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Scegli postazione</option>
        {locations.map((loc) => (
          <option key={loc.id} value={loc.id}>
            {loc.name}
          </option>
        ))}
      </select>
      {loading && <p className="text-sm text-gray-500">Caricamento postazioni...</p>}
    </div>
  )
}
