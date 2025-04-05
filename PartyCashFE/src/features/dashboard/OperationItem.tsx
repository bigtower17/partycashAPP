// File: src/features/dashboard/OperationItem.tsx
import { Operation } from '@/types'

type Props = {
  operation: Operation
  getUser: (id: number) => string
}

export default function OperationItem({ operation, getUser }: Props) {
  const operationDate = new Date(operation.created_at).toLocaleString()

  // Mapping for badge styles, border color, and label text based on operation type.
  const styles: Record<string, { badge: string; border: string; label: string }> = {
    deposit: {
      badge: 'bg-green-100 text-green-800',
      border: 'border-green-500',
      label: 'Scarico Cassa'
    },
    local_withdrawal: {
      badge: 'bg-yellow-100 text-yellow-800',
      border: 'border-yellow-500',
      label: 'Pagamento da Postazione'
    },
    starting_cash_assigned: {
      badge: 'bg-red-100 text-red-800',
      border: 'border-red-500',
      label: 'Fondocassa assegnato'
    },
    starting_cash_recovered: {
      badge: 'bg-blue-100 text-blue-800',
      border: 'border-blue-500',
      label: 'Fondocassa recuperato'
    },
    withdrawal: {
      badge: 'bg-orange-100 text-orange-800',
      border: 'border-orange-500',
      label: 'Pagamento cassa generale'
    }
  }

  // Fallback style if the operation type is not defined.
  const { badge, border, label } = styles[operation.type] || {
    badge: 'bg-gray-100 text-gray-800',
    border: 'border-gray-500',
    label: operation.type
  }

  return (
    <div className={`p-4 bg-white shadow-sm rounded border-l-4 ${border} hover:shadow-md transition`}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">
              {operation.description || 'Operation'}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${badge}`}>
              {label}
            </span>
          </div>
          <div className="text-green-700 font-bold">
            € {parseFloat(operation.amount).toFixed(2)}
          </div>
          <p className="text-xs text-gray-500">
            Created by: <strong>{getUser(operation.user_id)}</strong> at {operationDate}
          </p>
        </div>
      </div>
    </div>
  )
}
