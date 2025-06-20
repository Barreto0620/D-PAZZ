import productsData from '../data/products.json';
import usersData from '../data/users.json'; // Assumindo que você terá um arquivo de usuários ou gerenciará em memória
import { Product, Category, CustomerInfo, Order, User } from '../types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory store for mock data
let products: Product[] = [...productsData.products];
const categories: Category[] = [...productsData.categories];
let users: User[] = [...usersData.users]; // Carrega usuários de um arquivo mock ou inicializa vazio
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


// Products API
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

// Admin Products API (simulated with in-memory persistence)
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

// Admin Orders API (simulated with in-memory persistence)
export const getOrders = async (): Promise<Order[]> => {
  await delay(400);
  // Simular ordenação por data de criação do mais novo para o mais antigo
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

// Admin Users (Clients) API (simulated with in-memory persistence)
export const getUsers = async (): Promise<User[]> => {
  await delay(400);
  return users;
};

export const getUserById = async (userId: string): Promise<User | null> => {
  await delay(300);
  return users.find(u => u.id === userId) || null;
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  await delay(500);
  const initialLength = users.length;
  users = users.filter(u => u.id !== userId);
  return users.length < initialLength;
};


// Checkout API (simulated)
export const submitOrder = async (customerInfo: CustomerInfo, cartItems: any[]): Promise<{ success: boolean; orderId: string }> => {
  await delay(1000);
  // Simular a criação de um novo pedido e adicioná-lo ao array em memória
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
  orders.push(newOrder); // Adiciona o novo pedido à lista

  return {
    success: true,
    orderId: newOrderId
  };
};