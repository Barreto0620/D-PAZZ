// frontend/src/components/Admin/AdminLayout.tsx

import React, { ReactNode, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Menu } from 'lucide-react';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { isAdmin } = useProtectedRoute(true);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAdmin) return null;

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Produtos', icon: Package, path: '/admin/products' },
    { name: 'Pedidos', icon: ShoppingCart, path: '/admin/orders' },
    { name: 'Clientes', icon: Users, path: '/admin/customers' },
  ];

  return (
    <div className="min-h-screen bg-light-darker dark:bg-dark flex">
      {/* Sidebar */}
      <aside className={`w-64 bg-white dark:bg-dark-lighter shadow-md 
                        fixed inset-y-0 left-0 
                        transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
                        md:relative md:translate-x-0 
                        transition-transform duration-200 ease-in-out z-50 flex-shrink-0`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center justify-center">
            <img 
              src="https://raw.githubusercontent.com/Lusxka/logompz/refs/heads/main/logompz-Photoroom.png" 
              alt="D'Pazz Imports"
              className="h-12"
            />
          </Link>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors
                    ${location.pathname === item.path 
                      ? 'bg-primary text-dark font-semibold shadow-md'
                      : 'hover:bg-light-darker dark:hover:bg-dark-light text-dark dark:text-white'
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-light-darker dark:hover:bg-dark-light text-dark dark:text-white transition-colors w-full"
            >
              <LogOut size={20} />
              <span>Sair</span>
            </button>
            <div className="mt-4 flex justify-center">
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </aside>
      
      {/* --- CORREÇÃO APLICADA AQUI --- */}
      {/* Adicionado 'min-w-0' para forçar o cálculo correto da largura do flexbox */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header and overlay */}
        <header className="bg-white dark:bg-dark-lighter p-4 shadow-md md:hidden flex items-center justify-between z-30">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-light-darker dark:hover:bg-dark-light text-dark dark:text-white transition-colors"
          >
            <Menu size={24} />
          </button>
          <img 
            src="https://raw.githubusercontent.com/Lusxka/logompz/refs/heads/main/logompz-Photoroom.png" 
            alt="D'Pazz Imports"
            className="h-8"
          />
          <ThemeToggle />
        </header>
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}
        
        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold text-dark dark:text-white mb-6">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
};