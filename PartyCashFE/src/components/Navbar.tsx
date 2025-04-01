import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { to: '/dashboard', label: 'Home' },
  { to: '/deposit', label: 'Scarico Cassa' },
  { to: '/withdraw', label: 'Pagamenti' },
  { to: '/quotes', label: 'Spese & Preventivi' },
  { to: '/starting-cash-dashboard', label: 'Fondocassa' },
  { to: '/locations', label: 'Gestisci Postazioni' },
  { to: '/location-budget', label: 'Incasso Postazione' },
  { to: '/report-locations', label: 'Report Location' },
  { to: '/export', label: 'Esporta Report' },
  { to: '/users-admin', label: 'Admin' }
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem('token')

  if (!token) return null

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col bg-cyan-900 text-white w-64 p-4 space-y-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span>💰</span> PartyBudget
        </h1>
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`block px-3 py-2 rounded ${
              location.pathname === item.to ? 'bg-cyan-600 font-semibold' : 'hover:bg-cyan-800'
            }`}
          >
            {item.label}
          </Link>
        ))}
        <Button
          onClick={handleLogout}
          className="mt-auto bg-red-600 hover:bg-red-700"
        >
          Logout
        </Button>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-cyan-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">PartyBudget</h1>
        <button onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-cyan-800 text-white p-4 flex flex-col space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`block px-3 py-2 rounded ${
                location.pathname === item.to ? 'bg-cyan-600 font-semibold' : 'hover:bg-cyan-700'
              }`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700"
          >
            Logout
          </Button>
        </div>
      )}
    </>
  )
}
