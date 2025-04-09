import { formatEuro } from '@/utils/format'
import { operationStyleMap } from '@/utils/operationStyle'

type Props = {
  amount: number
  type: string
}

export default function OperationAmount({ amount, type }: Props) {
  const absAmount = Math.abs(amount)
  const style = operationStyleMap[type as keyof typeof operationStyleMap]

  const prefix = amount >= 0 ? '+' : '-' // determine from value
  const textClass = style?.text || 'text-gray-700 font-medium'

  return (
    <div className={textClass}>
      {prefix}{formatEuro(absAmount)}
    </div>
  )
}
