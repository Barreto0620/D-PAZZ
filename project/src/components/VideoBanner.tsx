// components/VideoBanner.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface VideoBannerProps {
  /**
   * O caminho para o arquivo de vídeo. Certifique-se de que ele esteja na pasta `public`.
   * Ex: "/img/video_banner.mp4"
   */
  videoSrc: string;
  /**
   * O título principal do banner.
   */
  title: string;
  /**
   * O subtítulo ou descrição do banner.
   */
  subtitle: string;
  /**
   * O texto para o botão de chamada para ação (opcional).
   */
  callToAction?: string;
  /**
   * Função a ser executada quando o botão de chamada para ação é clicado (opcional).
   */
  onCallToActionClick?: () => void;
  /**
   * Classes adicionais para o contêiner principal do banner,
   * útil para controlar a altura e padding em diferentes contextos.
   * Ex: "h-48" ou "py-12"
   */
  containerClasses?: string;
}

export const VideoBanner: React.FC<VideoBannerProps> = ({
  videoSrc,
  title,
  subtitle,
  callToAction,
  onCallToActionClick,
  containerClasses = "h-80 md:h-96 lg:h-[450px] p-4 md:p-8", // Altura padrão para o banner principal (neste componente)
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
  };

  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { delay: 0.3, duration: 0.6 } },
  };

  const buttonVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { delay: 0.6, duration: 0.6 } },
  };

  return (
    <motion.div
      className={`relative w-full overflow-hidden rounded-3xl shadow-2xl flex items-center justify-center text-white ${containerClasses}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <video
        autoPlay
        loop
        muted
        playsInline // Importante para reprodução em dispositivos móveis
        className="absolute inset-0 w-full h-full object-cover z-10" 
      >
        <source src={videoSrc} type="video/mp4" />
        Seu navegador não suporta vídeos em HTML5.
      </video>

      {/* Overlay para melhorar a legibilidade do texto sobre o vídeo */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-20"></div>

      <div className="relative z-30 p-4 md:p-8 text-center max-w-4xl mx-auto">
        <motion.h3
          className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight drop-shadow-lg"
          variants={textVariants}
        >
          {title}
        </motion.h3>
        <motion.p
          className="text-md md:text-xl mb-8 opacity-90 max-w-2xl mx-auto drop-shadow-md"
          variants={textVariants}
        >
          {subtitle}
        </motion.p>
        {callToAction && (
          <motion.button
            // CLASSES DO BOTÃO AJUSTADAS PARA MAIOR ESTABILIDADE E COMPATIBILIDADE
            className="bg-gradient-to-r from-primary to-accent text-white px-10 py-5 rounded-full font-bold text-lg md:text-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95"
            onClick={onCallToActionClick}
            variants={buttonVariants}
            whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0,0,0,0.4)" }} // Sombra mais intensa no hover
            whileTap={{ scale: 0.95 }}
          >
            {callToAction}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};