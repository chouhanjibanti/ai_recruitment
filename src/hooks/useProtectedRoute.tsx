import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { type UserRole } from '../types';

interface UseProtectedRouteOptions {
  requiredRole?: UserRole;
  redirectTo?: string;
}

export const useProtectedRoute = (options: UseProtectedRouteOptions = {}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { requiredRole, redirectTo = '/login' } = options;

  useEffect(() => {
    if (!isLoading) {
      // Not authenticated - redirect to login
      if (!isAuthenticated) {
        navigate(redirectTo);
        return;
      }

      // Check role requirements
      if (requiredRole && user?.role !== requiredRole) {
        // Redirect to appropriate dashboard based on user role
        navigate(`/${user.role}`);
        return;
      }
    }
  }, [isAuthenticated, user, requiredRole, isLoading, navigate, redirectTo]);

  return {
    isAuthorized: isAuthenticated && (!requiredRole || user?.role === requiredRole),
    isLoading,
    user,
  };
};
