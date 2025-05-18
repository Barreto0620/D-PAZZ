import React, { useState } from 'react';
import { Product } from '../types';
import { ChevronLeft, ChevronRight, Star, Minus, Plus, ShoppingCart } from 'lucide-react';
import { FavoriteButton } from './FavoriteButton';
import { useCart } from '../contexts/CartContext';
import { motion } from 'framer-motion';
import { Toast } from './Toast';

interface ProductDetailProps {
  product: Product;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const { addToCart } = useCart();

  const handlePrevImage = () => {
    setSelectedImage((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowToast(true);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-md overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-xl">
            <motion.img 
              key={selectedImage}
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Navigation arrows */}
            <button 
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
              aria-label="Imagem anterior"
            >
              <ChevronLeft size={20} />
            </button>
            
            <button 
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
              aria-label="Próxima imagem"
            >
              <ChevronRight size={20} />
            </button>
            
            {/* Favorite button */}
            <div className="absolute top-2 right-2">
              <FavoriteButton product={product} size="lg" />
            </div>
          </div>
          
          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === index 
                    ? 'border-primary scale-110' 
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img 
                  src={image} 
                  alt={`${product.name} - imagem ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-dark dark:text-white">{product.name}</h1>
          
          <div className="flex items-center mt-2">
            <div className="flex">
              {Array.from({ length: 5 }, (_, i) => (
                <Star 
                  key={i}
                  size={18}
                  className={i < Math.floor(product.rating) ? "text-primary fill-current" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              ({product.reviewCount} avaliações)
            </span>
          </div>
          
          <div className="flex items-end gap-2 mt-4">
            <span className="text-3xl font-bold text-dark dark:text-white">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
            </span>
            
            {product.oldPrice && (
              <span className="text-lg text-gray-500 dark:text-gray-400 line-through mb-1">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.oldPrice)}
              </span>
            )}
          </div>
          
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Categoria: <span className="text-dark dark:text-white">{product.categoryName}</span>
          </div>
          
          <div 
            className={`mt-2 text-sm ${product.stock > 0 ? 'text-success' : 'text-error'}`}
          >
            {product.stock > 0 ? 'Em estoque' : 'Fora de estoque'}
            {product.stock > 0 && product.stock <= 5 && (
              <span className="ml-1">
                (apenas {product.stock} {product.stock === 1 ? 'restante' : 'restantes'})
              </span>
            )}
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium text-dark dark:text-white mb-2">Descrição</h3>
            <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
          </div>
          
          <div className="mt-8 space-y-4">
            {/* Quantity selector */}
            <div className="flex items-center">
              <span className="mr-4 text-dark dark:text-white">Quantidade:</span>
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
                <button 
                  onClick={decreaseQuantity}
                  className="p-2 text-gray-500 hover:text-primary transition-colors"
                  aria-label="Diminuir quantidade"
                  disabled={quantity <= 1}
                >
                  <Minus size={18} />
                </button>
                
                <span className="w-12 text-center text-dark dark:text-white">{quantity}</span>
                
                <button 
                  onClick={increaseQuantity}
                  className="p-2 text-gray-500 hover:text-primary transition-colors"
                  aria-label="Aumentar quantidade"
                  disabled={quantity >= product.stock}
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
            
            {/* Add to cart button */}
            <motion.button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-dark py-3 rounded-lg font-medium transition-colors"
              whileTap={{ scale: 0.98 }}
              disabled={product.stock === 0}
            >
              <ShoppingCart size={20} />
              <span>Adicionar ao Carrinho</span>
            </motion.button>
          </div>
        </div>
      </div>
      
      {showToast && (
        <Toast 
          message={`${product.name} adicionado ao carrinho!`} 
          type="success" 
          onClose={() => setShowToast(false)} 
        />
      )}
    </div>
  );
};