import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { User } from '@/types'

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await api.get('/users')
      setUsers(res.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id: number) => {
    try {
      await api.delete(`/users/${id}`)
      setUsers(prev => prev.filter(u => u.id !== id))
    } catch (error) {
      alert('Error deleting user')
    }
  }

  const updateUserRole = async (id: number, role: User['role']) => {
    try {
      await api.patch(`/users/${id}/role`, { role })
      setUsers(prev => prev.map(u => (u.id === id ? { ...u, role } : u)))
    } catch (error) {
      alert('Error updating role')
    }
  }

  const resetUserPassword = async (id: number, newPassword: string) => {
    try {
      await api.patch(`/users/${id}/password`, { password: newPassword })
      alert('Password reset successful')
    } catch (error) {
      alert('Error resetting password')
    }
  }

  return { users, loading, deleteUser, updateUserRole, resetUserPassword }
}
