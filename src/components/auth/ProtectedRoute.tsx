import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, checkAuth, token } = useAuthStore();
  const [isHydrating, setIsHydrating] = useState(true);

  // Wait for Zustand persist to hydrate
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrating(false);
      
      // If we have a token in localStorage but not in state, verify it
      const storedToken = localStorage.getItem('token');
      if (storedToken && !token && !isAuthenticated) {
        checkAuth().catch(() => {
          // If checkAuth fails, the store will handle cleanup
        });
      } else if (!storedToken && isLoading) {
        // No token and still loading - mark as done
        useAuthStore.setState({ isLoading: false, isAuthenticated: false });
      }
    }, 100); // Small delay to allow Zustand persist to hydrate

    return () => clearTimeout(timer);
  }, [token, isAuthenticated, isLoading, checkAuth]);

  // Show loading while hydrating or checking auth
  if (isHydrating || isLoading) {
    return <LoadingSpinner />;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

