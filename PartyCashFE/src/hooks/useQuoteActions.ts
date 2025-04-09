// src/hooks/useQuoteActions.ts
import { useState } from 'react'
import api from '@/lib/api'
import { Quote } from '@/types'

export function useQuoteActions(quote: Quote, onUpdated: () => void) {
  // 'shared' indicates using the shared budget; otherwise, a location ID (number)
  const [paymentSource, setPaymentSource] = useState<number | 'shared'>('shared')

  const handleEdit = async () => {
    const newName = prompt('Edit name:', quote.name)
    const newNotes = prompt('Edit notes:', quote.notes)
    const newAmount = prompt('Edit amount:', quote.amount)
    if (newName && newAmount) {
      try {
        await api.put(`/quotes/${quote.id}`, {
          name: newName,
          notes: newNotes ?? '',
          amount: parseFloat(newAmount),
        })
        onUpdated()
      } catch (err) {
        console.error('Error updating quote:', err)
      }
    }
  }

  const handlePay = async () => {
    try {
      // If shared budget is selected, send an empty body; otherwise, include the locationId.
      const body = paymentSource === 'shared' ? {} : { locationId: paymentSource }
      await api.post(`/quotes/${quote.id}/pay`, body)
      onUpdated()
    } catch (err) {
      console.error('Error paying quote:', err)
    }
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Sei sicuro di voler eliminare la spesa "${quote.name}"?`)
    if (!confirmDelete) return
    try {
      await api.delete(`/quotes/${quote.id}`)
      onUpdated()
    } catch (err) {
      console.error('Error deleting quote:', err)
    }
  }

  const handlePaymentSourceChange = (value: string) => {
    if (value === 'shared') {
      setPaymentSource('shared')
    } else {
      setPaymentSource(parseInt(value, 10))
    }
  }

  return { paymentSource, handlePaymentSourceChange, handleEdit, handlePay, handleDelete }
}
