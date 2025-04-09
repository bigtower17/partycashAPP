// src/App.tsx
import { FC } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './AppLayout'
import { routesConfig, RouteConfig } from './routesConfig'

const generateRoutes = (routes: RouteConfig[]) => {
  return routes.map((route) => {
    const { path, element, allowedRoles, children } = route;
    const wrappedElement = (
      <ProtectedRoute allowedRoles={allowedRoles}>
        {element}
      </ProtectedRoute>
    );
    return children ? (
      <Route key={path} path={path} element={wrappedElement}>
        {generateRoutes(children)}
      </Route>
    ) : (
      <Route key={path} path={path} element={wrappedElement} />
    );
  });
};

const App: FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {generateRoutes(routesConfig)}

          {/* Default route */}
          <Route index element={<Navigate to="/dashboard" replace />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App
