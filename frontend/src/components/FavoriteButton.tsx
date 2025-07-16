import React from 'react';
import { Heart } from 'lucide-react';
import { Product } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import { motion } from 'framer-motion';

interface FavoriteButtonProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  product, 
  size = 'md',
  className = '',
  showLabel = false
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isProductFavorite = isFavorite(product.id);
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  const sizes = {
    sm: {
      button: 'p-1.5',
      icon: 16
    },
    md: {
      button: 'p-2',
      icon: 20
    },
    lg: {
      button: 'p-3',
      icon: 24
    }
  };

  return (
    <motion.button
      onClick={handleToggleFavorite}
      whileTap={{ scale: 0.9 }}
      className={`flex items-center gap-2 rounded-full transition-all ${
        isProductFavorite 
          ? 'bg-error/10 text-error' 
          : 'bg-white/10 text-gray-400 hover:text-error hover:bg-error/10'
      } ${sizes[size].button} ${className}`}
      aria-label={isProductFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Heart 
        size={sizes[size].icon} 
        fill={isProductFavorite ? "currentColor" : "none"} 
        className={isProductFavorite ? 'animate-pulse' : ''}
      />
      {showLabel && (
        <span className="text-sm font-medium">
          {isProductFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        </span>
      )}
    </motion.button>
  );
};