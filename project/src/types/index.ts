// project/src/types.ts
export interface Product {
  id: number | string; // Permitir string para IDs gerados por UUID, etc.
  name: string;
  description?: string; // Tornar opcional para segurança no filtro
  price: number;
  stock: number;
  category?: string; // Tornar opcional para segurança no filtro
  imageUrl?: string; // Se você tiver imagens
  // Adicione outros campos relevantes do seu produto
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string; // ID do usuário que fez o pedido
  total: number;
  status: OrderStatus;
  createdAt: string; // ISO Date string
  items: any[]; // Detalhes dos itens do pedido (poderia ser mais detalhado, e.g., Array<OrderItem>)
  // Adicione outros campos relevantes do seu pedido
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  createdAt: string; // ISO Date string
  phone?: string; // Tornar opcional para segurança no filtro
  address?: string;
  cpf?: string;
  // Adicione outros campos relevantes do seu usuário
}