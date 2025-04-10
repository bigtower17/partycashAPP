import LoginForm from '@/features/auth/LoginForm'
import logo from '../assets/logo.png.png'

export default function Login() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-500 to-cyan-900">
      <div className="max-w-md w-full p-8 bg-white shadow-xl rounded-lg">
        {/* Header con logo e titolo PartyCash */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 mr-3">
            <img src={logo} alt="PartyCash Logo" className="w-full h-full" />
          </div>
          <h1 className="text-3xl font-bold text-cyan-900">PartyCash</h1>
        </div>
        <LoginForm />
      </div>
      <footer className="mt-6 text-white text-sm">
        &copy; {currentYear} B.Torregrossa
      </footer>
    </div>
  )
}
