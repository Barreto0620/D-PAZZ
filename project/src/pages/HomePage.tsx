import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Banner } from '../components/Banner';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { getFeaturedCategories, getOnSaleProducts, getBestSellerProducts } from '../services/api';
import { Category, Product } from '../types';
import { motion } from 'framer-motion';

export const HomePage: React.FC = () => {
  const [featuredCategories, setFeaturedCategories] = useState<Category[]>([]);
  const [onSaleProducts, setOnSaleProducts] = useState<Product[]>([]);
  const [bestSellerProducts, setBestSellerProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState({
    categories: true,
    onSale: true,
    bestSeller: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = await getFeaturedCategories();
        setFeaturedCategories(categories);
        setLoading(prev => ({ ...prev, categories: false }));
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(prev => ({ ...prev, categories: false }));
      }

      try {
        const onSale = await getOnSaleProducts();
        setOnSaleProducts(onSale);
        setLoading(prev => ({ ...prev, onSale: false }));
      } catch (error) {
        console.error('Error fetching on sale products:', error);
        setLoading(prev => ({ ...prev, onSale: false }));
      }

      try {
        const bestSeller = await getBestSellerProducts();
        setBestSellerProducts(bestSeller);
        setLoading(prev => ({ ...prev, bestSeller: false }));
      } catch (error) {
        console.error('Error fetching best seller products:', error);
        setLoading(prev => ({ ...prev, bestSeller: false }));
      }
    };

    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-light dark:bg-dark">
      <Helmet>
        <title>ImportShop - Produtos Importados de Qualidade</title>
        <meta name="description" content="A melhor loja de produtos importados do Brasil. Eletrônicos, roupas, acessórios e mais com os melhores preços." />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        {/* Banner */}
        <section className="mb-12">
          <Banner />
        </section>
        
        {/* Featured Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-dark dark:text-white mb-6">
            Categorias em Destaque
          </h2>
          
          {loading.categories ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div 
                  key={index} 
                  className="bg-light-darker dark:bg-dark-lighter rounded-2xl animate-pulse h-64"
                />
              ))}
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {featuredCategories.map(category => (
                <motion.div key={category.id} variants={itemVariants}>
                  <CategoryCard category={category} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
        
        {/* On Sale Products */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-dark dark:text-white mb-6">
            Em Promoção
          </h2>
          
          {loading.onSale ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div 
                  key={index} 
                  className="bg-light-darker dark:bg-dark-lighter rounded-2xl animate-pulse h-80"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {onSaleProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
        
        {/* Best Seller Products */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-dark dark:text-white mb-6">
            Mais Vendidos
          </h2>
          
          {loading.bestSeller ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div 
                  key={index} 
                  className="bg-light-darker dark:bg-dark-lighter rounded-2xl animate-pulse h-80"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {bestSellerProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
};