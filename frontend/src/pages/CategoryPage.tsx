// pages/CategoryPage.tsx (VERSÃO 100% COMPLETA E CORRIGIDA)

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../contexts/ProductContext';
import { Product, Category } from '../types';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CategoryPage: React.FC = () => {
  // ===== CORREÇÃO PRINCIPAL AQUI =====
  // Removemos o `parseInt`. O `categoryId` agora é a string (uuid) vinda da URL.
  const { id: categoryId } = useParams<{ id: string }>();
  // ===================================

  const { categories, getProductsByCategory, loading: contextLoading } = useProducts();

  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<string>('default');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  useEffect(() => {
    // A lógica agora funciona corretamente quando o contexto termina de carregar
    if (!contextLoading) {
      if (categoryId) {
        // Encontra a categoria pelo ID (comparando string com string)
        const foundCategory = categories.find(cat => cat.id === categoryId);
        setCurrentCategory(foundCategory || null);

        // Obtém os produtos para esta categoria usando a função do contexto
        const productsInCategory = getProductsByCategory(categoryId);
        setCategoryProducts(productsInCategory);

      } else {
        setCurrentCategory(null);
        setCategoryProducts([]);
      }
      setLoading(false);
    }
  }, [categoryId, contextLoading, categories, getProductsByCategory]);

  const sortProducts = (productsToSort: Product[]): Product[] => {
    const sortedProducts = [...productsToSort];
    switch (sortOption) {
      case 'price-asc': return sortedProducts.sort((a, b) => a.price - b.price);
      case 'price-desc': return sortedProducts.sort((a, b) => b.price - a.price);
      case 'bestseller': return sortedProducts.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
      default: return sortedProducts;
    }
  };

  const sortedProducts = sortProducts(categoryProducts);

  const getSortOptionLabel = (option: string): string => {
    switch (option) {
      case 'price-asc': return 'Menor preço';
      case 'price-desc': return 'Maior preço';
      case 'bestseller': return 'Mais vendidos';
      default: return 'Ordenar por';
    }
  };

  return (
    <div className="min-h-screen bg-light dark:bg-dark">
      <Helmet>
        <title>{currentCategory ? `${currentCategory.name} - D'Pazz Imports` : 'Categoria - D\'Pazz Imports'}</title>
        <meta name="description" content={currentCategory?.description || 'Navegue por nossa categoria de produtos importados.'}/>
      </Helmet>

      <Navbar />

      <main className="container mx-auto px-4 py-6">
        <section className="mb-8">
          {loading ? (
            <div className="h-40 bg-light-darker dark:bg-dark-lighter rounded-2xl animate-pulse" />
          ) : currentCategory ? (
            <div className="h-40 rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${currentCategory.image})` }} />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center px-8">
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {currentCategory.name}
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-white/80 max-w-xl">
                  {currentCategory.description}
                </motion.p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <h1 className="text-2xl font-bold text-dark dark:text-white">Categoria não encontrada</h1>
            </div>
          )}
        </section>

        <section className="mb-6 flex justify-between items-center">
          <div className="text-dark dark:text-white">
            {!loading && (<span>{sortedProducts.length} produtos encontrados</span>)}
          </div>
          <div className="relative">
            <button onClick={() => setIsSortMenuOpen(!isSortMenuOpen)} className="flex items-center gap-2 bg-white dark:bg-dark-lighter px-4 py-2 rounded-lg text-dark dark:text-white">
              {getSortOptionLabel(sortOption)}
              <ChevronDown size={18} className={`transition-transform ${isSortMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isSortMenuOpen && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-lighter rounded-lg shadow-lg overflow-hidden z-10">
                  <button onClick={() => { setSortOption('default'); setIsSortMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-dark dark:text-white hover:bg-light-darker dark:hover:bg-dark-light transition-colors ${sortOption === 'default' ? 'bg-light-darker dark:bg-dark-light' : ''}`}>Padrão</button>
                  <button onClick={() => { setSortOption('price-asc'); setIsSortMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-dark dark:text-white hover:bg-light-darker dark:hover:bg-dark-light transition-colors ${sortOption === 'price-asc' ? 'bg-light-darker dark:bg-dark-light' : ''}`}>Menor preço</button>
                  <button onClick={() => { setSortOption('price-desc'); setIsSortMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-dark dark:text-white hover:bg-light-darker dark:hover:bg-dark-light transition-colors ${sortOption === 'price-desc' ? 'bg-light-darker dark:bg-dark-light' : ''}`}>Maior preço</button>
                  <button onClick={() => { setSortOption('bestseller'); setIsSortMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-dark dark:text-white hover:bg-light-darker dark:hover:bg-dark-light transition-colors ${sortOption === 'bestseller' ? 'bg-light-darker dark:bg-dark-light' : ''}`}>Mais vendidos</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        <section className="mb-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (<div key={index} className="bg-light-darker dark:bg-dark-lighter rounded-2xl animate-pulse h-80" />))}
            </div>
          ) : sortedProducts.length > 0 ? (
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}>
              {sortedProducts.map(product => (
                <motion.div key={product.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="bg-white dark:bg-dark-lighter rounded-2xl p-8 text-center">
              <p className="text-xl text-dark dark:text-white">Nenhum produto encontrado nesta categoria.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};