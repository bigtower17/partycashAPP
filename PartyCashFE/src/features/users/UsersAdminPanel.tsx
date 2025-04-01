import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type User = {
  id: number
  email: string
  role: 'admin' | 'staff' | 'auditor'
}

export function UsersAdminPanel() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/users')
      .then(res => setUsers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`)
        setUsers(users.filter(u => u.id !== id))
      } catch (err) {
        alert('Error deleting user')
      }
    }
  }

  const handleRoleUpdate = async (id: number, role: string) => {
    try {
      await api.patch(`/users/${id}/role`, { role })
      setUsers(users.map(u => (u.id === id ? { ...u, role } : u)))
    } catch (err) {
      alert('Error updating role')
    }
  }

  if (loading) return <p>Loading users...</p>

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-bold mb-4">Users Management</h2>
      {users.map(user => (
        <Card key={user.id}>
          <CardHeader>
            <CardTitle>{user.email}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Role: {user.role}</p>
            <div className="flex gap-2 mt-2">
              <select
                value={user.role}
                onChange={e => handleRoleUpdate(user.id, e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="auditor">Auditor</option>
              </select>
              <Button variant="destructive" onClick={() => handleDelete(user.id)}>
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
