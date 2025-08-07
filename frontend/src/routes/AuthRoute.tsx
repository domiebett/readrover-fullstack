import { Navigate } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus';


interface AuthRouteProps {
  requireAuth: boolean;
  children: React.ReactNode;
}

export default function AuthRoute({ requireAuth, children }: AuthRouteProps) {
  const auth = useAuthStatus();

  if (auth === 'pending') return <div>Loading...</div>;
  if (requireAuth && auth === 'unauthenticated') return <Navigate to="/login" replace />;
  if (!requireAuth && auth === 'authenticated') return <Navigate to="/" replace />;
  return <>{children}</>;
}
