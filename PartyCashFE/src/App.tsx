import { FC } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from 'react-router-dom'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardPage from '@/features/dashboard/DashboardPage'
import DepositForm from '@/features/operations/DepositForm'
import WithdrawForm from '@/features/operations/WithdrawForm'
import QuotesDashboard from '@/features/quotes/QuotesDashboard'
import { LocationList } from '@/features/locations/LocationList'
import { LocationForm } from '@/features/locations/LocationForm'
import { LocationBudget } from '@/features/locations/LocationBudget'
import { ExportReports } from '@/features/reports/ExportReports'
import StartingCashManager from '@/features/startingCash/StartingCashManager'
import { UsersAdminPanel } from '@/features/users/UsersAdminPanel'
import AppLayout from './AppLayout'

const LocationBudgetWrapper: FC = () => {
  const { locationId } = useParams<{ locationId: string }>()
  const id = locationId ? parseInt(locationId, 10) : 0
  return <LocationBudget locationId={id} />
}

const App: FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Wrap all authenticated routes in a layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="deposit" element={<DepositForm />} />
          <Route path="withdraw" element={<WithdrawForm />} />
          <Route path="quotes" element={<QuotesDashboard />} />
          <Route path="locations" element={<LocationList />} />
          <Route path="locations/:id" element={<LocationForm />} />
          <Route path="location-budget/:locationId" element={<LocationBudgetWrapper />} />
          <Route path="export" element={<ExportReports />} />
          <Route path="starting-cash-dashboard" element={<StartingCashManager />} />
          <Route path="users-admin" element={<UsersAdminPanel />} />
          <Route index element={<Navigate to="/dashboard" replace />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
