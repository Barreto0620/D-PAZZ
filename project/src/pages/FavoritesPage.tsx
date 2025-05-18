import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ProductCard } from '../components/ProductCard';
import { useFavorites } from '../contexts/FavoritesContext';
import { Heart, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen bg-light dark:bg-dark">
      <Helmet>
        <title>Favoritos - ImportShop</title>
        <meta name="description" content="Seus produtos favoritos na ImportShop." />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark dark:text-white">
            Meus Favoritos
          </h1>
        </div>
        
        {favorites.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {favorites.map(product => (
              <motion.div 
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5 }
                  }
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <Heart size={64} className="text-gray-300 dark:text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold text-dark dark:text-white mb-2">
              Sua lista de favoritos está vazia
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Você ainda não adicionou nenhum produto aos seus favoritos. Explore nossos produtos e marque os que você mais gosta!
            </p>
            <Link 
              to="/"
              className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-dark px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Explorar Produtos</span>
            </Link>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};