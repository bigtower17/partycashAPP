import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'
import { useNavigate } from 'react-router-dom'

export default function NewUserForm() {
  // Use "username" to match your database column
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'staff' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    console.log('Form payload:', form); // Check that form.password is not empty
    try {
      await api.post('/users', form)
      alert('User created successfully.')
      navigate('/users-admin')
    } catch (err) {
      console.error('Error creating user:', err)
      alert('Error creating user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 space-y-4 bg-white p-6 rounded shadow"
    >
      <h2 className="text-xl font-bold">Create New User</h2>
      <Input
        placeholder="Name"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        required
      />
      <Input
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <Input
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <select
          id="role"
          className="mt-1 block w-full border border-gray-300 rounded p-2"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          required
        >
          <option value="admin">admin</option>
          <option value="staff">staff</option>
          <option value="auditor">auditor</option>
        </select>
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-cyan-800 text-white">
        {loading ? 'Creating...' : 'Create User'}
      </Button>
    </form>
  )
}
