import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { Product } from '../types';
import { Helmet } from 'react-helmet';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SectionTitle } from '../components/SectionTitle';
import { ProductCard } from '../components/ProductCard';
import { Toast } from '../components/Toast';
import { motion } from 'framer-motion';
import { Sparkles, Flame, Star, ChevronDown } from 'lucide-react';

export const BrandPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { getProductsByBrand, loading } = useProducts();
    const [brandProducts, setBrandProducts] = useState<Product[]>([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

    // ✅ ESTADO PARA ORDENAÇÃO
    const [sortBy, setSortBy] = useState('relevance');

    const capitalize = useCallback((s: string | undefined) => {
        if (!s) return '';
        return s.charAt(0).toUpperCase() + s.slice(1);
    }, []);

    const handleShowToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    }, []);

    useEffect(() => {
        if (!loading && slug) {
            try {
                const products = getProductsByBrand(slug);
                setBrandProducts(products);

                if (products.length === 0) {
                    handleShowToast(`Nenhum produto encontrado para a marca "${capitalize(slug)}".`, 'info');
                }
            } catch (error) {
                console.error(`Erro ao carregar produtos da marca ${slug}:`, error);
                handleShowToast(`Erro ao carregar produtos da marca ${capitalize(slug)}.`, 'error');
            }
        }
    }, [loading, slug, getProductsByBrand, capitalize, handleShowToast]);

    // ✅ LÓGICA DE ORDENAÇÃO
    const sortedProducts = useMemo(() => {
        const sorted = [...brandProducts];
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
            case 'relevance':
            default:
                // Mantém a ordem original ou outra lógica de relevância
                break;
        }
        return sorted;
    }, [brandProducts, sortBy]);

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

    const getBrandDetails = (brandSlug: string) => {
        switch (brandSlug.toLowerCase()) {
            case 'nike':
                return { icon: Sparkles, gradient: 'from-blue-500 to-indigo-600' };
            case 'adidas':
                return { icon: Flame, gradient: 'from-orange-500 to-red-600' };
            case 'puma':
                return { icon: Star, gradient: 'from-purple-500 to-pink-600' };
            default:
                return { icon: Sparkles, gradient: 'from-gray-500 to-gray-600' };
        }
    };

    const brandDetails = getBrandDetails(slug || '');

    return (
        <div className="min-h-screen relative font-sans">
            <Helmet>
                <title>{capitalize(slug)} | D'Pazz Imports</title>
                <meta name="description" content={`Explore os produtos da ${capitalize(slug)} na D'Pazz Imports - Tênis premium, lançamentos e performance incomparável.`} />
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
                        icon={brandDetails.icon}
                        title={`Coleção ${capitalize(slug)} Premium`}
                        subtitle={`Performance, design e inovação em cada detalhe. Descubra os modelos ${capitalize(slug)} ideais para seu estilo de vida.`}
                        gradient={brandDetails.gradient}
                    />

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {[...Array(4)].map((_, index) => (
                                <div key={index} className="bg-gray-200 dark:bg-gray-700 rounded-3xl animate-pulse h-96" />
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-6 text-gray-600 dark:text-gray-400">
                                <p>
                                    {sortedProducts.length} produtos encontrados
                                </p>
                                
                                {/* ✅ DROPDOWN DE ORDENAÇÃO ✅ */}
                                <div className="relative group">
                                    <button className="flex items-center px-4 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors">
                                        <span>Ordenar por</span> <ChevronDown size={18} className="ml-2" />
                                    </button>
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden z-10 hidden group-hover:block">
                                        <button onClick={() => setSortBy('relevance')} className={`block w-full text-left px-4 py-2 text-sm ${sortBy === 'relevance' ? 'bg-secondary-50 dark:bg-secondary-500/10 text-secondary-600 dark:text-secondary-300 font-medium' : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}>Relevância</button>
                                        <button onClick={() => setSortBy('price-asc')} className={`block w-full text-left px-4 py-2 text-sm ${sortBy === 'price-asc' ? 'bg-secondary-50 dark:bg-secondary-500/10 text-secondary-600 dark:text-secondary-300 font-medium' : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}>Menor Preço</button>
                                        <button onClick={() => setSortBy('price-desc')} className={`block w-full text-left px-4 py-2 text-sm ${sortBy === 'price-desc' ? 'bg-secondary-50 dark:bg-secondary-500/10 text-secondary-600 dark:text-secondary-300 font-medium' : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}>Maior Preço</button>
                                        <button onClick={() => setSortBy('rating')} className={`block w-full text-left px-4 py-2 text-sm ${sortBy === 'rating' ? 'bg-secondary-50 dark:bg-secondary-500/10 text-secondary-600 dark:text-secondary-300 font-medium' : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}>Melhor Avaliado</button>
                                    </div>
                                </div>
                            </div>

                            {!sortedProducts.length && (
                                <div className="text-center py-10 text-gray-700 dark:text-gray-300">
                                    <p>Nenhum produto encontrado para a marca "{capitalize(slug)}".</p>
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
                                        {/* A prop onShowToast parece estar faltando no componente ProductCard, verifique se ela é necessária */}
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