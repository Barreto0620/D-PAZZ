// src/pages/NoveltiesPage.tsx (VERSÃO OTIMIZADA E SEM "PISCA-PISCA")

import React, { useState, useMemo } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { Product } from '../types';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SectionTitle } from '../components/SectionTitle';
import { ProductCard } from '../components/ProductCard';
import { motion } from 'framer-motion';
import { Sparkles, ChevronDown } from 'lucide-react';

export const NoveltiesPage: React.FC = () => {
    // MODIFICAÇÃO: Renomeado para 'contextLoading' para clareza
    const { products, loading: contextLoading } = useProducts();
    const [sortBy, setSortBy] = useState('newest'); // Definindo 'newest' como padrão para novidades

    // MODIFICAÇÃO: Lógica de filtragem e ordenação movida para um único useMemo.
    // Isso remove a necessidade de useEffect e useState para os produtos, eliminando o "flash".
    const sortedProducts = useMemo(() => {
        // Primeiro, filtramos para encontrar as novidades
        const noveltyProducts = products.filter(product =>
            // Lógica para identificar novidades (ajuste conforme seu banco de dados)
            // Vou usar uma lógica baseada na data de criação (criado_em)
            (product as any).criado_em && new Date((product as any).criado_em) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        );

        // Depois, ordenamos o resultado
        const sorted = [...noveltyProducts];
        switch (sortBy) {
            case 'price-asc':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'newest':
            default:
                // Ordena do mais novo para o mais antigo
                sorted.sort((a, b) => new Date((b as any).criado_em || 0).getTime() - new Date((a as any).criado_em || 0).getTime());
                break;
        }
        return sorted;
    }, [products, sortBy]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    // A página inteira mostra um spinner apenas durante o carregamento inicial do app
    if (contextLoading) {
        return (
            <div className="min-h-screen bg-light dark:bg-dark">
                <Navbar />
                <div className="container mx-auto px-4 py-6 text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
                </div>
                <Footer />
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-light dark:bg-dark">
            <Helmet>
                <title>Novidades | D'Pazz Imports</title>
                <meta name="description" content="Descubra as últimas novidades da D'Pazz Imports." />
            </Helmet>

            <Navbar />

            <main className="container mx-auto px-4 py-8 md:py-12 flex-grow">
                <SectionTitle
                    icon={Sparkles}
                    title="Novidades Exclusivas"
                    subtitle="Os lançamentos mais recentes e as novas tendências."
                    gradient="from-purple-500 to-pink-600"
                />

                <div className="flex justify-between items-center mb-6 text-gray-600 dark:text-gray-400">
                    <p>{sortedProducts.length} novidades encontradas</p>
                    
                    <div className="relative group">
                        <button className="flex items-center px-4 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors">
                            <span>Ordenar por</span> <ChevronDown size={18} className="ml-2" />
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden z-10 hidden group-hover:block">
                            <button onClick={() => setSortBy('newest')} className={`block w-full text-left px-4 py-2 text-sm ${sortBy === 'newest' ? 'bg-secondary-50 dark:bg-secondary-500/10 font-medium' : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}>Mais Recente</button>
                            <button onClick={() => setSortBy('price-asc')} className={`block w-full text-left px-4 py-2 text-sm ${sortBy === 'price-asc' ? 'bg-secondary-50 dark:bg-secondary-500/10 font-medium' : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}>Menor Preço</button>
                            <button onClick={() => setSortBy('price-desc')} className={`block w-full text-left px-4 py-2 text-sm ${sortBy === 'price-desc' ? 'bg-secondary-50 dark:bg-secondary-500/10 font-medium' : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}>Maior Preço</button>
                            <button onClick={() => setSortBy('rating')} className={`block w-full text-left px-4 py-2 text-sm ${sortBy === 'rating' ? 'bg-secondary-50 dark:bg-secondary-500/10 font-medium' : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}>Melhor Avaliado</button>
                        </div>
                    </div>
                </div>

                {sortedProducts.length === 0 ? (
                    <div className="text-center py-10 text-gray-700 dark:text-gray-300">
                        <div className="flex flex-col items-center space-y-4">
                            <Sparkles size={48} className="text-gray-400" />
                            <p className="text-lg">Nenhuma novidade encontrada no momento.</p>
                            <p className="text-sm text-gray-500">Volte em breve para conferir os próximos lançamentos!</p>
                        </div>
                    </div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {sortedProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                                className="transform transition-all duration-300"
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </main>
            <Footer />
        </div>
    );
};