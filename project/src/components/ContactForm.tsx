import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext'; // Ajuste o caminho se necessário

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export const ContactForm: React.FC = () => {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const { isDarkMode } = useTheme();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulação de chamada à API
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulação de sucesso ou erro
    if (formData.email.includes('error')) {
      setStatus('error');
    } else {
      setStatus('success');
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center bg-green-50 dark:bg-green-500/10 p-8 rounded-lg"
      >
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h3 className="mt-4 text-xl font-semibold text-neutral-900 dark:text-white">
          Mensagem Enviada!
        </h3>
        <p className="mt-2 text-neutral-600 dark:text-neutral-300">
          Obrigado por entrar em contato. Responderemos em breve!
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
          >
            Nome
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="block w-full rounded-md border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="Seu nome completo"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="block w-full rounded-md border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="seu.email@exemplo.com"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
        >
          Assunto
        </label>
        <select
          id="subject"
          name="subject"
          required
          value={formData.subject}
          onChange={handleChange}
          className="block w-full rounded-md border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="" disabled>
            Selecione um motivo...
          </option>
          <option value="duvidas">Dúvidas sobre um Produto</option>
          <option value="pedido">Problema com um Pedido</option>
          <option value="parcerias">Parcerias e Collabs</option>
          <option value="outro">Outro Assunto</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
        >
          Mensagem
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          value={formData.message}
          onChange={handleChange}
          className="block w-full rounded-md border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          placeholder="Digite sua mensagem aqui..."
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full flex justify-center items-center gap-2 rounded-md border border-transparent bg-primary-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-primary-300 dark:disabled:bg-primary-800 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Enviar Mensagem
            </>
          )}
        </button>
      </div>
      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-5 w-5" />
          <p>Ocorreu um erro. Tente novamente.</p>
        </div>
      )}
    </form>
  );
};