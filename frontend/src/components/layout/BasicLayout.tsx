import React from 'react';
import { Navbar } from '../Navbar'; // ✅ Importe seu Navbar

interface BasicLayoutProps {
  children: React.ReactNode;
}

export const BasicLayout: React.FC<BasicLayoutProps> = ({ children }) => {
  return (
    <div className="bg-white dark:bg-neutral-900">
      <Navbar /> {/* ✅ Use seu Navbar aqui */}
      <main>
        {children}
      </main>
      {/* Você pode adicionar o Footer aqui se quiser um layout mais completo */}
    </div>
  );
};