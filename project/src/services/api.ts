import productsData from '../data/products.json';
import { Product, Category, CustomerInfo } from '../types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory store for mock data
let products = [...productsData.products];
const categories = [...productsData.categories];

// Products API
export const getProducts = async (): Promise<Product[]> => {
  await delay(300);
  return products.map(product => {
    const category = categories.find(c => c.id === product.category);
    return {
      ...product,
      categoryName: category?.name
    };
  });
};

export const getProductById = async (id: number): Promise<Product | null> => {
  await delay(200);
  const product = products.find(p => p.id === id);
  if (!product) return null;

  const category = categories.find(c => c.id === product.category);
  return {
    ...product,
    categoryName: category?.name
  };
};

export const getProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  await delay(300);
  return products
    .filter(p => p.category === categoryId)
    .map(product => {
      const category = categories.find(c => c.id === product.category);
      return {
        ...product,
        categoryName: category?.name
      };
    });
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  await delay(300);
  return (await getProducts()).filter(p => p.featured);
};

export const getOnSaleProducts = async (): Promise<Product[]> => {
  await delay(300);
  return (await getProducts()).filter(p => p.onSale);
};

export const getBestSellerProducts = async (): Promise<Product[]> => {
  await delay(300);
  return (await getProducts()).filter(p => p.bestSeller);
};

// Categories API
export const getCategories = async (): Promise<Category[]> => {
  await delay(300);
  return categories;
};

export const getCategoryById = async (id: number): Promise<Category | null> => {
  await delay(200);
  const category = categories.find(c => c.id === id);
  return category || null;
};

export const getFeaturedCategories = async (): Promise<Category[]> => {
  await delay(300);
  return categories.filter(c => c.featured);
};

// Admin API (simulated with in-memory persistence)
export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  await delay(500);
  const newId = Math.max(...products.map(p => p.id), 0) + 1;
  const category = categories.find(c => c.id === product.category);
  
  const newProduct: Product = {
    ...product,
    id: newId,
    categoryName: category?.name
  };
  
  // Update in-memory products array
  products.push(newProduct);
  
  return newProduct;
};

export const updateProduct = async (id: number, updates: Partial<Product>): Promise<Product | null> => {
  await delay(500);
  
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  const category = categories.find(c => c.id === (updates.category ?? products[index].category));
  
  // Update the product in the in-memory array
  const updatedProduct: Product = {
    ...products[index],
    ...updates,
    id, // Ensure ID remains unchanged
    categoryName: category?.name
  };
  
  products[index] = updatedProduct;
  
  return updatedProduct;
};

export const deleteProduct = async (id: number): Promise<boolean> => {
  await delay(500);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return false;
  
  // Remove from in-memory array
  products = products.filter(p => p.id !== id);
  return true;
};

// Checkout API (simulated)
export const submitOrder = async (customerInfo: CustomerInfo, cartItems: any[]): Promise<{ success: boolean; orderId: string }> => {
  await delay(1000);
  return {
    success: true,
    orderId: `ORD-${Math.floor(Math.random() * 10000)}`
  };
};