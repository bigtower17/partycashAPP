import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from './authService'

export function useLogin() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleLogin = async (loginValue: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const token = await login(loginValue, password)
      localStorage.setItem('token', token)
      navigate('/dashboard')
    } catch (err: any) {
      setError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return { handleLogin, loading, error }
}
