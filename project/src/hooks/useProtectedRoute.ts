import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function useProtectedRoute(requireAdmin = false) {
  const { isAuthenticated, isAdmin, loading } = useAuth(); // Obter loading do AuthContext
  const navigate = useNavigate();

  useEffect(() => {
    // Se ainda estiver carregando, não faça nada
    if (loading) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { replace: true }); // Redireciona para /login, não /admin/login
    } else if (requireAdmin && !isAdmin) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isAdmin, loading, navigate, requireAdmin]); // Adicionado loading às dependências

  return { isAuthenticated, isAdmin, loading }; // Retorna loading também
}