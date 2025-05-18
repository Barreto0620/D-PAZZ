import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResultsProps {
  results: Product[];
  onClose: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ results, onClose }) => {
  if (results.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="fixed left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white dark:bg-dark-lighter rounded-lg shadow-xl overflow-hidden z-50 max-h-[70vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
      style={{ top: '80px' }}
    >
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {results.map(product => (
          <Link
            key={product.id}
            to={`/produto/${product.id}`}
            onClick={onClose}
            className="flex items-center gap-6 p-4 hover:bg-light-darker dark:hover:bg-dark-light transition-colors"
          >
            <div className="relative w-20 h-20 flex-shrink-0">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
              {product.onSale && (
                <span className="absolute -top-2 -right-2 bg-primary text-dark text-xs font-medium px-2 py-1 rounded-full">
                  Sale
                </span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-dark dark:text-white font-medium text-lg truncate">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {product.categoryName}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-lg text-primary font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.oldPrice)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};