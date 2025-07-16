import React, { useState } from 'react';
import { Product } from '../types';
import { ChevronLeft, ChevronRight, Star, Minus, Plus, ShoppingCart, Check } from 'lucide-react';
import { FavoriteButton } from './FavoriteButton';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { motion } from 'framer-motion';
import { Toast } from './Toast';

// Types para futura integração com BD
interface ProductSize {
  id: string;
  size: string;
  available: boolean;
  stock: number;
}

interface ProductColor {
  id: string;
  name: string;
  hexCode: string;
  available: boolean;
  stock: number;
  image?: string; // Imagem específica da cor
}

interface ProductVariant {
  id: string;
  sizeId: string;
  colorId: string;
  stock: number;
  priceModifier?: number; // Para preços diferenciados por variante
}

interface ProductDetailProps {
  product: Product;
  onShowToast?: (message: string, type: 'success' | 'error' | 'info') => void;
  // Futura integração com BD
  availableSizes?: ProductSize[];
  availableColors?: ProductColor[];
  variants?: ProductVariant[];
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  onShowToast,
  availableSizes,
  availableColors,
  variants 
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Mock data - será substituído pelos dados do BD
  const mockSizes: ProductSize[] = availableSizes || [
    { id: '34', size: '34', available: true, stock: 5 },
    { id: '36', size: '36', available: true, stock: 3 },
    { id: '38', size: '38', available: true, stock: 8 },
    { id: '40', size: '40', available: true, stock: 2 },
    { id: '42', size: '42', available: false, stock: 0 },
    { id: '44', size: '44', available: true, stock: 1 },
  ];

  const mockColors: ProductColor[] = availableColors || [
    { id: 'black', name: 'Preto', hexCode: '#000000', available: true, stock: 10 },
    { id: 'white', name: 'Branco', hexCode: '#FFFFFF', available: true, stock: 5 },
    { id: 'brown', name: 'Marrom', hexCode: '#8B4513', available: true, stock: 3 },
    { id: 'navy', name: 'Azul Marinho', hexCode: '#000080', available: true, stock: 7 },
    { id: 'beige', name: 'Bege', hexCode: '#F5F5DC', available: false, stock: 0 },
  ];

  // Função para obter estoque da variante específica
  const getVariantStock = (sizeId: string, colorId: string): number => {
    if (variants) {
      const variant = variants.find(v => v.sizeId === sizeId && v.colorId === colorId);
      return variant?.stock || 0;
    }
    // Fallback: interseção dos estoques individuais
    const size = mockSizes.find(s => s.id === sizeId);
    const color = mockColors.find(c => c.id === colorId);
    return Math.min(size?.stock || 0, color?.stock || 0);
  };

  // Função para verificar se uma combinação está disponível
  const isVariantAvailable = (sizeId: string, colorId: string): boolean => {
    if (variants) {
      const variant = variants.find(v => v.sizeId === sizeId && v.colorId === colorId);
      return variant ? variant.stock > 0 : false;
    }
    return getVariantStock(sizeId, colorId) > 0;
  };

  // Atualizar estoque disponível baseado na seleção
  const getAvailableStock = (): number => {
    if (selectedSize && selectedColor) {
      return getVariantStock(selectedSize, selectedColor);
    }
    return product.stock;
  };

  // Verificar se pode adicionar ao carrinho
  const canAddToCart = (): boolean => {
    if (mockSizes.length > 0 && !selectedSize) return false;
    if (mockColors.length > 0 && !selectedColor) return false;
    return getAvailableStock() > 0;
  };

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
    if (!canAddToCart()) {
      const message = !selectedSize ? 'Selecione um tamanho' : 
                     !selectedColor ? 'Selecione uma cor' : 
                     'Produto indisponível';
      
      if (onShowToast) {
        onShowToast(message, 'error');
      } else {
        setToastMessage(message);
        setToastType('error');
        setShowToast(true);
      }
      return;
    }

    // Criar objeto com as variantes selecionadas para o carrinho
    const cartProduct = {
      ...product,
      selectedVariant: {
        size: selectedSize,
        color: selectedColor,
        sizeLabel: mockSizes.find(s => s.id === selectedSize)?.size,
        colorLabel: mockColors.find(c => c.id === selectedColor)?.name,
      }
    };

