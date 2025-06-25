// project/src/types/index.ts

export interface Product {
  id: number;
  name: string;
  description?: string;
  category?: string;
  price: number;
  image?: string;
  color?: string; // Novo campo adicionado
  shoeNumber?: string; // Novo campo adicionado (pode ser tamanhos como "38", "39-40", etc.)
  // Removido o campo "destacado" conforme solicitado
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}