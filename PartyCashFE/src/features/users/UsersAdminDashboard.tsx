import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'
import UserItem from './UserItem'
import { User } from '@/types'
import { useUsers } from '@/hooks/useUsers'
import { useNavigate } from 'react-router-dom'

export function UsersAdminDashboard() {
  const { users, deleteUser, updateUserRole, resetUserPassword } = useUsers()
  const [confirmText, setConfirmText] = useState('')
  const [loadingReset, setLoadingReset] = useState(false)
  const navigate = useNavigate()

  const handleDatabaseReset = async () => {
    const confirmed = confirmText === 'RESET'
    if (!confirmed) {
      alert("Scrivi 'RESET' per confermare")
      return
    }

    setLoadingReset(true)
    try {
      await api.post('/admin/reset-db')
      alert('Database svuotato correttamente.')
      setConfirmText('')
    } catch (err) {
      alert('Errore durante il reset del database')
    } finally {
      setLoadingReset(false)
    }
  }

  const handleCreateNewUser = () => {
    // Navigate to the new user creation page
    navigate('/users/new')
  }

  return (
    <div className="space-y-4 p-6">
      {/* Header: Users Management title and Create New User button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold mb-4">Users Management</h2>
        <Button
          variant="outline"
          className="bg-cyan-800 text-white"
          onClick={handleCreateNewUser}
        >
          Create New User
        </Button>
      </div>

      {users.map((user: User) => (
        <UserItem
          key={user.id}
          user={user}
          onDelete={deleteUser}
          onUpdateRole={updateUserRole}
          onResetPassword={resetUserPassword}
        />
      ))}

      {/* ⚠️ Danger Zone Section for admin */}
      <div className="mt-10 border-t pt-6">
        <h3 className="text-lg font-semibold text-red-700 mb-2">Reset Database</h3>
        <p className="text-sm text-gray-500 mb-2">
          Questa operazione eliminerà tutti i dati. Scrivi <strong>RESET</strong> per confermare.
        </p>
        <div className="flex gap-2">
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Scrivi RESET"
            className="max-w-[150px]"
          />
          <Button
            variant="outline"
            onClick={handleDatabaseReset}
            disabled={loadingReset || confirmText !== 'RESET'}
          >
            {loadingReset ? 'Resettando...' : 'Reset DB'}
          </Button>
        </div>
      </div>
    </div>
  )
}
