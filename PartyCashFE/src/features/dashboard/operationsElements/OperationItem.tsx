import { Operation } from '@/types'
import OperationBadge from './OperationBadge'
import OperationAmount from './OperationAmount'
import OperationMeta from './OperationMeta'
import { operationStyleMap } from '@/utils/operationStyle'

type Props = {
  operation: Operation
  getUser: (id: number) => string
}

export default function OperationItem({ operation, getUser }: Props) {
  const border =
    operationStyleMap[operation.type as keyof typeof operationStyleMap]?.border ||
    'border-gray-300'

  return (
    <div
      className={`p-4 bg-white shadow-sm rounded-lg border-l-4 ${border} hover:shadow-md transition`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-gray-800">
            {operation.description || 'Operazione'}
          </h3>

          {/* Primary badge for the operation type */}
          <OperationBadge type={operation.type} />

          {/* Secondary “POS” badge, shown only when is_pos === true */}
          {operation.is_pos && (
            <OperationBadge type="pos" />
          )}
        </div>

        <OperationAmount
          type={operation.type}
          amount={parseFloat(operation.amount)}
        />
        <OperationMeta
          user={getUser(operation.user_id)}
          date={operation.created_at}
        />
      </div>
    </div>
  )
}
