// pages/index.tsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Banner } from '../components/Banner';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../contexts/ProductContext'; // Import do hook useProducts
import { Category, Product } from '../types'; // Mantenha a importação de tipos
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Star, ShoppingBag, Flame, Trophy } from 'lucide-react';
import Slider from 'react-slick';
import { Toast } from '../components/Toast';
import { VideoBanner } from '../components/VideoBanner';
import { WhatsAppButton } from '../components/WhatsAppButton';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const HomePage: React.FC = () => {
  const {
    categories, // As categorias agora vêm do contexto
    loading: productsContextLoading,
    getFeaturedProducts,
    getBestSellers,
    getOnSaleProducts,
    getNoveltiesProducts,
  } = useProducts();

  const [homeFeaturedCategories, setHomeFeaturedCategories] = useState<Category[]>([]);
  const [homeOnSaleProducts, setHomeOnSaleProducts] = useState<Product[]>([]);
  const [homeBestSellerProducts, setHomeBestSellerProducts] = useState<Product[]>([]);
  const [homeNoveltiesProducts, setHomeNoveltiesProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState({
    categories: true,
    onSale: true,
    bestSeller: true,
    novelties: true,
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  const handleShowToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  useEffect(() => {
    if (!productsContextLoading) {
      // Categorias em destaque
      const filteredFeaturedCategories = categories.filter(cat => cat.featured);
      setHomeFeaturedCategories(filteredFeaturedCategories);
      setLoading(prev => ({ ...prev, categories: false }));

      // Produtos em promoção
      setHomeOnSaleProducts(getOnSaleProducts());
      setLoading(prev => ({ ...prev, onSale: false }));

      // Produtos mais vendidos
      setHomeBestSellerProducts(getBestSellers());
      setLoading(prev => ({ ...prev, bestSeller: false }));

      // Produtos de novidades
      setHomeNoveltiesProducts(getNoveltiesProducts());
      setLoading(prev => ({ ...prev, novelties: false }));
    }
  }, [productsContextLoading, categories, getOnSaleProducts, getBestSellers, getNoveltiesProducts]);

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

  const titleVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const SectionTitle = ({
    icon: Icon,
    title,
    subtitle,
    gradient = "from-primary to-accent"
  }: {
    icon: any,
    title: string,
    subtitle: string,
    gradient?: string
  }) => (
    <motion.div
      className="text-center mb-10"
      variants={titleVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="flex items-center justify-center mb-4">
        <div className={`p-3 rounded-full bg-gradient-to-r ${gradient} shadow-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
      <h2 className="text-4xl font-bold text-dark dark:text-white mb-3 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
        {title}
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
        {subtitle}
      </p>
      <div className={`w-24 h-1 bg-gradient-to-r ${gradient} mx-auto mt-4 rounded-full`}></div>
    </motion.div>
  );

  const StatsCard = ({ number, label, icon: Icon }: { number: string, label: string, icon: any }) => (
    <motion.div
      className="bg-white dark:bg-dark-lighter rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold text-primary mb-1">{number}</div>
          <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">{label}</div>
        </div>
        <div className="p-3 bg-gradient-to-r from-primary to-accent rounded-full">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const categorySliderSettings = {
    dots: false,
    infinite: true,
    speed: 5000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    arrows: false,
    pauseOnHover: true,
    className: "center",
    centerMode: true,
    centerPadding: "60px",
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
          centerPadding: "40px",
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
          centerPadding: "30px",
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 0,
          dots: false,
          centerPadding: "20%",
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
          centerPadding: "15%",
        }
      }
    ]
  };

  const productSliderSettings = {
    dots: false,
    infinite: true,
    speed: 4000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    arrows: false,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <div className="min-h-screen relative font-sans">
      <Helmet>
        <title>D'Pazz Imports - Tênis Premium | Qualidade Internacional</title>
        <meta name="description" content="Descubra a excelência em produtos importados. Tênis esportivos de alta performance e perfumes sofisticados das melhores marcas mundiais. Qualidade premium, entrega rápida." />
        <link rel="icon" type="image/x-icon" href="img/favicon.ico" />
      </Helmet>

      {/* Imagem de fundo */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(https://raw.githubusercontent.com/Barreto0620/img_public/04cb063dcdc701738d51396c8226e9c71341ea0d/logo_home.png)`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      ></div>

      {/* Overlay semitransparente */}
      <div className="absolute inset-0 z-10 bg-white bg-opacity-80 dark:bg-gray-900 dark:bg-opacity-70"></div>

      {/* Conteúdo principal (Navbar, Banner, Sections, Footer) */}
      <div className="relative z-20 min-h-screen flex flex-col">
        <Navbar />

        <main className="container mx-auto px-4 py-8 md:py-12 flex-grow">
          <section className="mb-16">
            <Banner />
          </section>

          <motion.section
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <StatsCard number="10K+" label="Clientes Satisfeitos" icon={Star} />
              <StatsCard number="500+" label="Produtos Premium" icon={ShoppingBag} />
              <StatsCard number="98%" label="Avaliações 5★" icon={Trophy} />
              <StatsCard number="24h" label="Envio Expresso" icon={TrendingUp} />
            </div>
          </motion.section>

          <section className="mb-20">
            <SectionTitle
              icon={Sparkles}
              title="Descubra Nossas Coleções Exclusivas"
              subtitle="Explore categorias cuidadosamente selecionadas com produtos importados de alta qualidade, pensados especialmente para seu estilo e necessidades únicas."
              gradient="from-green-500 to-green-700"
            />

            {loading.categories ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 dark:bg-gray-700 rounded-3xl animate-pulse h-72"
                  />
                ))}
              </div>
            ) : (
              <div className="relative px-4 md:px-8 lg:px-12 overflow-hidden">
                <Slider {...categorySliderSettings}>
                  {homeFeaturedCategories.map(category => (
                    <div key={category.id} className="p-2">
                      <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                        className="transform transition-all duration-300"
                      >
                        <CategoryCard category={category} />
                      </motion.div>
                    </div>
                  ))}
                </Slider>
              </div>
            )}
          </section>

          <section className="mb-20">
            <SectionTitle
              icon={TrendingUp}
              title="Novidades Quentíssimas Chegando!"
              subtitle="Fique por dentro dos lançamentos mais recentes e dos produtos que acabaram de chegar em nosso estoque. Seja o primeiro a garantir as últimas tendências!"
              gradient="from-blue-500 to-purple-500"
            />

            {loading.novelties ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 dark:bg-gray-700 rounded-3xl animate-pulse h-96"
                  />
                ))}
              </div>
            ) : (
              <motion.div
                className="relative px-4 md:px-8 lg:px-12 overflow-hidden"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Slider {...productSliderSettings}>
                  {homeNoveltiesProducts.map((product, index) => (
                    <div key={product.id} className="p-2">
                      <motion.div
                        variants={itemVariants}
                        whileHover={{
                          y: -8,
                          boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
                          transition: { duration: 0.3 }
                        }}
                        className="relative group rounded-3xl overflow-hidden"
                      >
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                        <div className="relative">
                          <ProductCard product={product} onShowToast={handleShowToast} />
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </Slider>
              </motion.div>
            )}
          </section>


          <section className="mb-20">
            <SectionTitle
              icon={Flame}
              title="Ofertas Irresistíveis por Tempo Limitado"
              subtitle="Aproveite descontos exclusivos em produtos premium selecionados. Oportunidades únicas para adquirir itens de luxo com preços especiais."
              gradient="from-red-500 to-orange-500"
            />

            {loading.onSale ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 dark:bg-gray-700 rounded-3xl animate-pulse h-96"
                  />
                ))}
              </div>
            ) : (
              <motion.div
                className="relative px-4 md:px-8 lg:px-12 overflow-hidden"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Slider {...productSliderSettings}>
                  {homeOnSaleProducts.map((product, index) => (
                    <div key={product.id} className="p-2">
                      <motion.div
                        variants={itemVariants}
                        whileHover={{
                          y: -8,
                          boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
                          transition: { duration: 0.3 }
                        }}
                        className="relative group rounded-3xl overflow-hidden"
                      >
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                        <div className="relative">
                          <ProductCard product={product} onShowToast={handleShowToast} />
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </Slider>
              </motion.div>
            )}
          </section>

          <section className="mb-20">
            <SectionTitle
              icon={Trophy}
              title="Campeões de Vendas & Favorito dos Clientes"
              subtitle="Os produtos mais amados pelos nossos clientes. Qualidade comprovada, satisfação garantida e avaliações excepcionais em cada item."
              gradient="from-yellow-500 to-amber-500"
            />

            {loading.bestSeller ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 dark:bg-gray-700 rounded-3xl animate-pulse h-96"
                  />
                ))}
              </div>
            ) : (
              <motion.div
                className="relative px-4 md:px-8 lg:px-12 overflow-hidden"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Slider {...productSliderSettings}>
                  {homeBestSellerProducts.map((product, index) => (
                    <div key={product.id} className="p-2">
                      <motion.div
                        variants={itemVariants}
                        whileHover={{
                          y: -8,
                          boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
                          transition: { duration: 0.3 }
                        }}
                        className="relative group rounded-3xl overflow-hidden"
                      >
                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-3xl blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                        <div className="relative">
                          <ProductCard product={product} onShowToast={handleShowToast} />
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </Slider>
              </motion.div>
            )}
          </section>

          <motion.section
            className="mb-16"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <VideoBanner
              videoSrc="/img/video_banner.mp4"
              title="Não Perca Nenhuma Novidade!"
              subtitle="Seja o primeiro a descobrir lançamentos exclusivos e ofertas especiais diretamente na sua caixa de entrada."
              callToAction="Cadastre-se Agora"
              onCallToActionClick={() => {
                handleShowToast('Você clicou em "Cadastre-se Agora" na newsletter!', 'info');
              }}
              containerClasses="h-auto py-12 md:py-16"
            />
          </motion.section>
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

      <WhatsAppButton />
    </div>
  );
};