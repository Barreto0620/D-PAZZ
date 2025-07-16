// src/pages/ContactPage.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { Navbar } from '../components/Navbar'; // ✅ Mantido: Seu Navbar
// ✅ REMOVIDO: A importação do Footer que causou o erro.
import { ContactForm } from '../components/ContactForm';
import { useTheme } from '../contexts/ThemeContext';
import { Helmet } from 'react-helmet-async'; // Importando Helmet para SEO

// Componente para um item de informação de contato (sem alterações)
const ContactInfoItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0">{icon}</div>
    <div className="ml-4">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 text-neutral-600 dark:text-neutral-300">{children}</p>
    </div>
  </div>
);

// Componente para o FAQ (sem alterações)
const FaqItem: React.FC<{ question: string; children: React.ReactNode }> = ({
  question,
  children,
}) => (
  <details className="group rounded-lg bg-neutral-50 dark:bg-neutral-800/50 p-6 [&_summary::-webkit-details-marker]:hidden">
    <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-neutral-900 dark:text-white">
      <h2 className="text-lg font-medium">{question}</h2>
      <span className="relative h-5 w-5 shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 h-5 w-5 opacity-100 group-open:opacity-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9" /></svg>
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 h-5 w-5 opacity-0 group-open:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9" /></svg>
      </span>
    </summary>
    <p className="mt-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
      {children}
    </p>
  </details>
);


export const ContactPage: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="bg-white dark:bg-neutral-900">
      <Navbar />
      <main>
        <Helmet>
          <title>Contato - D'Pazz Imports</title>
          <meta
            name="description"
            content="Entre em contato com a D'Pazz Imports. Estamos aqui para ajudar com suas dúvidas sobre produtos, pedidos e parcerias."
          />
        </Helmet>
        
        <div className="relative bg-neutral-800 pt-32 pb-24 sm:pt-40 sm:pb-32">
          <img
            src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop"
            alt="Coleção de Tênis"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-20"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Conecte-se com a gente
            </h1>
            <p className="mt-6 text-lg leading-8 text-neutral-300 max-w-2xl mx-auto">
              Tem alguma dúvida, sugestão ou proposta? Nossa equipe está pronta
              para te ajudar.
            </p>
          </motion.div>
        </div>
        
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">
                  Nossos Canais
                </h2>
                <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">
                  Prefere falar diretamente? Use um dos canais abaixo.
                </p>
                <div className="mt-10 space-y-8">
                  <ContactInfoItem icon={<Phone className="h-6 w-6 text-neutral-900 dark:text-white" />} title="Telefone">
                    <a href="tel:+5511999999999" className="hover:text-primary-600 dark:hover:text-primary-400">+55 (11) 99999-9999</a><br />
                    Seg a Sex, das 9h às 18h.
                  </ContactInfoItem>
                  <ContactInfoItem icon={<Mail className="h-6 w-6 text-neutral-900 dark:text-white" />} title="Email">
                    <a href="mailto:contato@dpazzimports.com" className="hover:text-primary-600 dark:hover:text-primary-400">contato@dpazzimports.com</a><br />
                    Respondemos em até 24 horas.
                  </ContactInfoItem>
                  <ContactInfoItem icon={<MapPin className="h-6 w-6 text-neutral-900 dark:text-white" />} title="Endereço">
                    Av. Paulista, 1234 - São Paulo, SP<br />
                    Visitas com hora marcada.
                  </ContactInfoItem>
                </div>
                <div className="mt-10 pt-8 border-t border-neutral-200 dark:border-neutral-700">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Siga-nos</h3>
                    <div className="mt-4 flex space-x-6">
                        <a href="#" className="text-neutral-500 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400"><Instagram /></a>
                        <a href="#" className="text-neutral-500 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400"><Facebook /></a>
                        <a href="#" className="text-neutral-500 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400"><Twitter /></a>
                    </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-neutral-50 dark:bg-neutral-800/50 p-8 rounded-lg"
              >
                 <ContactForm />
              </motion.div>
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-800/50">
            <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-neutral-900 dark:text-white">
                    Perguntas Frequentes
                </h2>
                <div className="mt-12 space-y-4 max-w-3xl mx-auto">
                    <FaqItem question="Os tênis são originais?">Sim, todos os nossos produtos são 100% originais, importados diretamente dos fabricantes e distribuidores autorizados. Garantimos a autenticidade de cada par.</FaqItem>
                    <FaqItem question="Qual o prazo de entrega?">O prazo de entrega varia de acordo com sua localização, mas geralmente fica entre 7 e 15 dias úteis. Você receberá um código de rastreio para acompanhar seu pedido.</FaqItem>
                    <FaqItem question="Posso parcelar minha compra?">Sim! Aceitamos parcelamento em até 12x no cartão de crédito, com as melhores taxas do mercado.</FaqItem>
                    <FaqItem question="Como funciona a política de troca e devolução?">Você tem até 7 dias após o recebimento para solicitar a troca ou devolução do produto, desde que ele não tenha sido usado e esteja na embalagem original. Entre em contato conosco para iniciar o processo.</FaqItem>
                </div>
            </div>
        </div>
      </main>
      
    </div>
  );
};