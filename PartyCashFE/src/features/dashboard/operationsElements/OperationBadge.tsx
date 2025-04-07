import { operationStyleMap } from '@/utils/operationStyle'

type Props = {
  type: string
}

export default function OperationBadge({ type }: Props) {
  const style = operationStyleMap[type as keyof typeof operationStyleMap]
  const label = style?.label || type
  const badgeStyle = style?.badge || 'bg-gray-100 text-gray-800'

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${badgeStyle}`}>
      {label}
    </span>
  )
}
