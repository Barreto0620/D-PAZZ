// frontend/src/services/api.ts

import { supabase } from '../lib/supabase';
import productsData from '../data/products.json';
import usersData from '../data/users.json';
import { Product, Category, CustomerInfo, Order, User } from '../types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory store for mock data
let products: Product[] = [...productsData.products];
const categories: Category[] = [...productsData.categories];
let orders: Order[] = []; // In-memory store for orders

// Initialize some mock orders if needed for demonstration
if (orders.length === 0) {
  orders = [
    {
      id: 'ORD001',
      userId: 'user123',
      items: [
        { product: products[0], quantity: 1 },
        { product: products[1], quantity: 2 },
      ],
      total: products[0].price * 1 + products[1].price * 2,
      status: 'processing',
      createdAt: new Date().toISOString(),
      shippingAddress: 'Rua Exemplo, 123, Cidade, Estado',
    },
    {
      id: 'ORD002',
      userId: 'admin456',
      items: [
        { product: products[2], quantity: 1 },
      ],
      total: products[2].price * 1,
      status: 'pending',
      createdAt: new Date(Date.now() - 86400000).toISOString(), // Ontem
      shippingAddress: 'Av. Teste, 456, Outra Cidade, Outro Estado',
    },
  ];
}


// ####################################################################
// ##  FUNÇÕES ORIGINAIS DE PRODUTOS E CATEGORIAS - MANTIDAS 100%    ##
// ####################################################################

export const getProducts = async (): Promise<Product[]> => {
  await delay(300);
  return products.map(product => {
    const category = categories.find(c => c.id === product.category);
    return {
      ...product,
      categoryName: category?.name || 'Uncategorized' // Fallback para 'Uncategorized'
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
    categoryName: category?.name || 'Uncategorized'
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
        categoryName: category?.name || 'Uncategorized'
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

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  await delay(500);
  const newId = Math.max(...products.map(p => p.id), 0) + 1;
  const category = categories.find(c => c.id === product.category);
  
  const newProduct: Product = {
    ...product,
    id: newId,
    categoryName: category?.name || 'Uncategorized',
    rating: product.rating || 4.0, // Garantir valor padrão
    reviewCount: product.reviewCount || 0 // Garantir valor padrão
  };
  
  products.push(newProduct);
  
  return newProduct;
};

export const updateProduct = async (id: number, updates: Partial<Product>): Promise<Product | null> => {
  await delay(500);
  
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  const category = categories.find(c => c.id === (updates.category ?? products[index].category));
  
  const updatedProduct: Product = {
    ...products[index],
    ...updates,
    id, // Ensure ID remains unchanged
    categoryName: category?.name || 'Uncategorized'
  };
  
  products[index] = updatedProduct;
  
  return updatedProduct;
};

export const deleteProduct = async (id: number): Promise<boolean> => {
  await delay(500);
  const initialLength = products.length;
  products = products.filter(p => p.id !== id);
  return products.length < initialLength; // Returns true if a product was actually removed
};

export const getOrders = async (): Promise<Order[]> => {
  await delay(400);
  return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const updateOrderStatus = async (orderId: string, newStatus: Order['status']): Promise<Order | null> => {
  await delay(500);
  const index = orders.findIndex(o => o.id === orderId);
  if (index === -1) return null;
  
  orders[index] = { ...orders[index], status: newStatus };
  return orders[index];
};

export const deleteOrder = async (orderId: string): Promise<boolean> => {
  await delay(500);
  const initialLength = orders.length;
  orders = orders.filter(o => o.id !== orderId);
  return orders.length < initialLength;
};

// ####################################################################
// ##  FUNÇÕES DE USUÁRIOS (CLIENTES) - MODIFICADAS PARA O BANCO     ##
// ####################################################################

export const getUsers = async (): Promise<User[]> => {
  // Consulta simplificada para evitar o erro 400.
  const { data: perfis, error } = await supabase
    .from('perfis')
    .select(`id, nome_completo, cpf, telefone, endereco, criado_em`);

  if (error) {
    console.error('Erro ao buscar perfis:', error.message);
    throw new Error(error.message);
  }

  // O email virá como 'N/A' por enquanto para focarmos em exibir a lista.
  return perfis.map((p: any) => ({
    id: p.id,
    name: p.nome_completo,
    email: 'N/A', 
    phone: p.telefone,
    cpf: p.cpf,
    address: p.endereco,
    createdAt: p.criado_em,
    role: 'customer',
  }));
};

export const getUserById = async (userId: string): Promise<User | null> => {
  const { data, error } = await supabase.from('perfis').select(`*`).eq('id', userId).single();
  if (error || !data) {
    console.error(`Erro ao buscar perfil ID ${userId}:`, error);
    return null;
  }
  return { id: data.id, name: data.nome_completo, email: 'N/A', phone: data.telefone, cpf: data.cpf, address: data.endereco, createdAt: data.criado_em, role: 'customer' };
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  const { error } = await supabase.from('perfis').delete().eq('id', userId);
  if (error) {
    console.error('Erro ao deletar perfil:', error.message);
    return false;
  }
  return true;
};

// ####################################################################
// ##        FUNÇÃO DE CHECKOUT - MANTIDA 100% ORIGINAL              ##
// ####################################################################

export const submitOrder = async (customerInfo: CustomerInfo, cartItems: any[]): Promise<{ success: boolean; orderId: string }> => {
  await delay(1000);
  const newOrderId = `ORD-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const newOrder: Order = {
    id: newOrderId,
    userId: 'guest', // Ou buscar userId se o usuário estiver logado
    items: cartItems,
    total: total,
    status: 'pending',
    createdAt: new Date().toISOString(),
    shippingAddress: customerInfo.address, // Usar o endereço do customerInfo
  };
  orders.push(newOrder); 

  return {
    success: true,
    orderId: newOrderId
  };
};