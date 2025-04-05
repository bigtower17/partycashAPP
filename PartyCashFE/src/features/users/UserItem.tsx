import React from 'react'
import { User } from '@/types'
import { Button } from '@/components/ui/button'

type UserItemProps = {
  user: User
  onDelete: (id: number) => Promise<void>
  onUpdateRole: (id: number, role: User['role']) => Promise<void>
  onResetPassword: (id: number, newPassword: string) => Promise<void>
}

const UserItem: React.FC<UserItemProps> = ({ user, onDelete, onUpdateRole, onResetPassword }) => {
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${user.username}"?`)) {
      await onDelete(user.id)
    }
  }

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    await onUpdateRole(user.id, e.target.value as User['role'])
  }

  const handleResetPassword = async () => {
    const newPassword = window.prompt(`Enter new password for "${user.username}":`)
    if (newPassword) {
      await onResetPassword(user.id, newPassword)
    }
  }

  return (
    <div className="p-4 bg-white shadow-sm rounded border-l-4 border-blue-500 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{user.username}</h3>
          <p className="text-sm text-gray-600">Email: {user.email}</p>
          <p className="text-sm text-gray-600">Role: {user.role}</p>
        </div>
        <div className="space-x-2 flex-shrink-0">
          <select
            value={user.role}
            onChange={handleRoleChange}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="auditor">Auditor</option>
          </select>
          <Button
            variant="default"
            className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200"
            onClick={handleResetPassword}
          >
            Reset Password
          </Button>
          <Button
            variant="default"
            className="bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
            onClick={handleDelete}
          >
            Elimina
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UserItem
