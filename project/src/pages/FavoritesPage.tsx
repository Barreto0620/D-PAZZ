import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ProductCard } from '../components/ProductCard'; // Assuming ProductCard is well-designed
import { useFavorites } from '../contexts/FavoritesContext';
import { Heart, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Helmet>
        <title>Meus Favoritos - ImportShop</title>
        <meta name="description" content="Seus produtos favoritos na ImportShop. Salve e organize os itens que mais te interessam." />
      </Helmet>

      <Navbar />

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg"> {/* Heart icon with a vibrant red background */}
              <Heart size={24} className="text-white" fill="white" /> {/* Filled heart for better visibility */}
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Meus Favoritos
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Aqui você encontra todos os produtos que conquistaram seu coração. Revise sua lista e faça suas escolhas!
          </p>
        </motion.div>

        {favorites.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.08 // Slightly faster stagger for more dynamic feel
                }
              }
            }}
          >
            {favorites.map(product => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 }, // More distinct hidden state
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { type: "spring", stiffness: 100, damping: 10 } // Spring animation
                  }
                }}
                whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }} // Subtle lift and shadow on hover
                transition={{ duration: 0.2 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
            className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 text-center border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, -5, 5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3 // Pause before repeating
                }}
                className="w-24 h-24 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center shadow-inner"
              >
                <Heart size={48} className="text-red-500 dark:text-red-400" fill="currentColor" />
              </motion.div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Sua lista de favoritos está vazia
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Parece que você ainda não adicionou nenhum produto aos seus favoritos. Comece a explorar nossa seleção e marque os itens que mais te encantam para encontrá-los facilmente aqui!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white px-8 py-4 rounded-full font-bold text-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <ArrowLeft size={20} />
              <span>Explorar Produtos</span>
            </Link>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
};