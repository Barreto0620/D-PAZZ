// project/src/components/Layout.tsx
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-light dark:bg-dark ${className}`}>
      {/* Header/Navigation pode ser adicionado aqui */}
      <header className="bg-white dark:bg-dark-lighter shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-dark dark:text-white">
                E-commerce
              </h1>
            </div>
            {/* Adicione navegação aqui se necessário */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer pode ser adicionado aqui */}
      <footer className="bg-white dark:bg-dark-lighter border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 dark:text-gray-400">
            © 2024 E-commerce. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};