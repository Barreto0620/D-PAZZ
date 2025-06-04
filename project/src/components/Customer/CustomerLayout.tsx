import React, { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, LogOut } from 'lucide-react';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';

interface CustomerLayoutProps {
  children: ReactNode;
  title: string;
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children, title }) => {
  const { isAuthenticated } = useProtectedRoute();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-light dark:bg-dark flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-dark-lighter shadow-md hidden md:block">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center">
            <img 
              src="https://raw.githubusercontent.com/Lusxka/logompz/refs/heads/main/logompz-Photoroom.png"
              alt="D'Pazz Imports"
              className="h-20 ml-15"
            />
          </Link>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/cliente/painel" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-light-darker dark:hover:bg-dark-light text-dark dark:text-white transition-colors"
              >
                <User size={20} />
                <span>Minha Conta</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/cliente/compras" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-light-darker dark:hover:bg-dark-light text-dark dark:text-white transition-colors"
              >
                <ShoppingBag size={20} />
                <span>Histórico de Compras</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/favoritos" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-light-darker dark:hover:bg-dark-light text-dark dark:text-white transition-colors"
              >
                <Heart size={20} />
                <span>Favoritos</span>
              </Link>
            </li>
          </ul>
          
          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-light-darker dark:hover:bg-dark-light text-dark dark:text-white transition-colors w-full"
            >
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </div>
        </nav>
      </aside>
      
      {/* Main content */}
      <div className="flex-1">
        {/* Mobile header */}
        <header className="bg-white dark:bg-dark-lighter p-4 shadow-md md:hidden flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="https://raw.githubusercontent.com/Lusxka/logompz/refs/heads/main/logompz-Photoroom.png"
              alt="D'Pazz Imports"
              className="h-8"
            />
          </div>
          
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-light-darker dark:hover:bg-dark-light text-dark dark:text-white transition-colors"
          >
            <LogOut size={20} />
          </button>
        </header>
        
        {/* Page content */}
        <main className="p-6">
          <h1 className="text-2xl font-bold text-dark dark:text-white mb-6">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
};