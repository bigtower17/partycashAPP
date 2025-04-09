import { useEffect, useState } from 'react'
import api from '@/lib/api'
import StartingCashForm from './StartingCashForm'
import StartingCashCard from './StartingCashCard'
import { StartingCash, Location } from '@/types'

export default function StartingCashManager() {
  const [locations, setLocations] = useState<Location[]>([])
  const [cashList, setCashList] = useState<StartingCash[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [processingId, setProcessingId] = useState<number | null>(null)

  useEffect(() => {
    api.get('/locations')
      .then(res => setLocations(res.data))
      .catch(err => console.error('Error fetching locations:', err))
  }, [])

  const fetchCashAssignments = () => {
    setLoadingList(true)
    api.get('/starting-cash/all')
      .then(res => setCashList(res.data))
      .catch(err => console.error('Error fetching starting cash:', err))
      .finally(() => setLoadingList(false))
  }

  useEffect(() => {
    fetchCashAssignments()
  }, [])

  const handleReimburse = async (entryId: number) => {
    setProcessingId(entryId)
    try {
      await api.post(`/starting-cash/recover/${entryId}`, { notes: 'Rimborsato' })
      fetchCashAssignments()
    } catch (err) {
      console.error(err)
      alert('Error reimbursing starting cash')
    } finally {
      setProcessingId(null)
    }
  }

  const unreimbursed = cashList.filter(entry => entry.recovered_at === null)
  const reimbursed = cashList.filter(entry => entry.recovered_at !== null)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Gestione Fondocassa</h1>

      <StartingCashForm locations={locations} onAssigned={fetchCashAssignments} />

      <h2 className="text-xl font-bold mb-2">Fondocassa attivi</h2>
      {loadingList ? (
        <p>Caricamento fondocassa...</p>
      ) : unreimbursed.length === 0 ? (
        <p>Nessun fondocassa attivo.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {unreimbursed.map(entry => (
            <StartingCashCard
              key={entry.id}
              entry={entry}
              locations={locations}
              onReimburse={handleReimburse}
              processing={processingId === entry.id}
            />
          ))}
        </div>
      )}

      <h2 className="text-xl font-bold mt-8 mb-2">Fondocassa rimborsati</h2>
      {reimbursed.length === 0 ? (
        <p>Nessun fondocassa rimborsato</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {reimbursed.map(entry => (
            <StartingCashCard
              key={entry.id}
              entry={entry}
              locations={locations}
              onReimburse={() => {}}
              processing={false}
            />
          ))}
        </div>
      )}
    </div>
  )
}
