// project/src/components/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Plus, Minus } from 'lucide-react';

// Definir as interfaces necessárias
interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  images?: string[];
  onSale?: boolean;
  bestSeller?: boolean;
  categoryName: string;
  rating: number;
  reviewCount: number;
  stock: number;
}

interface ProductCardProps {
  product: Product;
  quantity: number;
  isProductFavorite: boolean;
  handleToggleFavorite: (e: React.MouseEvent) => void;
  handleQuantityChange: (e: React.MouseEvent, newQuantity: number) => void;
  handleAddToCart: (e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantity,
  isProductFavorite,
  handleToggleFavorite,
  handleQuantityChange,
  handleAddToCart
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative rounded-2xl overflow-hidden transition-all duration-300 ${
        quantity > 0 ? 'ring-2 ring-primary-dark bg-primary/5' : 'bg-white dark:bg-dark-lighter'
      } shadow-md`}
    >
      <Link to={`/produto/${product.id}`} className="block relative">
        <div className="relative aspect-square overflow-hidden">
          {/* Correção: Adicionado verificação para product.images antes de acessar [0] */}
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            // Imagem de placeholder caso não haja imagens
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Imagem não disponível
            </div>
          )}

          {product.onSale && (
            <div className="absolute top-2 left-2 bg-primary text-dark px-2 py-1 rounded-lg text-xs font-medium">
              Promoção
            </div>
          )}

          {product.bestSeller && (
            <div className="absolute top-2 right-2 bg-error text-white px-2 py-1 rounded-lg text-xs font-medium">
              Mais Vendido
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-dark dark:text-white line-clamp-2 min-h-[48px]">
                {product.name}
              </h3>

              <div className="mt-1 flex items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {product.categoryName}
                </span>
              </div>

              <div className="mt-2 flex items-center">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={i < Math.floor(product.rating) ? "text-primary" : "text-gray-300"}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  ({product.reviewCount})
                </span>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <span className="font-bold text-dark dark:text-white">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                </span>

                {product.oldPrice && (
                  <span className="text-gray-500 dark:text-gray-400 text-sm line-through">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.oldPrice)}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-full transition-colors ${
                isProductFavorite
                  ? 'text-error bg-error/10'
                  : 'text-gray-400 hover:text-error hover:bg-error/10'
              }`}
              aria-label={isProductFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
              <Heart
                size={20}
                fill={isProductFavorite ? "currentColor" : "none"}
                className={isProductFavorite ? 'animate-pulse' : ''}
              />
            </button>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        {quantity > 0 ? (
          <div className="flex items-center justify-between gap-2 bg-white dark:bg-dark-lighter rounded-lg p-1">
            <button
              onClick={(e) => handleQuantityChange(e, quantity - 1)}
              className="p-2 text-dark dark:text-white hover:bg-light-darker dark:hover:bg-dark-light rounded-lg transition-colors"
              disabled={quantity <= 0}
            >
              <Minus size={18} />
            </button>

            <span className="text-dark dark:text-white font-medium">
              {quantity}
            </span>

            <button
              onClick={(e) => handleQuantityChange(e, quantity + 1)}
              className="p-2 text-dark dark:text-white hover:bg-light-darker dark:hover:bg-dark-light rounded-lg transition-colors"
              disabled={quantity >= product.stock}
            >
              <Plus size={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-dark py-2 rounded-lg transition-colors"
            disabled={product.stock === 0}
          >
            <ShoppingCart size={18} />
            <span>Adicionar</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};