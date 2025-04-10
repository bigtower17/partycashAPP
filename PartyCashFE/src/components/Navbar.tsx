import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { jwtDecode } from 'jwt-decode';
import { CustomJwtPayload } from '@/types';

const navItems = [
  { to: '/dashboard', label: 'Home' },
  { to: '/deposit', label: 'Scarico Cassa' },
  { to: '/quotes', label: 'Spese & Preventivi' },
  { to: '/starting-cash-dashboard', label: 'Fondocassa' },
  { to: '/location-budget', label: 'Incasso Postazione' },
  { to: '/export', label: 'Esporta Report' }
];

const adminItems = [
  { to: '/withdraw', label: 'Pagamenti' },
  { to: '/locations', label: 'Gestisci Postazioni' },
  { to: '/users-admin', label: 'Admin' }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) return null;

  let role = null;
  try {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    role = decoded?.role;
  } catch (err) {
    console.error('Token non valido:', err);
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const combinedItems = [...navItems, ...(role === 'admin' ? adminItems : [])];
 
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col bg-red-700 text-white w-64 p-4 space-y-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span>💰</span> PartyCash
        </h1>
        {combinedItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`block px-3 py-2 rounded ${
              location.pathname === item.to
                ? 'bg-cyan-900 font-semibold'
                : 'hover:bg-cyan-800'
            }`}
          >  
            {item.label}
          </Link>
        ))}
        <Button
          onClick={handleLogout}
          className="mt-auto bg-white text-cyan-900 hover:bg-cyan-100"
        > 
          Logout
        </Button>
        <footer className="text-center text-xs text-gray-300 mt-4 px-2">
          Beta 1.1 &copy; {new Date().getFullYear()}
        </footer>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-cyan-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <span>💰</span> PartyCash
        </h1>
        <button onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-50 bg-cyan-900 text-white p-4 flex flex-col space-y-2">
          {combinedItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`block px-3 py-2 rounded ${
                location.pathname === item.to
                  ? 'bg-cyan-900 font-semibold'
                  : 'hover:bg-cyan-800'
              }`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Button
            onClick={handleLogout}
            className="bg-white text-cyan-900 hover:bg-cyan-100"
          >
            Logout
          </Button>
          <footer className="text-center text-xs text-gray-300 mt-4 px-2">
            Beta 1.1 &copy; {new Date().getFullYear()}
          </footer>
        </div>
      )}

      {/* Add a spacer div to push main content below fixed mobile navbar */}
      <div className="h-16 md:hidden"></div>
    </>
  );
}
