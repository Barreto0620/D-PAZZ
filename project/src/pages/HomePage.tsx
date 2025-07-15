// pages/index.tsx
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
import { Sparkles, TrendingUp, Star, ShoppingBag, Flame, Trophy } from 'lucide-react';
import Slider from 'react-slick';
import { Toast } from '../components/Toast';
import { VideoBanner } from '../components/VideoBanner';
import { WhatsAppButton } from '../components/WhatsAppButton';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const HomePage: React.FC = () => {
  const [featuredCategories, setFeaturedCategories] = useState<Category[]>([]);
  const [onSaleProducts, setOnSaleProducts] = useState<Product[]>([]);
  const [bestSellerProducts, setBestSellerProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState({
    categories: true,
    onSale: true,
    bestSeller: true
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
    const fetchData = async () => {
      try {
        const categories = await getFeaturedCategories();
        setFeaturedCategories(categories);
        setLoading(prev => ({ ...prev, categories: false }));
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        setLoading(prev => ({ ...prev, categories: false }));
        handleShowToast('Erro ao carregar categorias.', 'error');
      }

      try {
        const onSale = await getOnSaleProducts();
        setOnSaleProducts(onSale);
        setLoading(prev => ({ ...prev, onSale: false }));
      } catch (error) {
        console.error('Erro ao buscar produtos em promoção:', error);
        setLoading(prev => ({ ...prev, onSale: false }));
        handleShowToast('Erro ao carregar ofertas.', 'error');
      }

      try {
        const bestSeller = await getBestSellerProducts();
        setBestSellerProducts(bestSeller);
        setLoading(prev => ({ ...prev, bestSeller: false }));
      } catch (error) {
        console.error('Erro ao buscar produtos mais vendidos:', error);
        setLoading(prev => ({ ...prev, bestSeller: false }));
        handleShowToast('Erro ao carregar mais vendidos.', 'error');
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
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1, centerPadding: "20%" } },
      { breakpoint: 480, settings: { slidesToShow: 1, centerPadding: "15%" } },
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
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ]
  };

  return (
    <div className="min-h-screen relative font-sans">
      <Helmet>
        <title>D'Pazz Imports - Tênis Premium | Qualidade Internacional</title>
        <meta name="description" content="Descubra a excelência em produtos importados..." />
        <link rel="icon" type="image/x-icon" href="img/favicon.ico" />
      </Helmet>

      <div className="absolute inset-0 z-0 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(https://raw.githubusercontent.com/Barreto0620/img_public/04cb063dcdc701738d51396c8226e9c71341ea0d/logo_home.png)` }}></div>
      <div className="absolute inset-0 z-10 bg-white bg-opacity-80 dark:bg-gray-900 dark:bg-opacity-70"></div>

      <div className="relative z-20 min-h-screen flex flex-col">
        <Navbar />

        <main className="container mx-auto px-4 py-8 md:py-12 flex-grow">
          <section className="mb-16">
            <Banner />
          </section>

          <motion.section className="mb-20" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <StatsCard number="10K+" label="Clientes Satisfeitos" icon={Star} />
              <StatsCard number="500+" label="Produtos Premium" icon={ShoppingBag} />
              <StatsCard number="98%" label="Avaliações 5★" icon={Trophy} />
              <StatsCard number="24h" label="Envio Expresso" icon={TrendingUp} />
            </div>
          </motion.section>

          {/* As demais seções seguem aqui normalmente... */}


          <VideoBanner
            videoSrc="/img/video_banner.mp4"
            title="Não Perca Nenhuma Novidade!"
            subtitle="Seja o primeiro a descobrir lançamentos exclusivos e ofertas especiais."
            callToAction="Cadastre-se Agora"
            onCallToActionClick={() => handleShowToast('Você clicou em "Cadastre-se Agora"!', 'info')}
            containerClasses="h-auto py-12 md:py-16"
          />
        </main>

        <WhatsAppButton />
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
