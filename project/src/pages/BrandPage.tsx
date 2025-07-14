import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { Product } from '../types';
import { Helmet } from 'react-helmet';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SectionTitle } from '../components/SectionTitle';
import { ProductCard } from '../components/ProductCard';
import { Toast } from '../components/Toast';
import { motion } from 'framer-motion';
import { Sparkles, Flame, Star } from 'lucide-react'; // Importe outros ícones se for usar dinamicamente

export const BrandPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getProductsByBrand, loading } = useProducts();
  const [brandProducts, setBrandProducts] = useState<Product[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  // Função para capitalizar a primeira letra do slug
  const capitalize = useCallback((s: string | undefined) => {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }, []);

  // Função para exibir o toast
  const handleShowToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  }, []);

  useEffect(() => {
    const fetchBrandProducts = async () => {
      if (!loading && slug) {
        try {
          // getProductsByBrand já filtra, então apenas use o slug
          const products = getProductsByBrand(slug);
          setBrandProducts(products);

          if (products.length === 0) {
            handleShowToast(`Nenhum produto encontrado para a marca "${capitalize(slug)}".`, 'info');
          }
        } catch (error) {
          console.error(`Erro ao carregar produtos da marca ${slug}:`, error);
          handleShowToast(`Erro ao carregar produtos da marca ${capitalize(slug)}.`, 'error');
        }
      }
    };

    fetchBrandProducts();
  }, [loading, slug, getProductsByBrand, capitalize, handleShowToast]); // Adicionado capitalize e handleShowToast às dependências

  // Variantes para animação do Framer Motion
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

  // Determina o ícone e gradiente da SectionTitle baseado na marca (exemplo)
  const getBrandDetails = (brandSlug: string) => {
    switch (brandSlug.toLowerCase()) {
      case 'nike':
        return { icon: Sparkles, gradient: 'from-blue-500 to-indigo-600' };
      case 'adidas':
        return { icon: Flame, gradient: 'from-orange-500 to-red-600' };
      case 'puma':
        return { icon: Star, gradient: 'from-purple-500 to-pink-600' };
      default:
        return { icon: Sparkles, gradient: 'from-gray-500 to-gray-600' };
    }
  };

  const brandDetails = getBrandDetails(slug || '');

  return (
    <div className="min-h-screen relative font-sans">
      <Helmet>
        <title>{capitalize(slug)} | D'Pazz Imports</title>
        <meta name="description" content={`Explore os produtos da ${capitalize(slug)} na D'Pazz Imports - Tênis premium, lançamentos e performance incomparável.`} />
        <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
      </Helmet>

      {/* Background fixo, como no NikePage original */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: `url(https://raw.githubusercontent.com/Barreto0620/img_public/04cb063dcdc701738d51396c8226e9c71341ea0d/logo_home.png)`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}></div>
      <div className="absolute inset-0 z-10 bg-white bg-opacity-80 dark:bg-gray-900 dark:bg-opacity-70"></div>

      <div className="relative z-20 min-h-screen flex flex-col">
        <Navbar />

        <main className="container mx-auto px-4 py-8 md:py-12 flex-grow">
          <SectionTitle
            icon={brandDetails.icon}
            title={`Coleção ${capitalize(slug)} Premium`}
            subtitle={`Performance, design e inovação em cada detalhe. Descubra os modelos ${capitalize(slug)} ideais para seu estilo de vida.`}
            gradient={brandDetails.gradient}
          />

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-gray-200 dark:bg-gray-700 rounded-3xl animate-pulse h-96" />
              ))}
            </div>
          ) : (
            <>
              {/* Contador de produtos e botão de ordenar, com classes Tailwind */}
              <div className="flex justify-between items-center mb-6 text-gray-600 dark:text-gray-400">
                <p>
                  {brandProducts.length} produtos encontrados
                </p>
                {/* O botão "Ordenar por" pode ser implementado futuramente */}
                <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200">
                  Ordenar por
                </button>
              </div>

              {!brandProducts.length && (
                <div className="text-center py-10 text-gray-700 dark:text-gray-300">
                  <p>Nenhum produto encontrado para a marca "{capitalize(slug)}".</p>
                </div>
              )}

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {brandProducts.map(product => (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="transform transition-all duration-300"
                  >
                    {/* Usando o componente ProductCard reutilizável */}
                    <ProductCard product={product} onShowToast={handleShowToast} />
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </main>

        <Footer />
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};