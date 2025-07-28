// frontend/src/services/api.ts
import { supabase } from '../lib/supabase';
import productsData from '../data/products.json';
import usersData from '../data/users.json';
import { Product, Category, CustomerInfo, Order, User } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Dados mock que não são de produtos/categorias/usuários são mantidos
let orders: Order[] = [];
if (orders.length === 0 && productsData.products.length > 0) {
  orders = [
    { id: 'ORD001', userId: 'user123', items: [{ product: productsData.products[0], quantity: 1 }, { product: productsData.products[1], quantity: 2 }], total: productsData.products[0].price * 1 + productsData.products[1].price * 2, status: 'processing', createdAt: new Date().toISOString(), shippingAddress: 'Rua Exemplo, 123, Cidade, Estado' },
    { id: 'ORD002', userId: 'admin456', items: [{ product: productsData.products[2], quantity: 1 }], total: productsData.products[2].price * 1, status: 'pending', createdAt: new Date(Date.now() - 86400000).toISOString(), shippingAddress: 'Av. Teste, 456, Outra Cidade, Outro Estado' },
  ];
}

// ####################################################################
// ## FUNÇÕES DE PRODUTOS - CONECTADAS E CORRIGIDAS ##
// ####################################################################
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase.from('produtos').select('*, categorias(nome), marcas(nome)');
  if (error) { console.error('Erro ao buscar produtos:', error); throw error; }
  return data.map((p: any) => ({
    id: p.id, name: p.nome, description: p.descricao, price: p.preco,
    oldPrice: p.preco_antigo, images: p.imagens || [], stock: p.estoque,
    rating: p.avaliacao, // CORRIGIDO: avaliacao (singular)
    reviewCount: p.numero_avaliacoes, featured: p.em_destaque, onSale: p.em_promocao,
    bestSeller: p.mais_vendido, category: p.categoria_id,
    categoryName: p.categorias?.nome || 'Sem Categoria',
    brand: p.marcas?.nome || 'Sem Marca', color: p.cor,
    tamanhos: [], // Campo 'tamanhos' não existe no BD, retorna array vazio
    criado_em: p.criado_em,
  }));
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase.from('produtos').select('*, categorias(nome), marcas(nome)').eq('id', id).single();
  if (error || !data) { console.error(`Erro ao buscar produto ${id}:`, error); return null; }
  const p = data;
  return {
    id: p.id, name: p.nome, description: p.descricao, price: p.preco,
    oldPrice: p.preco_antigo, images: p.imagens || [], stock: p.estoque,
    rating: p.avaliacao, // CORRIGIDO
    reviewCount: p.numero_avaliacoes, featured: p.em_destaque, onSale: p.em_promocao,
    bestSeller: p.mais_vendido, category: p.categoria_id,
    categoryName: (p.categorias as any)?.nome || 'Sem Categoria',
    brand: (p.marcas as any)?.nome || 'Sem Marca', color: p.cor,
    tamanhos: [], // Campo 'tamanhos' não existe no BD
    criado_em: p.criado_em
  };
};

export const createProduct = async (productData: Omit<Product, 'id' | 'categoryName' | 'brand'>): Promise<Product> => {
  const { data, error } = await supabase.from('produtos').insert({
    nome: productData.name, descricao: productData.description,
    preco: productData.price, preco_antigo: productData.oldPrice,
    imagens: productData.images, estoque: productData.stock,
    avaliacao: productData.rating, // CORRIGIDO
    numero_avaliacoes: productData.reviewCount, em_destaque: productData.featured,
    em_promocao: productData.onSale, mais_vendido: productData.bestSeller,
    categoria_id: productData.category, cor: productData.color,
  }).select().single();
  if (error) { console.error('Erro ao criar produto:', error); throw error; }
  const newProduct = await getProductById(data.id);
  if (!newProduct) throw new Error("Falha ao buscar produto recém-criado.");
  return newProduct;
};

export const updateProduct = async (productId: string, productData: Partial<Product>): Promise<Product | null> => {
  const { data, error } = await supabase.from('produtos').update({
    nome: productData.name, descricao: productData.description,
    preco: productData.price, preco_antigo: productData.oldPrice,
    imagens: productData.images, estoque: productData.stock,
    avaliacao: productData.rating, // CORRIGIDO
    numero_avaliacoes: productData.reviewCount, em_destaque: productData.featured,
    em_promocao: productData.onSale, mais_vendido: productData.bestSeller,
    categoria_id: productData.category, cor: productData.color,
    atualizado_em: new Date().toISOString(),
  }).eq('id', productId).select().single();
  if (error) { console.error('Erro ao atualizar produto:', error); throw error; }
  const updatedProduct = await getProductById(data.id);
  return updatedProduct;
};

export const deleteProduct = async (productId: string): Promise<boolean> => {
  const { error } = await supabase.from('produtos').delete().eq('id', productId);
  if (error) { console.error('Erro ao deletar produto:', error); return false; }
  return true;
};

