import LoginForm from '@/features/auth/LoginForm'
import logo from '../assets/logo.png.png'

export default function Login() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 to-cyan-900">
      <div className="w-full max-w-7xl p-8 flex flex-col lg:flex-row items-center justify-center space-x-8 bg-white shadow-xl rounded-lg">
        {/* Left side: Logo */}
        <div className="flex justify-center lg:justify-start lg:w-1/3 w-full mb-8 lg:mb-0">
          <div className="w-60 h-60">
            <img src={logo} alt="PartyCash Logo" className="w-full h-full object-contain" />
          </div>
        </div>
        {/* Right side: Login Form */}
        <div className="w-full lg:w-2/3">
          <LoginForm />
        </div>
      </div>
      <footer className="mt-6 text-white text-sm text-center">
        &copy; {currentYear} B.Torregrossa
      </footer>
    </div>
  )
}
