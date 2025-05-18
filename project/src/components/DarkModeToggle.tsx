import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

export const DarkModeToggle: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <motion.button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-light-darker dark:bg-dark-lighter"
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      aria-label={darkMode ? 'Alternar para modo claro' : 'Alternar para modo escuro'}
    >
      {darkMode ? (
        <Sun size={20} className="text-primary" />
      ) : (
        <Moon size={20} className="text-primary" />
      )}
    </motion.button>
  );
};