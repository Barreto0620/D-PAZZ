// project/src/components/DarkModeToggle.tsx
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext'; // Ensure this path is correct
import { motion } from 'framer-motion';

export const DarkModeToggle: React.FC = () => {
  // CORRECTED: Destructure 'theme' and 'toggleTheme'
  // from useTheme() to match what ThemeContext provides.
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme} // Call toggleTheme
      className="p-2 rounded-full bg-light-darker dark:bg-dark-lighter"
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      // Use 'theme' to determine the aria-label and icon
      aria-label={theme === 'dark' ? 'Alternar para modo claro' : 'Alternar para modo escuro'}
    >
      {theme === 'dark' ? ( // Check if 'theme' is 'dark'
        <Sun size={20} className="text-primary" /> // Show Sun when in dark mode (to switch to light)
      ) : (
        <Moon size={20} className="text-primary" /> // Show Moon when in light mode (to switch to dark)
      )}
    </motion.button>
  );
};