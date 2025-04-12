import LoginForm from '@/features/auth/LoginForm'
import logo from '../assets/logo.png'

export default function Login() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-cyan-500 to-cyan-900">
      <div className="w-full max-w-7xl p-4 flex flex-col lg:flex-row items-center justify-between space-x-0 lg:space-x-4 bg-white shadow-xl rounded-lg">
        {/* Left side: Logo */}
        <div className="flex justify-center w-full lg:w-1/2 mb-4 lg:mb-0">
          <div className="w-60 h-60">
            <img src={logo} alt="PartyCash Logo" className="w-full h-full object-contain" />
          </div>
        </div>
        {/* Right side: Login Form */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <LoginForm />
        </div>
      </div>
      <div className="flex justify-center p-8 text-cyan-900 text-sm">
        &copy; {currentYear} B.Torregrossa
      </div>
    </div>
  )
}
