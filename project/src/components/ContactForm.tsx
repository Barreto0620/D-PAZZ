import React, { useState } from 'react';
import { motion } from 'framer-motion';
// ✅ ADICIONADO: Ícone de Telefone
import { Send, Loader, CheckCircle, AlertTriangle, User, Mail as MailIcon, MessageSquare, ChevronDown, Phone } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export const ContactForm: React.FC = () => {
    const [status, setStatus] = useState<FormStatus>('idle');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '', // ✅ ADICIONADO: Campo de telefone no estado
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
        // A lógica de envio permanece a mesma, mas em um caso real, você enviaria `formData.phone` também.
        await new Promise((resolve) => setTimeout(resolve, 1500));
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
                className="bg-green-100 dark:bg-green-900/50 border border-green-200 dark:border-green-800 p-6 rounded-lg shadow-md"
            >
                <div className="flex justify-center items-center">
                    <CheckCircle className="h-10 w-10 text-green-500 dark:text-green-400 mr-4" />
                    <div>
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                            Mensagem Enviada!
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-300">
                            Obrigado por entrar em contato. Responderemos em breve.
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    }
    
    const inputBaseStyles = "w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-400/50 transition-all duration-200";
    const inputThemeStyles = `border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm`;
    
    return (
        <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-5"
        >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Nome Completo</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className={`${inputBaseStyles} ${inputThemeStyles} pl-10 py-2.5`} placeholder="Seu nome" />
                    </div>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Email</label>
                    <div className="relative">
                        <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className={`${inputBaseStyles} ${inputThemeStyles} pl-10 py-2.5`} placeholder="seu@email.com" />
                    </div>
                </div>
            </div>

            {/* ✅ ADICIONADO: Novo campo de Telefone */}
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Telefone</label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <input type="tel" name="phone" id="phone" required value={formData.phone} onChange={handleChange} className={`${inputBaseStyles} ${inputThemeStyles} pl-10 py-2.5`} placeholder="(XX) XXXXX-XXXX" />
                </div>
            </div>

            <div>
                <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Assunto</label>
                <div className="relative">
                    <select id="subject" name="subject" required value={formData.subject} onChange={handleChange} className={`${inputBaseStyles} ${inputThemeStyles} appearance-none px-4 py-2.5 pr-8`}>
                        <option value="" disabled>Selecione um motivo...</option>
                        <option value="duvidas">Dúvidas sobre um Produto</option>
                        <option value="pedido">Problema com um Pedido</option>
                        <option value="parcerias">Parcerias e Collabs</option>
                        <option value="outro">Outro Assunto</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500 dark:text-neutral-400 pointer-events-none" />
                </div>
            </div>
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Mensagem</label>
                <div className="relative">
                    <MessageSquare className="absolute left-3 top-3.5 h-5 w-5 text-neutral-400" />
                    <textarea id="message" name="message" rows={5} required value={formData.message} onChange={handleChange} className={`${inputBaseStyles} ${inputThemeStyles} pl-10 py-2.5 resize-none`} placeholder="Sua mensagem aqui..."></textarea>
                </div>
            </div>
            <div>
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className={`w-full flex justify-center items-center gap-3 rounded-lg py-3 px-4 text-base font-bold shadow-sm 
                                transition-all duration-200 ease-in-out
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-800
                                active:scale-95
                                disabled:opacity-50 disabled:cursor-wait
                                ${ status !== 'loading' 
                                    ? 'bg-neutral-900 text-white hover:bg-neutral-700 focus-visible:ring-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 dark:focus-visible:ring-neutral-100' 
                                    : 'bg-neutral-400 dark:bg-neutral-700 text-neutral-100 dark:text-neutral-400'
                                }`}
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
                <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-3">
                    <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400" />
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                                Ocorreu um erro ao enviar.
                            </h3>
                            <p className="mt-1 text-sm text-red-700 dark:text-red-400/80">Por favor, tente novamente mais tarde.</p>
                        </div>
                    </div>
                </div>
            )}
        </motion.form>
    );
};