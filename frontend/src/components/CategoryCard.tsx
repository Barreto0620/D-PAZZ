// src/components/CategoryCard.tsx (VERSÃO COM MAIS DEBUG)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';
import { motion } from 'framer-motion';
import { Image } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
    console.log(`[CategoryCard] Para "${category.name}", tentando carregar imagem:`, getImageUrl());
  }, [category]);

  const handleImageLoad = () => {
    console.log(`✅ [CategoryCard] SUCESSO ao carregar imagem para: "${category.name}"`);
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error(`❌ [CategoryCard] ERRO ao carregar imagem para: "${category.name}"`, e);
    setImageError(true);
    setImageLoaded(false);
  };

  const getImageUrl = (): string | null => {
    if (category.image && typeof category.image === 'string' && category.image.trim().length > 0) {
      return category.image.trim();
    }
    const urlImagem = (category as any).url_imagem;
    if (urlImagem && typeof urlImagem === 'string' && urlImagem.trim().length > 0) {
      return urlImagem.trim();
    }
    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="rounded-2xl overflow-hidden shadow-md group"
    >
      <Link to={`/categoria/${category.id}`} className="block relative">
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
          {imageUrl && !imageError ? (
            <>
              <img
                src={imageUrl}
                alt={category.name}
                className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
                crossOrigin="anonymous" // Ajuda com alguns problemas de CORS, mas não todos
              />
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700">
              <div className="p-4 rounded-full bg-white dark:bg-gray-800 shadow-lg mb-3">
                <Image className="w-8 h-8 text-gray-400" />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-300 text-center px-2 font-medium">
                {imageError ? 'Erro na imagem' : category.name}
              </span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <h3 className="text-xl font-semibold text-white drop-shadow-lg">
            {category.name}
          </h3>
          <p className="text-sm text-gray-200 mt-1 drop-shadow">
            {category.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};