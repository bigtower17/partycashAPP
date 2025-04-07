export const operationStyleMap: Record<
  string,
  {
    label: string
    badge: string
    text: string
    border: string
    prefix: string
  }
> = {
  deposit: {
    label: 'Scarico Cassa',
    badge: 'bg-green-100 text-green-800',
    text: 'text-green-700 font-semibold',
    border: 'border-green-500',
    prefix: '+'
  },
  withdrawal: {
    label: 'Pagamento Cassa Generale',
    badge: 'bg-red-100 text-red-800',
    text: 'text-red-600 font-semibold',
    border: 'border-red-500',
    prefix: '-'
  },
  local_withdrawal: {
    label: 'Pagamento da Postazione',
    badge: 'bg-yellow-100 text-yellow-800',
    text: 'text-orange-500 font-semibold',
    border: 'border-orange-500',
    prefix: '-'
  },
  deposit_virtual: {
    label: 'Scarico Virtuale',
    badge: 'bg-gray-100 text-gray-800',
    text: 'text-green-700 font-semibold',
    border: 'border-gray-400',
    prefix: '+'
  },
  starting_cash_assigned: {
    label: 'Fondocassa assegnato',
    badge: 'bg-red-100 text-red-800',
    text: 'text-yellow-600 font-semibold',
    border: 'border-pink-300',
    prefix: '-'
  },
  starting_cash_recovered: {
    label: 'Fondocassa recuperato',
    badge: 'bg-blue-100 text-blue-800',
    text: 'text-blue-600 font-semibold',
    border: 'border-blue-500',
    prefix: '+'
  }
  
}
