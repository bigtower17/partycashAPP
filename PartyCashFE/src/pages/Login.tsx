import LoginForm from '@/features/auth/LoginForm'
import logo from '../assets/logo.svg'

export default function Login() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-500 to-cyan-900">
      <div className="max-w-md w-full p-8 bg-white shadow-xl rounded-lg flex flex-col items-center">
        {/* Header con logo e titolo PartyCash */}
        <div className="flex flex-col items-center mb-2"> {/* Reduced margin-bottom */}
          <div className="w-80 h-80">
            <img src={logo} alt="PartyCash Logo" className="w-full h-full object-contain" />
          </div>
        </div>
        <LoginForm />
      </div>
      <footer className="mt-6 text-white text-sm">
        &copy; {currentYear} B.Torregrossa
      </footer>
    </div>
  )
}
