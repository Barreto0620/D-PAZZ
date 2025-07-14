import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { Product } from '../types';
import { Helmet } from 'react-helmet';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SectionTitle } from '../components/SectionTitle';
import { ProductCard } from '../components/ProductCard';
import { Toast } from '../components/Toast';
import { motion } from 'framer-motion';
import { Sparkles, ChevronDown } from 'lucide-react';

export const NoveltiesPage: React.FC = () => {
    const { products, loading } = useProducts();
    const [noveltyProducts, setNoveltyProducts] = useState<Product[]>([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

    // ✅ ESTADO PARA ORDENAÇÃO
    const [sortBy, setSortBy] = useState('relevance');

    const handleShowToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    }, []);

    useEffect(() => {
        if (!loading && products) {
            try {
                // Filtra produtos que são novidades (você pode ajustar esta lógica conforme necessário)
                const novelties = products.filter(product => 
                    product.isNew || 
                    product.category === 'novelties' ||
                    // Ou qualquer outra lógica para identificar novidades
                    new Date(product.createdAt || 0) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Últimos 30 dias
                );
                
                setNoveltyProducts(novelties);

                if (novelties.length === 0) {
                    handleShowToast('Nenhuma novidade encontrada no momento.', 'info');
                }
            } catch (error) {
                console.error('Erro ao carregar novidades:', error);
                handleShowToast('Erro ao carregar novidades.', 'error');
            }
        }
    }, [loading, products, handleShowToast]);

    // ✅ LÓGICA DE ORDENAÇÃO
    const sortedProducts = useMemo(() => {
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
                sorted.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
                break;
            case 'relevance':
            default:
                // Mantém a ordem original ou outra lógica de relevância
                break;
        }
        return sorted;
    }, [noveltyProducts, sortBy]);

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

    return (
        <div className="min-h-screen relative font-sans">
            <Helmet>
                <title>Novidades | D'Pazz Imports</title>
                <meta name="description" content="Descubra as últimas novidades da D'Pazz Imports - Tênis premium, lançamentos exclusivos e as tendências mais recentes em calçados esportivos." />
                <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
            </Helmet>

            <div className="absolute inset-0 z-0" style={{
                backgroundImage: `url(https://raw.githubusercontent.com/Barreto0620/img_public/04cb063dcdc701738d51396c8226e9c71341ea0d/logo_home.png)`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}></div>
            <div className="absolute inset-0 z-10 bg-white bg-opacity-80 dark:bg-gray-900 dark:bg-opacity-70 backdrop-blur-sm"></div>

            <div className="relative z-20 min-h-screen flex flex-col">
                <Navbar />

                <main className="container mx-auto px-4 py-8 md:py-12 flex-grow">
                    <SectionTitle
                        icon={Sparkles}
                        title="Novidades Exclusivas"
                        subtitle="Descubra os lançamentos mais recentes e as tendências que estão definindo o futuro dos calçados esportivos."
                        gradient="from-purple-500 to-pink-600"
                    />

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {[...Array(8)].map((_, index) => (
                                <div key={index} className="bg-gray-200 dark:bg-gray-700 rounded-3xl animate-pulse h-96" />
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-6 text-gray-600 dark:text-gray-400">
                                <p>
                                    {sortedProducts.length} novidades encontradas
                                </p>
                                
                                {/* ✅ DROPDOWN DE ORDENAÇÃO ✅ */}
                                <div className="relative group">
                                    <button className="flex items-center px-4 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors">
                                        <span>Ordenar por</span> <ChevronDown size={18} className="ml-2" />
                                    </button>
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden z-10 hidden group-hover:block">
                                        <button onClick={() => setSortBy('relevance')} className={`block w-full text-left px-4 py-2 text-sm ${sortBy === 'relevance' ? 'bg-secondary-50 dark:bg-secondary-500/10 text-secondary-600 dark:text-secondary-300 font-medium' : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}>Relevância</button>
                                        <button onClick={() => setSortBy('newest')} className={`block w-full text-left px-4 py-2 text-sm ${sortBy === 'newest' ? 'bg-secondary-50 dark:bg-secondary-500/10 text-secondary-600 dark:text-secondary-300 font-medium' : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}>Mais Recente</button>
                                        <button onClick={() => setSortBy('price-asc')} className={`block w-full text-left px-4 py-2 text-sm ${sortBy === 'price-asc' ? 'bg-secondary-50 dark:bg-secondary-500/10 text-secondary-600 dark:text-secondary-300 font-medium' : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}>Menor Preço</button>
                                        <button onClick={() => setSortBy('price-desc')} className={`block w-full text-left px-4 py-2 text-sm ${sortBy === 'price-desc' ? 'bg-secondary-50 dark:bg-secondary-500/10 text-secondary-600 dark:text-secondary-300 font-medium' : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}>Maior Preço</button>
                                        <button onClick={() => setSortBy('rating')} className={`block w-full text-left px-4 py-2 text-sm ${sortBy === 'rating' ? 'bg-secondary-50 dark:bg-secondary-500/10 text-secondary-600 dark:text-secondary-300 font-medium' : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}>Melhor Avaliado</button>
                                    </div>
                                </div>
                            </div>

                            {!sortedProducts.length && (
                                <div className="text-center py-10 text-gray-700 dark:text-gray-300">
                                    <div className="flex flex-col items-center space-y-4">
                                        <Sparkles size={48} className="text-gray-400" />
                                        <p className="text-lg">Nenhuma novidade encontrada no momento.</p>
                                        <p className="text-sm text-gray-500">Volte em breve para conferir os próximos lançamentos!</p>
                                    </div>
                                </div>
                            )}

                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {/* ✅ RENDERIZA PRODUTOS ORDENADOS ✅ */}
                                {sortedProducts.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.05 }}
                                        className="transform transition-all duration-300"
                                    >
                                        <ProductCard product={product} index={index} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </>
                    )}
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
        </div>
    );
};