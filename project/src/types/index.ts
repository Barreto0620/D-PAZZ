export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: number;
  categoryName?: string;
  images: string[];
  featured?: boolean;
  onSale?: boolean;
  bestSeller?: boolean;
  stock: number;
  rating: number;
  reviewCount: number;
}

export interface Category {
  id: number;
  name: string;
  image: string;
  description: string;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  name?: string;
  cpf?: string;
  phone?: string;
  address?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: string;
}