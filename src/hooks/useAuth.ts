import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const useAuth = (required: boolean = true) => {
  const { user, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && required && !user) {
      navigate('/login');
    }
  }, [user, isLoading, required, navigate]);

  return { user, isLoading, isAuthenticated: !!user };
};

export const useAdmin = () => {
  const { user, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  return { user, isLoading, isAdmin: user?.role === 'admin' };
};

export default useAuth;

