import DashboardPage from '@/features/dashboard/DashboardPage';
import DepositForm from '@/features/operations/DepositForm';
import WithdrawForm from '@/features/operations/WithdrawForm';
import QuotesDashboard from '@/features/quotes/QuotesDashboard';
import { LocationList } from '@/features/locations/LocationList';
import { LocationForm } from '@/features/locations/LocationForm';
import { LocationDashboard } from '@/features/locations/LocationsDashboard';
import { ExportReports } from '@/features/reports/ExportReports';
import StartingCashManager from '@/features/startingCash/StartingCashManager';
import { UsersAdminDashboard } from '@/features/users/UsersAdminDashboard';
import NewUserForm from '@/features/users/NewUserForm';
import { JSX } from 'react/jsx-runtime';

export interface RouteConfig {
  path: string;
  element: JSX.Element;
  allowedRoles?: string[]; // If not provided, any authenticated user can access.
  children?: RouteConfig[];
}

export const routesConfig: RouteConfig[] = [
  {
    path: "dashboard",
    element: <DashboardPage />,
    allowedRoles: ["admin", "staff", "auditor"],
  },
  {
    path: "deposit",
    element: <DepositForm />,
    allowedRoles: ["admin", "staff", "auditor"],
  },
  {
    path: "withdraw",
    element: <WithdrawForm />,
    allowedRoles: ["admin", "staff", "auditor"],
  },
  {
    path: "quotes",
    element: <QuotesDashboard />,
    allowedRoles: ["admin", "staff", "auditor"],
  },
  {
    path: "locations",
    element: <LocationList />,
    allowedRoles: ["admin", "staff", "auditor"],
  },
  {
    path: "locations/:id",
    element: <LocationForm />,
    allowedRoles: ["admin", "staff", "auditor"],
  },
  {
    path: "location-budget",
    element: <LocationDashboard />,
    allowedRoles: ["admin", "staff", "auditor"],  
  },
  {
    path: "export",
    element: <ExportReports />,
    allowedRoles: ["admin", "staff", "auditor"],
  },
  {
    path: "starting-cash-dashboard",
    element: <StartingCashManager />,
    allowedRoles: ["admin", "staff", "auditor"],
  },
  {
    path: "users-admin",
    element: <UsersAdminDashboard />,
    allowedRoles: ["admin", "staff", "auditor"],
  },
  {
    path: "users/new",
    element: <NewUserForm />,
    allowedRoles: ["admin", "staff", "auditor"],
  }
];
