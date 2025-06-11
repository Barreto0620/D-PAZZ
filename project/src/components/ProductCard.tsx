import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCart } from '../contexts/CartContext';
import { motion } from 'framer-motion';

interface ProductCardProps {
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void; 
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onShowToast }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart, cartItems, updateQuantity } = useCart();
  const [isAdding, setIsAdding] = useState(false); // Unused, consider removing if not needed for animation feedback
  
  const cartItem = cartItems.find(item => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cartItem) {
      addToCart(product);
      // setIsAdding(true); // Consider if this state is still needed for animation
      // setTimeout(() => setIsAdding(false), 300); // And this timeout
      onShowToast(`"${product.name}" adicionado ao carrinho!`, 'success'); 
    } else {
      onShowToast(`"${product.name}" já está no seu carrinho.`, 'info'); 
    }
  };
  
  const handleQuantityChange = (e: React.MouseEvent, newQuantity: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (newQuantity === 0) {
      updateQuantity(product.id, 0);
      onShowToast(`"${product.name}" removido do carrinho.`, 'error'); 
    } else if (newQuantity <= product.stock) {
      updateQuantity(product.id, newQuantity);
      onShowToast(`Quantidade de "${product.name}" atualizada para ${newQuantity}.`, 'info'); 
    } else {
      onShowToast(`Limite de estoque para "${product.name}" atingido!`, 'error');
    }
  };
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const currentState = isFavorite(product.id);
    toggleFavorite(product);
    if (!currentState) {
      onShowToast(`"${product.name}" adicionado aos seus favoritos!`, 'success');
    } else {
      onShowToast(`"${product.name}" removido dos seus favoritos.`, 'info');
    }
  };

  const isProductFavorite = isFavorite(product.id);

  return (
    <>
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
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
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
    </>
  );
};