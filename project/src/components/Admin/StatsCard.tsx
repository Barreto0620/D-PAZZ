import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon,
  color
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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
        
        <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('-700', '-100')} ${color.replace('border-', 'text-')}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};