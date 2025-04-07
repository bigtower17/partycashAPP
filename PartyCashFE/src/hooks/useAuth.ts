// src/hooks/useAuth.ts
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  id: number
  email: string
  role: string
  exp: number
  iat: number
}

export function useAuth() {
  const [user, setUser] = useState<DecodedToken | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token)
        setUser(decoded)
      } catch (error) {
        console.error('Invalid token:', error)
      }
    }
  }, [])

  return { user }
}
