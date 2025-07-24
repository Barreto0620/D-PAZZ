// src/contexts/ProductContext.tsx (VERSÃO FINAL OTIMIZADA)

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { Product, Category } from '../types';
import { supabase } from '../lib/supabase';

interface ProductContextData {
  products: Product[];
  categories: Category[];
  loading: boolean;
  getProductById: (id: string) => Product | undefined; // CORRIGIDO: de number para string
  getProductsByBrand: (brand: string) => Product[];
  getProductsByCategory: (categoryId: string) => Product[]; // CORRIGIDO: de number para string
  getFeaturedProducts: () => Product[];
  getBestSellers: () => Product[];
  getOnSaleProducts: () => Product[];
  getAllBrands: () => string[];
  searchProducts: (query: string) => Product[];
  getNoveltiesProducts: () => Product[];
}

const ProductContext = createContext<ProductContextData | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Buscas em paralelo para mais performance
        const [categoriesResponse, productsResponse] = await Promise.all([
          supabase.from('categorias').select('*'),
          supabase.from('produtos').select('*, marcas(nome)') // Puxando o nome da marca junto
        ]);

        if (categoriesResponse.error) throw categoriesResponse.error;
        if (productsResponse.error) throw productsResponse.error;

        // Processa e formata as categorias
        const formattedCategories: Category[] = categoriesResponse.data.map((cat: any) => ({
          id: cat.id,
          name: cat.nome,
          description: cat.descricao || '',
          image: cat.url_imagem || '',
          featured: cat.em_destaque || false,
          slug: cat.slug || ''
        }));
        setCategories(formattedCategories);

        const categoryMap = new Map<string, string>();
        formattedCategories.forEach(cat => categoryMap.set(cat.id, cat.name));
        
        // Processa e formata os produtos
        const formattedProducts: Product[] = productsResponse.data.map((p: any) => ({
          id: p.id,
          name: p.nome,
          description: p.descricao || '',
          price: parseFloat(p.preco),
          oldPrice: p.preco_antigo ? parseFloat(p.preco_antigo) : undefined,
          category: p.categoria_id,
          categoryName: categoryMap.get(p.categoria_id) || 'Desconhecida',
          brand: (p.marcas as any)?.nome || 'Sem Marca',
          images: Array.isArray(p.imagens) ? p.imagens : [],
          featured: p.em_destaque || false,
          onSale: p.em_promocao || false,
          bestSeller: p.mais_vendido || false,
          stock: p.estoque || 0,
          rating: parseFloat(p.avaliacao) || 0,
          reviewCount: p.numero_avaliacoes || 0,
          color: p.cor || undefined,
          tamanhos: p.tamanhos || undefined,
          criado_em: p.criado_em,
        }));
        setProducts(formattedProducts);

      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []); // Este useEffect roda apenas uma vez, o que está correto.

  // OTIMIZAÇÃO: Todas as funções são "memorizadas" com useCallback.
  // Elas só serão recriadas se a lista de 'products' mudar.
  const getProductById = useCallback((id: string) => products.find(p => p.id === id), [products]);
  const getProductsByCategory = useCallback((categoryId: string) => products.filter(p => p.category === categoryId), [products]);
  const getProductsByBrand = useCallback((brand: string) => products.filter(p => p.brand === brand), [products]);
  const getFeaturedProducts = useCallback(() => products.filter(p => p.featured), [products]);
  const getBestSellers = useCallback(() => products.filter(p => p.bestSeller), [products]);
  const getOnSaleProducts = useCallback(() => products.filter(p => p.onSale), [products]);
  const getAllBrands = useCallback(() => Array.from(new Set(products.map(p => p.brand))).sort(), [products]);

  const searchProducts = useCallback((query: string) => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.brand.toLowerCase().includes(lowerQuery) ||
      p.categoryName.toLowerCase().includes(lowerQuery)
    );
  }, [products]);

  const getNoveltiesProducts = useCallback(() => {
    return [...products]
      .sort((a, b) => new Date((b as any).criado_em || 0).getTime() - new Date((a as any).criado_em || 0).getTime())
      .slice(0, 10);
  }, [products]);

  // OTIMIZAÇÃO: O objeto 'value' é "memorizado" com useMemo.
  // Ele só será recriado se um de seus valores (como a lista 'products') mudar.
  // Isso impede que todos os componentes que usam o contexto sejam re-renderizados desnecessariamente.
  const contextValue = useMemo(() => ({
    products,
    categories,
    loading,
    getProductById,
    getProductsByBrand,
    getProductsByCategory,
    getFeaturedProducts,
    getBestSellers,
    getOnSaleProducts,
    getAllBrands,
    searchProducts,
    getNoveltiesProducts
  }), [
    products, categories, loading, getProductById, getProductsByBrand,
    getProductsByCategory, getFeaturedProducts, getBestSellers,
    getOnSaleProducts, getAllBrands, searchProducts, getNoveltiesProducts
  ]);

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextData => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts deve ser usado dentro de um ProductProvider');
  }
  return context;
};