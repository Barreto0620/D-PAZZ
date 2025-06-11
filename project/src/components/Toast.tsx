import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'success', 
  duration = 3000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Set a timer to hide the toast
    const timer = setTimeout(() => {
      setIsVisible(false); // Trigger exit animation
      // After animation, call onClose to remove from DOM
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
      default:
        return <CheckCircle size={20} className="text-white" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600'; // More vibrant green
      case 'error':
        return 'bg-red-600'; // More vibrant red
      case 'info':
        return 'bg-blue-600'; // More vibrant blue
      default:
        return 'bg-green-600';
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
          className="fixed bottom-6 right-6 z-50" // Changed position to bottom-right
        >
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg ${getBgColor()}`}>
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
              <X size={18} /> {/* Slightly larger close icon */}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};