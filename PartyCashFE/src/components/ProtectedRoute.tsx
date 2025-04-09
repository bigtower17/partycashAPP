// src/components/ProtectedRoute.tsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenExpired, getTokenPayload } from '@/lib/token';

type Props = {
  children: React.ReactNode;
  allowedRoles?: string[];
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const [valid, setValid] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token');
      setValid(false);
    } else {
      const payload = getTokenPayload(token);
      // If allowedRoles is provided, ensure the user's role is allowed.
      if (allowedRoles && allowedRoles.length > 0) {
        setValid(allowedRoles.includes(payload.role));
      } else {
        setValid(true);
      }
    }
  }, [allowedRoles]);

  if (valid === null) return null; // Optionally render a loader here

  return valid ? <>{children}</> : <Navigate to="/login" replace />;
}
