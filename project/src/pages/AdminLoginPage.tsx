import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Package, AlertCircle, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export const AdminLoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/'); // Redirect non-admin users to home
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(credentials.email, credentials.password, true);
      
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('Email ou senha inválidos');
      }
    } catch (error) {
      setError('Ocorreu um erro durante o login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light dark:bg-dark flex items-center justify-center px-4">
      <Helmet>
        <title>Admin Login - ImportShop</title>
        <meta name="description" content="Área restrita para administradores da ImportShop." />
      </Helmet>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-lighter rounded-2xl shadow-lg p-8 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Package size={40} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">
            ImportShop Admin
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Acesse o painel administrativo
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} />
                <p>{error}</p>
              </div>
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                value={credentials.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-light text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Digite seu email"
              />
              <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Senha
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                value={credentials.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-light text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Digite sua senha"
              />
              <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary hover:bg-secondary text-dark rounded-lg font-medium transition-colors disabled:opacity-70"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Para fins de demonstração, use:</p>
          <p className="mt-1">Email: <span className="font-medium">admin@example.com</span></p>
          <p>Senha: <span className="font-medium">admin123</span></p>
        </div>
      </motion.div>
    </div>
  );
};