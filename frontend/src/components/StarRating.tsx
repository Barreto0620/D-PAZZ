// src/components/StarRating.tsx (VERSÃO MELHORADA)

import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating = 0,
  size = 16,
  className = ''
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        const fillPercentage = Math.round(
          Math.max(0, Math.min(1, rating - (starValue - 1))) * 100
        );

        return (
          <div key={index} className="relative" style={{ width: size, height: size }}>
            {/* Estrela de fundo (vazia). Cor do contorno definida explicitamente. */}
            <Star
              size={size}
              className="absolute top-0 left-0 text-gray-500"
              strokeWidth={1.5}
            />
            
            {/* Estrela da frente (preenchida), com a cor de preenchimento explícita */}
            <div
              className="absolute top-0 left-0 h-full overflow-hidden"
              style={{ width: `${fillPercentage}%` }}
            >
              <Star
                size={size}
                className="text-yellow-400 fill-yellow-400"
                strokeWidth={1.5}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};