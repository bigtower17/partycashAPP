// src/components/ProtectedRoute.tsx
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { isTokenExpired } from '@/lib/token'

type Props = {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const [valid, setValid] = useState<boolean | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token')
      setValid(false)
    } else {
      setValid(true)
    }
  }, [])

  if (valid === null) return null // or a spinner

  return valid ? <>{children}</> : <Navigate to="/login" replace />
}
