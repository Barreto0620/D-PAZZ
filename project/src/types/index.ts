// project/src/types/index.ts

// --- Interfaces para dados de produtos e categorias ---

// Interface para a estrutura de uma Categoria
export interface Category {
  id: number;
  name: string;
  image: string; // URL da imagem da categoria
  featured: boolean; // Indica se a categoria é destacada (mantive para o JSON de categorias)
  slug: string; // Slug para URLs amigáveis
}

// Interface COMPLETA para um Produto, como será usado na aplicação (após processamento do JSON)
// Inclui todas as propriedades necessárias para exibição e funcionalidade.
export interface Product {
  id: number;
  name: string;
  description: string; // Mantido como obrigatório, pois o JSON parece tê-lo
  price: number;
  oldPrice?: number; // Preço antigo opcional
  category: number; // ID numérico da categoria (do JSON original)
  categoryName: string; // Nome da categoria (string), para exibição
  brand: string; // Marca do produto
  images: string[]; // **Array de URLs de imagens**, crucial para o ProductCard
  featured: boolean; // Se o produto é destacado
  onSale: boolean; // Se o produto está em promoção
  bestSeller: boolean; // Se o produto é mais vendido
  stock: number; // Quantidade em estoque
  rating: number; // Avaliação do produto
  reviewCount: number; // Número de avaliações
  color?: string; // Novo campo: Cor do produto (opcional)
  shoeNumber?: string; // Novo campo: Tamanho do calçado (opcional, pode ser string para "39-40")
}

// Interface para os DADOS BRUTOS como vêm do seu arquivo `products.json`
// NOTA: 'categoryName' NÃO existe aqui, será adicionado pelo ProductContext
// NOTA: 'featured' no produto pode ter sido removido do seu JSON, ajustei aqui.
export interface ProductDataFromJson {
  id: number;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: number; // No JSON, a categoria é geralmente um ID
  brand: string;
  images: string[];
  featured: boolean; // Confirmar se 'featured' ainda existe nos dados brutos do produto ou se foi removido
  onSale: boolean;
  bestSeller: boolean;
  stock: number;
  rating: number;
  reviewCount: number;
  color?: string;
  shoeNumber?: string;
}

// Interface para a estrutura COMPLETA do seu arquivo JSON de produtos (products.json)
export interface ProductsJsonData {
  categories: Category[];
  products: ProductDataFromJson[]; // Usa a interface de dados brutos
}

// --- Interfaces para Carrinho e Favoritos ---

// Interface para um item no carrinho de compras
export interface CartItem {
  product: Product; // O produto completo
  quantity: number; // Quantidade deste produto no carrinho
}

// Interface para um item favorito (pode ser mais simplificada)
export interface FavoriteItem {
  id: number;
  name: string;
  image: string; // URL da imagem principal do produto favorito
}

// --- Interfaces para Autenticação e Usuário ---

// Interface para um Usuário
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user'; // Papel do usuário
}

// Interface para a resposta da autenticação (após login)
export interface AuthResponse {
  user: User;
  token: string;
}

// Interface para as credenciais de login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Interface para os dados de registro de um novo usuário
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}