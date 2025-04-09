import { useState } from 'react'
import api from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function WithdrawForm() {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleCloseModal = () => {
    setModalOpen(false)
    setErrorMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/operations/withdraw', {
        amount: parseFloat(amount),
        description,
      })
      alert('Withdrawal successful!')
      setAmount('')
      setDescription('')
    } catch (err: any) {
      // Check for error message coming from the backend (e.g., insufficient funds)
      const message =
        err?.response?.data?.message || 'Error during withdrawal'
      setErrorMessage(message)
      setModalOpen(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-10 space-y-4 bg-white p-6 rounded shadow"
      >
        <h2 className="text-xl font-semibold">Effettua Pagamento</h2>
        <Input
          type="number"
          placeholder="Importo"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Descrizione"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading} className="w-full bg-cyan-900 text-white">
          {loading ? 'Elaborazione...' : 'Effettua Pagamento'}
        </Button>
      </form>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm mx-auto">
            <h3 className="text-xl font-semibold mb-4">Errore nel pagamento</h3>
            <p className="mb-4">{errorMessage}</p>
            <Button onClick={handleCloseModal}>Chiudi</Button>
          </div>
        </div>
      )}
    </>
  )
}
