import React, { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, User, LogOut } from 'lucide-react';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';
// ✅ CORREÇÃO: O caminho foi ajustado de ../ para ../../ para encontrar a pasta 'contexts'
import { useAuth } from '../../contexts/AuthContext'; 
import { DarkModeToggle } from '../DarkModeToggle'; // Ajustado para um caminho mais provável

interface CustomerLayoutProps {
  children: ReactNode;
  title: string;
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children, title }) => {
  const { isAuthenticated } = useProtectedRoute();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) return null;

  const navLinks = [
    { to: "/cliente/painel", label: "Minha Conta", icon: User },
    { to: "/cliente/compras", label: "Histórico de Compras", icon: ShoppingBag },
    { to: "/favoritos", label: "Favoritos", icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-white dark:bg-dark-lighter shadow-lg hidden md:flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="https://raw.githubusercontent.com/Lusxka/logompz/refs/heads/main/logompz-Photoroom.png"
              alt="D'Pazz Imports"
              className="h-12 transition-transform group-hover:scale-105"
            />
            <span className="font-bold text-xl text-dark dark:text-white group-hover:text-primary transition-colors">
              D'PAZZ
            </span>
          </Link>
        </div>
        
        {/* Navigation Section */}
        <nav className="p-4 flex-grow">
          <ul className="space-y-2">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link 
                  to={to} 
                  className={`group flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                    location.pathname === to 
                      ? 'bg-gradient-to-r from-blue-900 to-red-700 text-yellow-300 shadow-lg transform scale-105' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-red-50 dark:hover:from-blue-900/10 dark:hover:to-red-900/10 hover:text-dark dark:hover:text-white hover:shadow-md'
                  }`}
                >
                  <Icon 
                    size={20} 
                    className={`transition-transform duration-300 ${
                      location.pathname === to ? 'scale-110' : 'group-hover:scale-110'
                    }`}
                  />
                  <span className="font-medium">{label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Dark Mode Toggle - Posicionado elegantemente abaixo da navegação */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="mb-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Configurações
              </p>
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Modo Escuro
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Alternar tema
                  </span>
                </div>
                <DarkModeToggle />
              </div>
            </div>
          </div>
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={handleLogout}
            className="group flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/20 dark:hover:to-red-800/20 text-red-600 dark:text-red-400 transition-all duration-300 w-full hover:shadow-lg transform hover:-translate-y-1"
          >
            <LogOut 
              size={20} 
              className="transition-transform duration-300 group-hover:scale-110" 
            />
            <span className="font-medium">Sair da Conta</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="bg-white dark:bg-dark-lighter p-4 shadow-lg md:hidden flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-dark dark:text-white">{title}</h1>
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <DarkModeToggle />
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="p-6 flex-grow bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-dark dark:text-white mb-6 hidden md:block">
              {title}
            </h1>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};