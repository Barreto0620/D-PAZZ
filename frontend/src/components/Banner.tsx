import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface BannerSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
}

export const Banner: React.FC = () => {
  const slides: BannerSlide[] = [
    {
      id: 1,
      image: 'https://github.com/Barreto0620/img_public/blob/c65bb9a1702f1181919dc768e0ed66a06e434562/banner_principal_2.png?raw=true',
      title: 'Coleção Exclusiva 2025',
      subtitle: 'Descubra o novo nível de conforto e estilo.',
      cta: 'Ver Novidades',
      link: '/categoria/1'
    },
    {
      id: 2,
      image: 'https://github.com/Barreto0620/img_public/blob/df8cd11d8e5ae8799e94ee5e9d7984f61e4a3288/banner_principal_1.png?raw=true',
      title: 'Lançamentos Imperdíveis',
      subtitle: 'Modelos inéditos com tecnologia avançada.',
      cta: 'Comprar Agora',
      link: '/categoria/3'
    },
    {
      id: 3,
      image: 'https://github.com/Barreto0620/img_public/blob/d5a338470adf4d0cfa80310499d7a935c215ab98/banner_principal_3.png?raw=true',
      title: 'Coleção Mizuno Prophecy',
      subtitle: 'Tecnologia e Estilo',
      cta: 'Ver Coleção',
      link: '/categoria/tenis'
    }
  ];

  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    let interval: number;
    if (autoplay) {
      interval = window.setInterval(() => {
        setCurrent(prev => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoplay, slides.length]);

  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);
  const prev = () => setCurrent(current => (current === 0 ? slides.length - 1 : current - 1));
  const next = () => setCurrent(current => (current === slides.length - 1 ? 0 : current + 1));

  return (
    <div
      className="relative h-[240px] md:h-[550px] lg:h-[580px] overflow-hidden rounded-2xl shadow-lg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full"
        >
          <div
            className="absolute inset-0 bg-cover bg-no-repeat"
            style={{ 
              backgroundImage: `url(${slides[current].image})`,
              backgroundPosition: 'center 30%'  
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
          </div>

          <div className="relative h-full flex flex-col justify-center pl-8 md:pl-16 max-w-xl text-white">
            <motion.h2
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg"
            >
              {slides[current].title}
            </motion.h2>
            <motion.p
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-lg mb-6 drop-shadow-lg"
            >
              {slides[current].subtitle}
            </motion.p>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="absolute bottom-10 right-10"
          >
            <Link
              to={slides[current].link}
              className="bg-primary hover:bg-secondary text-dark px-8 py-4 rounded-lg font-semibold text-lg inline-block transition-transform shadow-xl hover:scale-105"
            >
              {slides[current].cta}
            </Link>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
        aria-label="Slide anterior"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
        aria-label="Próximo slide"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === current ? 'bg-primary w-6' : 'bg-white/50'
            }`}
            aria-label={`Ir para slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
