import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'

export default function AppLayout() {
  return (
    <div className="flex h-screen flex-col md:flex-row bg-gray-100 text-gray-900">
      {/* Navbar handles both desktop sidebar and mobile header/menu */}
      <Navbar />
      <main className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </main>
    </div>
  )
}