    addToCart(cartProduct, quantity);
    
    const sizeLabel = mockSizes.find(s => s.id === selectedSize)?.size;
    const colorLabel = mockColors.find(c => c.id === selectedColor)?.name;
    const message = `${product.name} ${sizeLabel ? `(${sizeLabel})` : ''} ${colorLabel ? `em ${colorLabel}` : ''} adicionado ao carrinho!`;
    
    if (onShowToast) {
      onShowToast(message, 'success');
    } else {
      setToastMessage(message);
      setToastType('success');
      setShowToast(true);
    }
  };

  const handleToggleFavorite = () => {
    const currentState = isFavorite(product.id);
    toggleFavorite(product);
    
    const message = !currentState 
      ? `"${product.name}" adicionado aos seus favoritos!`
      : `"${product.name}" removido dos seus favoritos.`;
    const type = !currentState ? 'success' : 'info';
    
    if (onShowToast) {
      onShowToast(message, type);
    } else {
      setToastMessage(message);
      setToastType(type);
      setShowToast(true);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    const maxStock = getAvailableStock();
    if (quantity < maxStock) {
      setQuantity(quantity + 1);
    }
  };

  // Atualizar quantidade quando mudar variante
  const handleSizeChange = (sizeId: string) => {
    setSelectedSize(sizeId);
    // Reset quantidade se exceder o novo estoque
    const newMaxStock = selectedColor ? getVariantStock(sizeId, selectedColor) : mockSizes.find(s => s.id === sizeId)?.stock || 0;
    if (quantity > newMaxStock) {
      setQuantity(Math.min(quantity, newMaxStock));
    }
  };

  const handleColorChange = (colorId: string) => {
    setSelectedColor(colorId);
    // Reset quantidade se exceder o novo estoque
    const newMaxStock = selectedSize ? getVariantStock(selectedSize, colorId) : mockColors.find(c => c.id === colorId)?.stock || 0;
    if (quantity > newMaxStock) {
      setQuantity(Math.min(quantity, newMaxStock));
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
            
            {/* Favorite button com handler personalizado */}
            <div className="absolute top-2 right-2">
              <button
                onClick={handleToggleFavorite}
                className={`p-3 rounded-full transition-all ${
                  isFavorite(product.id)
                    ? 'text-error bg-white/90 backdrop-blur-sm shadow-lg' 
                    : 'text-gray-600 bg-white/80 backdrop-blur-sm hover:text-error hover:bg-white/90 shadow-md'
                }`}
                aria-label={isFavorite(product.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill={isFavorite(product.id) ? "currentColor" : "none"}
                  stroke="currentColor" 
                  strokeWidth="2"
                  className={isFavorite(product.id) ? 'animate-pulse' : ''}
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
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
            className={`mt-2 text-sm ${getAvailableStock() > 0 ? 'text-success' : 'text-error'}`}
          >
            {getAvailableStock() > 0 ? 'Em estoque' : 'Fora de estoque'}
            {getAvailableStock() > 0 && getAvailableStock() <= 5 && (
              <span className="ml-1">
                (apenas {getAvailableStock()} {getAvailableStock() === 1 ? 'restante' : 'restantes'})
              </span>
            )}
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium text-dark dark:text-white mb-2">Descrição</h3>
            <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
          </div>
          
          <div className="mt-8 space-y-6">
            {/* Size selector */}
            {mockSizes.length > 0 && (
              <div>
                <h3 className="font-medium text-dark dark:text-white mb-3">Tamanho</h3>
                <div className="flex flex-wrap gap-2">
                  {mockSizes.map((size) => {
                    const isAvailable = selectedColor ? isVariantAvailable(size.id, selectedColor) : size.available;
                    const isSelected = selectedSize === size.id;
                    
                    return (
                      <button
                        key={size.id}
                        onClick={() => isAvailable ? handleSizeChange(size.id) : null}
                        disabled={!isAvailable}
                        className={`
                          relative min-w-[3rem] h-12 px-3 rounded-lg border-2 font-medium text-sm transition-all
                          ${isSelected 
                            ? 'border-primary bg-primary text-dark' 
                            : isAvailable 
                              ? 'border-gray-300 dark:border-gray-600 text-dark dark:text-white hover:border-primary hover:bg-primary/10' 
                              : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed bg-gray-50 dark:bg-gray-800'
                          }
                        `}
                      >
                        {size.size}
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <Check size={12} className="text-dark" />
                          </div>
                        )}
                        {!isAvailable && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-0.5 bg-gray-400 dark:bg-gray-600 rotate-45"></div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {selectedSize && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Tamanho selecionado: <span className="font-medium text-dark dark:text-white">
                      {mockSizes.find(s => s.id === selectedSize)?.size}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Color selector */}
            {mockColors.length > 0 && (
              <div>
                <h3 className="font-medium text-dark dark:text-white mb-3">Cor</h3>
                <div className="flex flex-wrap gap-3">
                  {mockColors.map((color) => {
                    const isAvailable = selectedSize ? isVariantAvailable(selectedSize, color.id) : color.available;
                    const isSelected = selectedColor === color.id;
                    
                    return (
                      <button
                        key={color.id}
                        onClick={() => isAvailable ? handleColorChange(color.id) : null}
                        disabled={!isAvailable}
                        className={`
                          relative group flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all
                          ${isSelected 
                            ? 'border-primary bg-primary/10' 
                            : isAvailable 
                              ? 'border-gray-300 dark:border-gray-600 hover:border-primary' 
                              : 'border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50'
                          }
                        `}
                      >
                        <div 
                          className={`
                            w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 relative
                            ${color.hexCode === '#FFFFFF' ? 'bg-white' : ''}
                          `}
                          style={{ backgroundColor: color.hexCode }}
                        >
                          {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Check size={12} className={color.hexCode === '#FFFFFF' ? 'text-gray-700' : 'text-white'} />
                            </div>
                          )}
                          {!isAvailable && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full h-0.5 bg-gray-400 dark:bg-gray-600 rotate-45"></div>
                            </div>
                          )}
                        </div>
                        <span className={`text-sm font-medium ${
                          isAvailable ? 'text-dark dark:text-white' : 'text-gray-400 dark:text-gray-600'
                        }`}>
                          {color.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {selectedColor && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Cor selecionada: <span className="font-medium text-dark dark:text-white">
                      {mockColors.find(c => c.id === selectedColor)?.name}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Quantity selector */}
            <div className="flex items-center">
              <span className="mr-4 text-dark dark:text-white">Quantidade:</span>
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
                <button 
                  onClick={decreaseQuantity}
                  className="p-2 text-gray-500 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Diminuir quantidade"
                  disabled={quantity <= 1}
                >
                  <Minus size={18} />
                </button>
                
                <span className="w-12 text-center text-dark dark:text-white">{quantity}</span>
                
                <button 
                  onClick={increaseQuantity}
                  className="p-2 text-gray-500 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Aumentar quantidade"
                  disabled={quantity >= getAvailableStock()}
                >
                  <Plus size={18} />
                </button>
              </div>
              <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                Máximo: {getAvailableStock()}
              </span>
            </div>
            
            {/* Add to cart button */}
            <motion.button
              onClick={handleAddToCart}
              className={`
                w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all
                ${canAddToCart() 
                  ? 'bg-primary hover:bg-secondary text-dark' 
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }
              `}
              whileTap={canAddToCart() ? { scale: 0.98 } : {}}
              disabled={!canAddToCart()}
            >
              <ShoppingCart size={20} />
              <span>
                {!selectedSize && mockSizes.length > 0 ? 'Selecione um tamanho' :
                 !selectedColor && mockColors.length > 0 ? 'Selecione uma cor' :
                 getAvailableStock() === 0 ? 'Indisponível' :
                 'Adicionar ao Carrinho'}
              </span>
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Toast local (fallback) */}
      {showToast && !onShowToast && (
        <Toast 
          message={toastMessage} 
          type={toastType}
          onClose={() => setShowToast(false)} 
        />
      )}
    </div>
  );
};