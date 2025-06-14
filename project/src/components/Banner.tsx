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
      // URL pública para a imagem do banner principal
      image: 'https://github.com/Barreto0620/img_public/blob/df8cd11d8e5ae8799e94ee5e9d7984f61e4a3288/banner_principal_1.png?raw=true',
      title: '', // Título adicionado
      subtitle: '', // Subtítulo adicionado
      cta: 'Ver Novidades',
      link: '/categoria/1'
    },
    {
      id: 2,
      // Usando o mesmo URL público para o segundo banner, pois o caminho local estava incorreto
      image: 'https://github.com/Barreto0620/img_public/blob/dc15784c281a15e8d9dc4e15e97ab07277e5fac5/banner_principal_2.png?raw=true',
      title: 'Acessórios Exclusivos',
      subtitle: 'Realce seu estilo com nossa coleção importada premium',
      cta: 'Ver Coleção',
      link: '/categoria/3'
    },
    {
      id: 3,
      // URL pública para a imagem do banner de tênis
      image: 'https://github.com/Barreto0620/img_public/blob/8faed451802dbf0b7b8808ce3287c228708c7e9f/banner_principal_3.png?raw=true',
      title: 'Desempenho nos Seus Pés', // Novo título
      subtitle: 'Encontre o tênis perfeito para cada passo da sua jornada.', // Nova frase
      cta: 'Compre Agora', // Novo CTA
      link: '/categoria/tenis' // Link mais específico para categoria de tênis
    }
  ];

  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Autoplay
  useEffect(() => {
    let interval: number;

    if (autoplay) {
      interval = window.setInterval(() => {
        setCurrent(prev => (prev + 1) % slides.length);
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [autoplay, slides.length]);

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  const prev = () => {
    setCurrent(current => (current === 0 ? slides.length - 1 : current - 1));
  };

  const next = () => {
    setCurrent(current => (current === slides.length - 1 ? 0 : current + 1));
  };

  return (
    <div
      className="relative h-[300px] md:h-[450px] overflow-hidden rounded-2xl shadow-lg"
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
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[current].image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
          </div>

          <div className="relative h-full flex flex-col justify-center pl-8 md:pl-16 max-w-lg text-white">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-5xl font-bold mb-2"
            >
              {slides[current].title}
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg mb-6"
            >
              {slides[current].subtitle}
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to={slides[current].link}
                className="bg-primary hover:bg-secondary text-dark px-6 py-3 rounded-lg font-medium inline-block transition-colors"
              >
                {slides[current].cta}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
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

      {/* Indicators */}
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