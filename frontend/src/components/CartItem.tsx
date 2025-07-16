import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItem as CartItemType } from '../types';
import { useCart } from '../contexts/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(product.id, newQuantity);
  };

  const totalPrice = product.price * quantity;

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white dark:bg-dark-lighter rounded-2xl shadow-md mb-4">
      <Link to={`/produto/${product.id}`} className="block shrink-0">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full sm:w-24 h-24 object-cover rounded-lg"
        />
      </Link>
      
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <Link to={`/produto/${product.id}`} className="font-medium text-dark dark:text-white hover:text-primary dark:hover:text-primary transition-colors">
              {product.name}
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {product.categoryName}
            </p>
          </div>
          
          <div className="text-right">
            <div className="font-bold text-dark dark:text-white">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)} cada
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-between mt-4 gap-2">
          <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
            <button 
              onClick={() => handleQuantityChange(quantity - 1)}
              className="p-2 text-gray-500 hover:text-primary transition-colors"
              aria-label="Diminuir quantidade"
              disabled={quantity <= 1}
            >
              <Minus size={16} />
            </button>
            
            <span className="w-10 text-center text-dark dark:text-white">{quantity}</span>
            
            <button 
              onClick={() => handleQuantityChange(quantity + 1)}
              className="p-2 text-gray-500 hover:text-primary transition-colors"
              aria-label="Aumentar quantidade"
              disabled={quantity >= product.stock}
            >
              <Plus size={16} />
            </button>
          </div>
          
          <button 
            onClick={() => removeFromCart(product.id)}
            className="flex items-center gap-1 text-gray-500 hover:text-error transition-colors p-2"
            aria-label="Remover item"
          >
            <Trash2 size={16} />
            <span className="text-sm">Remover</span>
          </button>
        </div>
      </div>
    </div>
  );
};