import LoginForm from '@/features/auth/LoginForm'
import logo from '../assets/logo.png'

export default function Login() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 to-cyan-900">
      <div className="w-1/2 max-w-7xl p-8 flex flex-col lg:flex-row items-center justify-center space-x-4 bg-white shadow-xl rounded-lg">
        {/* Left side: Logo */}
        <div className="flex justify-center lg:justify-center lg:w-1/2 w-full mb-4 lg:mb-0">
          <div className="w-60 h-60">
            <img src={logo} alt="PartyCash Logo" className="w-full h-full object-contain" />
          </div>
        </div>
        {/* Right side: Login Form */}
        <div className="w-full lg:w-2/2">
          <LoginForm />
        </div>
      </div>

      {/* Footer with copyright positioned on the bottom-right */}
      <footer className="absolute bottom-4 right-4 text-white text-sm">
        &copy; {currentYear} B.Torregrossa
      </footer>
    </div>
  )
}