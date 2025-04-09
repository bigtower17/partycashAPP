import { useState } from 'react'
import { useLogin } from './useLogin'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LoginForm() {
  const { handleLogin, loading, error } = useLogin()
  const [loginValue, setLoginValue] = useState('')
  const [password, setPassword] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    handleLogin(loginValue, password)
  }

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto mt-20 space-y-4">
      <div className="space-y-1">
        <label htmlFor="login" className="text-sm font-medium">
          Email o Username
        </label>
        <Input
          id="login"
          type="text"
          value={loginValue}
          onChange={(e) => setLoginValue(e.target.value)}
          required
        />
      </div>      
      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-center">
  <Button className="bg-cyan-900 text-white" type="submit" disabled={loading}>
    {loading ? 'Logging in...' : 'Login'}
  </Button>
</div>

    </form>
  )
}
