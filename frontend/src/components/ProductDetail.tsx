// src/components/ProductDetail.tsx (VERSÃO 100% COMPLETA E FINAL)

import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart, Check, Star } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { motion } from 'framer-motion';
import { StarRating } from './StarRating';

const colorMap: { [key: string]: string } = { 'preto': '#000000', 'branco': '#FFFFFF', 'marrom': '#8B4513', 'azul marinho': '#000080', 'bege': '#F5F5DC', 'vermelho': '#FF0000', 'cinza': '#808080', };
const parseColors = (colorString?: string): { name: string, hex: string }[] => { if (!colorString) return []; return colorString.split('/').map(name => { const trimmedName = name.trim(); const hex = colorMap[trimmedName.toLowerCase()] || '#CCCCCC'; return { name: trimmedName, hex }; }); };
const parseSizes = (sizeString?: string): string[] => { if (!sizeString) return []; const sizes = new Set<string>(); const parts = sizeString.replace(/\s/g, '').split(','); parts.forEach(part => { if (part.includes('-')) { const [start, end] = part.split('-').map(Number); if (!isNaN(start) && !isNaN(end)) for (let i = start; i <= end; i++) sizes.add(i.toString()); } else { if (!isNaN(Number(part)) && part) sizes.add(part); } }); return Array.from(sizes).sort((a, b) => Number(a) - Number(b)); };

interface ProductDetailProps {
  product: Product;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const availableColors = useMemo(() => parseColors(product.color), [product.color]);
  const availableSizes = useMemo(() => parseSizes(product.tamanhos), [product.tamanhos]);
  const canAddToCart = (): boolean => { if (availableSizes.length > 0 && !selectedSize) return false; if (availableColors.length > 0 && !selectedColor) return false; return product.stock > 0; };
  const handleAddToCart = () => { if (!canAddToCart()) { alert('Por favor, selecione as opções desejadas.'); return; } const cartProduct = { ...product, selectedColor, selectedSize }; addToCart(cartProduct, quantity); alert(`${product.name} adicionado ao carrinho!`); };
  const handlePrevImage = () => product.images && setSelectedImage((p) => (p === 0 ? product.images.length - 1 : p - 1));
  const handleNextImage = () => product.images && setSelectedImage((p) => (p === product.images.length - 1 ? 0 : p + 1));
  const decreaseQuantity = () => quantity > 1 && setQuantity(quantity - 1);
  const increaseQuantity = () => quantity < product.stock && setQuantity(quantity + 1);

  return (
    <div className="bg-transparent text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Coluna da Esquerda: Galeria de Imagens */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-md">
            {product.images && product.images.length > 0 ? (
              <motion.img 
                key={selectedImage} src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover"
                initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
              />
            ) : <div className="w-full h-full bg-gray-800 flex items-center justify-center">Sem Imagem</div>}
            
            <div className="absolute top-2 right-2">
                <button onClick={() => toggleFavorite(product)} className="p-2 bg-gray-900/50 rounded-full hover:bg-gray-900/80 transition-all">
                    <Star className={isFavorite(product.id) ? 'text-yellow-400 fill-current' : 'text-white'}/>
                </button>
            </div>

            {product.images && product.images.length > 1 && (<>
              <button onClick={handlePrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-900/50 text-white hover:bg-gray-900/80 transition-colors"><ChevronLeft size={24} /></button>
              <button onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-900/50 text-white hover:bg-gray-900/80 transition-colors"><ChevronRight size={24} /></button>
            </>)}
          </div>
          <div className="flex gap-2">
            {product.images?.map((image, index) => (
              <button key={index} onClick={() => setSelectedImage(index)} className={`w-16 h-16 rounded-md overflow-hidden border-2 ${selectedImage === index ? 'border-primary' : 'border-transparent'}`}>
                <img src={image} alt={`thumbnail ${index}`} className="w-full h-full object-cover"/>
              </button>
            ))}
          </div>
        </div>

        {/* Coluna da Direita: Informações do Produto */}
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          
          <div className="flex items-center gap-2">
            <StarRating rating={product.rating} size={20} />
            <span className="text-sm text-gray-400">({product.reviewCount} avaliações)</span>
          </div>
          
          <p className="text-4xl font-bold text-primary">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</p>
          <div className="text-sm">Categoria: <span className="font-semibold">{product.categoryName}</span></div>
          <div className="text-sm font-semibold text-green-400">{product.stock > 0 ? 'Em estoque' : 'Fora de estoque'}</div>
          <div><h3 className="font-semibold mb-1">Descrição</h3><p className="text-gray-300 text-sm">{product.description}</p></div>
          
          {availableSizes.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Tamanho</h3>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map(size => (
                  <button key={size} onClick={() => setSelectedSize(size)} className={`w-12 h-10 rounded-md border-2 flex items-center justify-center transition-all ${selectedSize === size ? 'bg-white text-black border-white' : 'border-gray-600 hover:border-white'}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {availableColors.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Cor</h3>
              <div className="flex flex-wrap gap-3">
                {availableColors.map(color => (
                  <button key={color.name} onClick={() => setSelectedColor(color.name)} className={`px-3 py-1 rounded-md border-2 flex items-center justify-center gap-2 transition-all ${selectedColor === color.name ? 'bg-white text-black border-white' : 'border-gray-600 hover:border-white'}`}>
                    <div className="w-5 h-5 rounded-full border border-gray-400" style={{ backgroundColor: color.hex }}></div>
                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <h3 className="font-semibold">Quantidade:</h3>
            <div className="flex items-center border-2 border-gray-600 rounded-md">
              <button onClick={decreaseQuantity} className="px-3 py-1" disabled={quantity <= 1}>-</button>
              <span className="px-4">{quantity}</span>
              <button onClick={increaseQuantity} className="px-3 py-1" disabled={quantity >= product.stock}>+</button>
            </div>
            <span className="text-sm text-gray-400">Máximo: {product.stock}</span>
          </div>

          <button onClick={handleAddToCart} disabled={!canAddToCart()} className="w-full py-3 rounded-md bg-primary text-black font-bold hover:bg-yellow-400 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed">
            {canAddToCart() ? 'Adicionar ao Carrinho' : 'Selecione as opções'}
          </button>
        </div>
      </div>
    </div>
  );
};