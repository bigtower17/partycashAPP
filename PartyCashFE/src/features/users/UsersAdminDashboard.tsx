
import UserItem from './UserItem'
import { useUsers } from '@/hooks/useUsers'
import { User } from '@/types'

export function UsersAdminDashboard() {
  const { users, loading, deleteUser, updateUserRole, resetUserPassword } = useUsers()

  if (loading) return <p>Loading users...</p>

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-bold mb-4">Users Management</h2>
      {users.map((user: User) => (
        <UserItem
          key={user.id}
          user={user}
          onDelete={deleteUser}
          onUpdateRole={updateUserRole}
          onResetPassword={resetUserPassword}
        />
      ))}
    </div>
  )
}
