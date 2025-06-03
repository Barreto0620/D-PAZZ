import React, { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut } from 'lucide-react';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { isAdmin } = useProtectedRoute(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-light-darker dark:bg-dark flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-dark-lighter shadow-md hidden md:block">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center">
            <img 
              src="https://raw.githubusercontent.com/Lusxka/logompz/refs/heads/main/logompz-Photoroom.png" 
              alt="D'Pazz Imports"
              className="h-12"
            />
          </Link>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/admin/dashboard" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-light-darker dark:hover:bg-dark-light text-dark dark:text-white transition-colors"
              >
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/dashboard" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-light-darker dark:hover:bg-dark-light text-dark dark:text-white transition-colors"
              >
                <Package size={20} />
                <span>Produtos</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/dashboard" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-light-darker dark:hover:bg-dark-light text-dark dark:text-white transition-colors"
              >
                <ShoppingCart size={20} />
                <span>Pedidos</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/dashboard" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-light-darker dark:hover:bg-dark-light text-dark dark:text-white transition-colors"
              >
                <Users size={20} />
                <span>Clientes</span>
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