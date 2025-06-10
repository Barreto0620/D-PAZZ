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
import Slider from 'react-slick'; // Importando o Slider

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
        console.error('Erro ao buscar categorias:', error);
        setLoading(prev => ({ ...prev, categories: false }));
      }

      try {
        const onSale = await getOnSaleProducts();
        setOnSaleProducts(onSale);
        setLoading(prev => ({ ...prev, onSale: false }));
      } catch (error) {
        console.error('Erro ao buscar produtos em promoção:', error);
        setLoading(prev => ({ ...prev, onSale: false }));
      }

      try {
        const bestSeller = await getBestSellerProducts();
        setBestSellerProducts(bestSeller);
        setLoading(prev => ({ ...prev, bestSeller: false }));
      } catch (error) {
        console.error('Erro ao buscar produtos mais vendidos:', error);
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

  // Configurações para o carrossel de categorias
  const categorySliderSettings = {
    dots: true, // Bolinhas de navegação
    infinite: true, // Loop infinito
    speed: 500, // Velocidade da transição (ms)
    slidesToShow: 4, // Quantos slides mostrar por vez
    slidesToScroll: 1, // Quantos slides rolar por vez
    autoplay: true, // Ativar auto-play
    autoplaySpeed: 3000, // Intervalo de 3 segundos entre os slides
    cssEase: "linear", // Tipo de easing para a animação
    arrows: false, // <<<< REMOVIDO os botões de navegação
    pauseOnHover: true, // <<<< PAUSA o autoplay no hover
    className: "center", // Adiciona uma classe para estilização, se necessário
    centerMode: true, // Centraliza o slide atual, se houver slides vazios nas bordas
    centerPadding: "60px", // Espaçamento para o centro, útil com centerMode
    responsive: [ // Responsividade para diferentes tamanhos de tela
      {
        breakpoint: 1200, // Para telas menores que 1200px (desktop médio)
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
          centerPadding: "40px",
        }
      },
      {
        breakpoint: 1024, // Para telas menores que 1024px (tablet paisagem)
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
          centerPadding: "30px",
        }
      },
      {
        breakpoint: 768, // Para telas menores que 768px (tablet retrato)
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 0,
          centerPadding: "20%", // Para mobile, centraliza um item maior
        }
      },
      {
        breakpoint: 480, // Para telas menores que 480px (celular)
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "15%", // Para mobile, centraliza um item maior
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 font-sans"> {/* Ajuste sutil no background e fonte */}
      <Helmet>
        <title>D'Pazz Imports - Tênis Premium | Qualidade Internacional</title>
        <meta name="description" content="Descubra a excelência em produtos importados. Tênis esportivos de alta performance e perfumes sofisticados das melhores marcas mundiais. Qualidade premium, entrega rápida." />
        <link rel="icon" type="image/x-icon" href="img/favicon.ico" />
      </Helmet>

      <Navbar />

      <main className="container mx-auto px-4 py-8 md:py-12"> {/* Ajuste no padding geral */}
        {/* Hero Banner */}
        <section className="mb-16">
          <Banner />
        </section>

        {/* Stats Section */}
        <motion.section 
          className="mb-20" /* Aumentei a margem inferior para maior espaçamento */
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"> {/* Aumentei o gap */}
            <StatsCard number="10K+" label="Clientes Satisfeitos" icon={Star} />
            <StatsCard number="500+" label="Produtos Premium" icon={ShoppingBag} />
            <StatsCard number="98%" label="Avaliações 5★" icon={Trophy} />
            <StatsCard number="24h" label="Envio Expresso" icon={TrendingUp} />
          </div>
        </motion.section>

        {/* Featured Categories */}
        <section className="mb-20">
          <SectionTitle
            icon={Sparkles}
            title="Descubra Nossas Coleções Exclusivas"
            subtitle="Explore categorias cuidadosamente selecionadas com produtos importados de alta qualidade, pensados especialmente para seu estilo e necessidades únicas."
            gradient="from-indigo-600 to-purple-600" /* Novo gradiente */
          />

          {loading.categories ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-200 dark:bg-gray-700 rounded-3xl animate-pulse h-72" /* Cor e arredondamento ajustados */
                />
              ))}
            </div>
          ) : (
            <div className="relative px-4 md:px-8 lg:px-12 overflow-hidden"> {/* Reduzi o padding horizontal aqui */}
              <Slider {...categorySliderSettings}>
                {featuredCategories.map(category => (
                  <div key={category.id} className="p-2"> {/* Reduzi o padding aqui para os cards ficarem mais próximos */}
                    <motion.div 
                      variants={itemVariants}
                      whileHover={{ scale: 1.05, transition: { duration: 0.3 } }} // AUMENTO da escala no hover
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

        {/* On Sale Products */}
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
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {onSaleProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -8, // Um pouco menos de "subida"
                    boxShadow: "0 15px 30px rgba(0,0,0,0.15)", // Sombra mais pronunciada no hover
                    transition: { duration: 0.3 } 
                  }}
                  className="relative group rounded-3xl overflow-hidden" // Adicionado rounded-3xl e overflow-hidden
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div> {/* Ajustado blur e opacity */}
                  <div className="relative">
                    <ProductCard product={product} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* Best Seller Products */}
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
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {bestSellerProducts.map((product, index) => (
                <motion.div
                  key={product.id}
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
                    <ProductCard product={product} />
                  </div>
                  {index < 3 && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      #{index + 1} TOP
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* Call to Action Section */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-gradient-to-r from-primary via-accent to-primary p-12 rounded-3xl text-center text-white shadow-2xl">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-4xl font-extrabold mb-4 leading-tight"> {/* Aumentei tamanho e peso da fonte */}
                Não Perca Nenhuma Novidade!
              </h3>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto"> {/* Adicionei max-width */}
                Seja o primeiro a descobrir lançamentos exclusivos e ofertas especiais diretamente na sua caixa de entrada.
              </p>
              <motion.button
                className="bg-white text-primary px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-xl" /* Aumentei padding e sombra */
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }} /* Sombra no hover */
                whileTap={{ scale: 0.95 }}
              >
                Cadastre-se Agora
              </motion.button>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};