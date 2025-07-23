// project/src/contexts/ProductContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category } from '../types';
import { supabase } from '../lib/supabase'; // Caminho de importação CONFIRMADO com sua estrutura

interface ProductContextData {
  products: Product[];
  categories: Category[];
  loading: boolean;
  getProductById: (id: number) => Product | undefined;
  getProductsByBrand: (brand: string) => Product[];
  getProductsByCategory: (categoryId: number) => Product[];
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
    const loadProducts = async () => {
      try {
        setLoading(true);

        // 1. Buscar categorias do Supabase
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categorias') // Nome da sua tabela de categorias no Supabase
          .select('*');

        if (categoriesError) {
          throw categoriesError;
        }

        const fetchedCategories: Category[] = categoriesData.map((cat: any) => ({
          id: cat.id,
          name: cat.nome,
          image: cat.imagem_url || '',
          featured: cat.em_destaque || false,
          slug: cat.slug || ''
        }));
        setCategories(fetchedCategories);

        const categoryMap = new Map<number, string>();
        fetchedCategories.forEach(cat => categoryMap.set(cat.id, cat.name));

        // 2. Buscar produtos do Supabase
        const { data: productsData, error: productsError } = await supabase
          .from('produtos') // Nome da sua tabela de produtos no Supabase
          .select('*');

        if (productsError) {
          throw productsError;
        }

        // Mapear os dados do Supabase para a interface Product
        const convertedProducts: Product[] = productsData.map((productData: any) => ({
          id: productData.id,
          name: productData.nome,
          description: productData.descricao || '',
          price: parseFloat(productData.preco),
          oldPrice: productData.preco_antigo ? parseFloat(productData.preco_antigo) : undefined,
          category: productData.categoria_id,
          categoryName: categoryMap.get(productData.categoria_id) || 'Desconhecida',
          brand: productData.marca_id || 'Sem Marca', // Se marca_id for UUID, você pode precisar de um join ou outra lógica
          images: productData.imagens && Array.isArray(productData.imagens) ? productData.imagens : [],
          featured: productData.em_destaque || false,
          onSale: productData.em_promocao || false,
          bestSeller: productData.mais_vendido || false,
          stock: productData.estoque || 0,
          rating: parseFloat(productData.avaliacao) || 0,
          reviewCount: productData.numero_avaliacoes || 0,
          color: productData.cor || undefined,
          shoeNumber: productData.tamanho || undefined,
        }));

        setProducts(convertedProducts);

      } catch (error) {
        console.error('Erro ao carregar produtos ou categorias do Supabase:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const getProductById = (id: number): Product | undefined => {
    return products.find(p => p.id === id);
  };

  const getProductsByBrand = (brand: string): Product[] => {
    return products.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
  };

  const getProductsByCategory = (categoryId: number): Product[] => {
    return products.filter(p => p.category === categoryId);
  };

  const getFeaturedProducts = (): Product[] => {
    return products.filter(p => p.featured);
  };

  const getBestSellers = (): Product[] => {
    return products.filter(p => p.bestSeller);
  };

  const getOnSaleProducts = (): Product[] => {
    return products.filter(p => p.onSale);
  };

  const getAllBrands = (): string[] => {
    return Array.from(new Set(products.map(p => p.brand))).sort();
  };

  const searchProducts = (query: string): Product[] => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.brand.toLowerCase().includes(lowerQuery) ||
      p.categoryName.toLowerCase().includes(lowerQuery)
    );
  };

  const getNoveltiesProducts = (): Product[] => {
    return [...products]
      .sort((a, b) => {
        const aIsSpecial = a.featured || a.bestSeller;
        const bIsSpecial = b.featured || b.bestSeller;

        if (aIsSpecial && !bIsSpecial) return -1;
        if (!aIsSpecial && bIsSpecial) return 1;

        return b.id - a.id;
      })
      .slice(0, 10);
  };

  return (
    <ProductContext.Provider value={{
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
    }}>
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