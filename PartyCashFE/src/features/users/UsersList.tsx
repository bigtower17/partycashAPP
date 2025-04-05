import { User } from '@/types'
import UserItem from './UserItem'

type Props = {
  users: User[]
  loading: boolean
  onDelete: (id: number) => Promise<void>
  onUpdateRole: (id: number, role: User['role']) => Promise<void>
  onResetPassword: (id: number, newPassword: string) => Promise<void>
}

export default function UsersList({ users, loading, onDelete, onUpdateRole, onResetPassword }: Props) {
  if (loading) {
    return <p className="text-gray-500">Loading users...</p>
  }

  if (users.length === 0) {
    return <p className="text-gray-500 italic">No users available.</p>
  }

  return (
    <div className="space-y-3">
      {users.map(user => (
        <UserItem
          key={user.id}
          user={user}
          onDelete={onDelete}
          onUpdateRole={onUpdateRole}
          onResetPassword={onResetPassword}
        />
      ))}
    </div>
  )
}
