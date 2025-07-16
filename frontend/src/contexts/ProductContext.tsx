// project/src/contexts/ProductContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category, ProductsJsonData } from '../types';

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
  getNoveltiesProducts: () => Product[]; // Nova função para novidades
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

        const module = await import('../data/products.json');
        const data: ProductsJsonData = module.default;

        const categoryMap = new Map<number, string>();
        data.categories.forEach(cat => categoryMap.set(cat.id, cat.name));

        const convertedProducts: Product[] = data.products.map(productData => ({
          ...productData,
          categoryName: categoryMap.get(productData.category) || 'Desconhecida',
          images: productData.images && Array.isArray(productData.images) ? productData.images : [],
        }));

        setProducts(convertedProducts);
        setCategories(data.categories);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
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

  // Implementação da função para obter produtos de "novidades"
  // Definição: Produtos que são "featured" (destaque) OU "bestSeller" (mais vendidos)
  // E também os mais recentes, se tivessem uma data de adição, para simular novidade real.
  // Por simplicidade, vamos usar 'featured' e 'bestSeller' como critérios primários para "melhores de todas as coleções"
  // E podemos adicionar uma lógica de ordenação por ID (assumindo que IDs maiores são mais novos).
  const getNoveltiesProducts = (): Product[] => {
    // Filtra produtos que são destaque OU mais vendidos
    const novelties = products.filter(p => p.featured || p.bestSeller);

    // Opcional: Ordenar por ID para simular produtos "mais novos" (se IDs forem sequenciais)
    // Se você tiver um campo 'dateAdded' no seu Product, seria ideal usá-lo aqui.
    return novelties.sort((a, b) => b.id - a.id);
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
      getNoveltiesProducts // Adicionado ao valor do contexto
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