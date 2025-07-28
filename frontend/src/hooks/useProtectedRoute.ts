// frontend/src/hooks/useProtectedRoute.ts (VERSÃO DE DIAGNÓSTICO)
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteResult {
  authLoading: boolean;
}

export const useProtectedRoute = (requireAdmin = false): ProtectedRouteResult => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  // O useEffect abaixo está desativado de propósito para podermos ver o log.
  /*
  useEffect(() => {
    if (loading) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    } else if (requireAdmin && !isAdmin) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isAdmin, loading, navigate, requireAdmin]);
  */

  // --- LÓGICA DE DIAGNÓSTICO ---
  // Imprime o estado atual no console a cada renderização
  console.log('%c--- Verificação de Rota ---', 'color: yellow; font-weight: bold;');
  console.log(`Carregando Autenticação (loading):`, loading);
  console.log(`Usuário Autenticado (isAuthenticated):`, isAuthenticated);
  console.log(`Usuário é Admin (isAdmin):`, isAdmin);

  // Simula a decisão que o hook tomaria
  if (!loading) {
    if (!isAuthenticated) {
      console.log('%cDECISÃO: REDIRECIONAR PARA /login', 'color: red; font-weight: bold;');
    } else if (requireAdmin && !isAdmin) {
      console.log('%cDECISÃO: REDIRECIONAR PARA / (ACESSO NEGADO)', 'color: red; font-weight: bold;');
    } else {
      console.log('%cDECISÃO: ACESSO PERMITIDO', 'color: lightgreen; font-weight: bold;');
    }
  }
  console.log('-------------------------');
  
  return { authLoading: loading };
}