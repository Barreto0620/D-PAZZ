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
    // Debug: Log completo da categoria com todas as possíveis variações do campo
    console.log('=== CategoryCard Debug ===');
    console.log('Category full object:', category);
    console.log('All category keys:', Object.keys(category));
    console.log('Category ID:', category.id);
    console.log('Category Name:', category.name);
    console.log('Category image:', category.image);
    console.log('Category url_imagem:', (category as any).url_imagem);
    console.log('Category urlImagem:', (category as any).urlImagem);
    console.log('Category imageUrl:', (category as any).imageUrl);
    console.log('========================');
    
    // Reset states quando a categoria muda
    setImageError(false);
    setImageLoaded(false);
  }, [category]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log('✅ Image loaded successfully for:', category.name);
    console.log('✅ Final image src:', e.currentTarget.src);
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('❌ Image failed to load for:', category.name);
    console.error('❌ Failed image src:', e.currentTarget.src);
    setImageError(true);
    setImageLoaded(false);
  };

  // Função para obter a URL da imagem testando todas as possibilidades
  const getImageUrl = (): string | null => {
    const possibleFields = [
      (category as any).url_imagem,
      (category as any).urlImagem,
      (category as any).imageUrl,
      (category as any).image_url,
      category.image
    ];

    for (const field of possibleFields) {
      if (field && typeof field === 'string' && field.trim().length > 0) {
        console.log('Found image URL in field:', field);
        return field.trim();
      }
    }
    
    // Se não encontrou em nenhum campo, tenta uma URL de fallback para teste
    console.log('No image URL found, using fallback');
    return 'https://cdn.pixabay.com/photo/2024/02/29/19/58/winter-8605108_1280.jpg';
  };

  // Verifica se a URL da imagem é válida
  const isValidImageUrl = (url: string | null): boolean => {
    if (!url || typeof url !== 'string') return false;
    
    const trimmedUrl = url.trim();
    if (trimmedUrl.length === 0) return false;
    
    // Verifica se é uma URL válida
    try {
      new URL(trimmedUrl);
      return true;
    } catch {
      // Se não for URL completa, verifica se é um caminho relativo válido
      return trimmedUrl.startsWith('/') || trimmedUrl.includes('.');
    }
  };

  const imageUrl = getImageUrl();
  const validImageUrl = isValidImageUrl(imageUrl);
  
  console.log('Final image validation for', category.name, ':', {
    imageUrl: imageUrl,
    isValid: validImageUrl,
    willShowImage: validImageUrl && !imageError
  });

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="rounded-2xl overflow-hidden shadow-md group"
    >
      <Link to={`/categoria/${category.id}`} className="block relative">
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
          {validImageUrl && imageUrl && !imageError ? (
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
              />
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
            </>
          ) : (
            // Fallback quando há erro na imagem ou URL inválida
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700">
              <div className="p-4 rounded-full bg-white dark:bg-gray-800 shadow-lg mb-3">
                <Image className="w-8 h-8 text-gray-400" />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-300 text-center px-2 font-medium">
                {category.name}
              </span>
              {/* Debug info em desenvolvimento */}
              {process.env.NODE_ENV === 'development' && (
                <div className="absolute top-2 left-2 text-xs bg-red-500 text-white px-1 rounded">
                  {!imageUrl ? 'No URL' : !validImageUrl ? 'Invalid URL' : 'Load Error'}
                </div>
              )}
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