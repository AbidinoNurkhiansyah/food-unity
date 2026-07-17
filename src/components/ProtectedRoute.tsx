import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore, type UserRole } from '@/hooks/useAuthStore';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children?: React.ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { isAuthenticated, role, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    // Show a loading spinner or simple message while auth state is resolving
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Role not authorized, redirect to their respective home
    return <Navigate to={role === 'merchant' ? '/dashboard' : '/explore'} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
