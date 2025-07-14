// project/src/contexts/ProductContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category, ProductsJsonData } from '../types'; // Importando interfaces completas do arquivo de tipos

interface ProductContextData {
  products: Product[]; // Agora Products[] contém todos os detalhes e o nome da categoria
  categories: Category[];
  loading: boolean;
  getProductById: (id: number) => Product | undefined; // Adicionado para buscar um produto específico
  getProductsByBrand: (brand: string) => Product[];
  getProductsByCategory: (categoryId: number) => Product[];
  getFeaturedProducts: () => Product[];
  getBestSellers: () => Product[];
  getOnSaleProducts: () => Product[];
  getAllBrands: () => string[];
  searchProducts: (query: string) => Product[];
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
        
        // Carrega os dados do arquivo JSON localmente
        const module = await import('../data/products.json');
        const data: ProductsJsonData = module.default;
        
        // Mapeia as categorias para um lookup rápido do nome da categoria
        const categoryMap = new Map<number, string>();
        data.categories.forEach(cat => categoryMap.set(cat.id, cat.name));

        // Converte os dados brutos para o formato da interface Product completa
        // Adicionando categoryName e garantindo que 'images' é um array
        const convertedProducts: Product[] = data.products.map(productData => ({
          ...productData,
          categoryName: categoryMap.get(productData.category) || 'Desconhecida', // Fallback para caso não encontre
          // Garante que images é um array; se não for, ou estiver vazio, fornece um array vazio.
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
  }, []); // Dependência vazia para carregar os dados apenas uma vez na montagem

  // Função para buscar um produto por ID
  const getProductById = (id: number): Product | undefined => {
    return products.find(p => p.id === id);
  };

  // Funções de filtragem e busca agora operam sobre o array `products` já convertido e tipado
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
    // Usamos um Set para garantir marcas únicas e depois convertemos para array
    return Array.from(new Set(products.map(p => p.brand))).sort(); // Adicionado sort para ordem alfabética
  };

  const searchProducts = (query: string): Product[] => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.brand.toLowerCase().includes(lowerQuery) ||
      p.categoryName.toLowerCase().includes(lowerQuery) // Inclui busca por nome da categoria
    );
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      categories,
      loading, 
      getProductById, // Incluído no contexto
      getProductsByBrand, 
      getProductsByCategory,
      getFeaturedProducts,
      getBestSellers,
      getOnSaleProducts,
      getAllBrands,
      searchProducts
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