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
      <aside className="w-64 bg-white dark:bg-dark-lighter shadow-md hidden md:flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="https://raw.githubusercontent.com/Lusxka/logompz/refs/heads/main/logompz-Photoroom.png"
              alt="D'Pazz Imports"
              className="h-12"
            />
            <span className="font-bold text-xl text-dark dark:text-white">D'PAZZ</span>
          </Link>
        </div>
        
        <nav className="p-4 flex-grow">
          <ul className="space-y-2">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link 
                  to={to} 
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${location.pathname === to ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-dark-light'}`}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="mb-4">
             <DarkModeToggle />
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors w-full"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-dark-lighter p-4 shadow-md md:hidden flex items-center justify-between">
          <h1 className="text-xl font-bold text-dark dark:text-white">{title}</h1>
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-light-darker dark:hover:bg-dark-light text-dark dark:text-white"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>
        
        <main className="p-6 flex-grow">
          <h1 className="text-3xl font-bold text-dark dark:text-white mb-6 hidden md:block">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
};