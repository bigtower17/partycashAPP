import LoginForm from '@/features/auth/LoginForm'
import logo from '../assets/logo.png'

export default function Login() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-cyan-500 to-cyan-900">
      <div className="w-full max-w-7xl p-4 flex flex-col items-center bg-white shadow-xl rounded-lg">
        {/* Logo */}
        <div className="w-60 h-60 mb-6">
          <img src={logo} alt="PartyCash Logo" className="w-full h-full object-contain" />
        </div>
        {/* Login Form */}
        <div className="full lg:w-2/3">
          <LoginForm />
        </div>
        {/* Copyright */}
        <div className="flex justify-center p-8 text-cyan-900 text-sm mt-4">
          &copy; {currentYear} B.Torregrossa
        </div>
      </div>   
    </div>
  )
}
