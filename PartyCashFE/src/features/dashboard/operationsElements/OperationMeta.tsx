import { formatDate } from '@/utils/format'

type Props = {
  user: string
  date: string
}

export default function OperationMeta({ user, date }: Props) {
  return (
    <p className="text-xs text-gray-500">
      Creato da: <strong>{user}</strong> alle {formatDate(date)}
    </p>
  )
}
