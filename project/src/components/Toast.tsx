import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning'; // Adicionado 'warning'
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'info', // Default changed to 'info'
  duration = 3000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); // Trigger exit animation
      setTimeout(onClose, 300); // 300ms matches exit animation duration
    }, duration);

    return () => clearTimeout(timer); // Cleanup timer on unmount or dependency change
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-white" />;
      case 'error':
        return <AlertCircle size={20} className="text-white" />;
      case 'info':
        return <Info size={20} className="text-white" />;
      case 'warning': // Novo tipo de ícone para 'warning'
        return <AlertCircle size={20} className="text-white" />;
      default:
        return <Info size={20} className="text-white" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      case 'info':
        return 'bg-blue-600';
      case 'warning': // Novo tipo de cor de fundo para 'warning'
        return 'bg-yellow-500'; // Cor amarela para warning
      default:
        return 'bg-blue-600';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="fixed bottom-6 right-6 z-50 pointer-events-none" // Adicionado pointer-events-none para permitir cliques abaixo
        >
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg ${getBgColor()} pointer-events-auto`}> {/* Adicionado pointer-events-auto */}
            {getIcon()}
            <p className="text-white font-medium text-lg">{message}</p>
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="p-1 text-white/80 hover:text-white transition-colors"
              aria-label="Fechar"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};