// ####################################################################
// ## FUNÇÕES DE CATEGORIAS, CLIENTES E MOCKS - RESTAURADAS E COMPLETAS ##
// ####################################################################
export const getCategories = async (): Promise<Category[]> => { const { data, error } = await supabase.from('categorias').select('*').order('nome', { ascending: true }); if (error) { console.error('Erro ao buscar categorias:', error); throw error; } return data.map((cat: any) => ({ id: cat.id, name: cat.nome, description: cat.descricao, image: cat.url_imagem, featured: cat.em_destaque, slug: cat.slug, showInHeader: cat.exibir_no_header })); };
export const createCategory = async (categoryData: Partial<Omit<Category, 'id'>>): Promise<Category> => { const { data, error } = await supabase.rpc('create_new_category', { p_name: categoryData.name, p_description: categoryData.description, p_image_url: categoryData.image, p_featured: categoryData.featured, p_show_in_header: categoryData.showInHeader }).single(); if (error) { console.error('Erro ao criar categoria (RPC):', error); throw error; } return data as Category; };
export const updateCategory = async (categoryId: string, categoryData: Partial<Omit<Category, 'id'>>): Promise<Category> => { const { data, error } = await supabase.rpc('update_existing_category', { p_id: categoryId, p_name: categoryData.name, p_description: categoryData.description, p_image_url: categoryData.image, p_featured: categoryData.featured, p_show_in_header: categoryData.showInHeader }).single(); if (error) { console.error('Erro ao atualizar categoria (RPC):', error); throw error; } return data as Category; };
export const deleteCategory = async (categoryId: string): Promise<boolean> => { const { error } = await supabase.rpc('delete_category_by_id', { p_id: categoryId }); if (error) { console.error('Erro ao deletar categoria (RPC):', error); return false; } return true; };
export const getUsers = async (): Promise<User[]> => { const { data, error } = await supabase.from('user_details').select('*'); if (error) { console.error('Erro ao buscar detalhes dos usuários:', error.message); throw new Error(error.message); } return data.map((user: any) => ({ id: user.id, name: user.nome_completo, email: user.email, phone: user.telefone, cpf: user.cpf, address: user.endereco, createdAt: user.criado_em, role: 'customer' })); };
export const getUserById = async (userId: string): Promise<User | null> => { const { data, error } = await supabase.from('user_details').select('*').eq('id', userId).single(); if (error || !data) { console.error(`Erro ao buscar detalhes do usuário ID ${userId}:`, error); return null; } return { id: data.id, name: data.nome_completo, email: data.email, phone: data.telefone, cpf: data.cpf, address: user.endereco, createdAt: user.criado_em, role: 'customer' }; };
export const deleteUser = async (userId: string): Promise<boolean> => { const { error } = await supabase.from('perfis').delete().eq('id', userId); if (error) { console.error('Erro ao deletar perfil:', error.message); return false; } return true; };

// Funções Auxiliares e Mock (Restauradas do seu original)
const mockProducts: Product[] = [...productsData.products];
const mockCategories: Category[] = [...productsData.categories];
export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => { await delay(300); return mockProducts.filter(p => p.category === categoryId); };
export const getFeaturedProducts = async (): Promise<Product[]> => { await delay(300); return mockProducts.filter(p => p.featured); };
export const getOnSaleProducts = async (): Promise<Product[]> => { await delay(300); return mockProducts.filter(p => p.onSale); };
export const getBestSellerProducts = async (): Promise<Product[]> => { await delay(300); return mockProducts.filter(p => p.bestSeller); };
export const getCategoryById = async (id: string): Promise<Category | null> => { await delay(200); return mockCategories.find(c => c.id === id) || null; };
export const getFeaturedCategories = async (): Promise<Category[]> => { await delay(300); return mockCategories.filter(c => c.featured); };
export const getOrders = async (): Promise<Order[]> => { await delay(400); return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); };
export const updateOrderStatus = async (orderId: string, newStatus: Order['status']): Promise<Order | null> => { await delay(500); const index = orders.findIndex(o => o.id === orderId); if (index === -1) return null; orders[index] = { ...orders[index], status: newStatus }; return orders[index]; };
export const deleteOrder = async (orderId: string): Promise<boolean> => { await delay(500); const initialLength = orders.length; orders = orders.filter(o => o.id !== orderId); return orders.length < initialLength; };
export const submitOrder = async (customerInfo: CustomerInfo, cartItems: any[]): Promise<{ success: boolean; orderId: string }> => { await delay(1000); const newOrderId = `ORD-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`; const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0); const newOrder: Order = { id: newOrderId, userId: 'guest', items: cartItems, total: total, status: 'pending', createdAt: new Date().toISOString(), shippingAddress: customerInfo.address, }; orders.push(newOrder); return { success: true, orderId: newOrderId }; };