import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function useProtectedRoute(requireAdmin = false) {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login', { replace: true });
    } else if (requireAdmin && !isAdmin) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate, requireAdmin]);

  return { isAuthenticated, isAdmin };
}