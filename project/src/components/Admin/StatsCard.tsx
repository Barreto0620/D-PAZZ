import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string; // Ex: 'border-blue-500'
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon,
  color
}) => {
  // Ajusta a cor de fundo e texto do ícone com base na cor da borda
  const iconBgColor = color.replace('border-', 'bg-').replace(/-\d+/, '-100'); // Ex: border-blue-500 -> bg-blue-100
  const iconTextColor = color.replace('border-', 'text-'); // Ex: border-blue-500 -> text-blue-500

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }} // Adicionada uma duração para a transição
      className={`bg-white dark:bg-dark-lighter rounded-2xl p-6 shadow-md border-l-4 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            {title}
          </h3>
          <p className="text-2xl font-bold text-dark dark:text-white mt-1">
            {value}
          </p>
        </div>
        
        <div className={`p-3 rounded-full ${iconBgColor} ${iconTextColor}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};