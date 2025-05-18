import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { 
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    cpf: string;
    phone: string;
  }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// For demo purposes only - in a real app, this would be handled securely on the server
const ADMIN_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'admin123'
};

const DEMO_USERS = [
  {
    id: '1',
    email: 'customer@example.com',
    password: 'customer123',
    username: 'customer',
    isAdmin: false,
    name: 'João Silva',
    cpf: '123.456.789-00',
    phone: '(11) 98765-4321',
    address: 'Rua das Flores, 123 - São Paulo, SP'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState(DEMO_USERS);
  
  useEffect(() => {
    // Check for saved user on mount
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // First check if it's an admin login
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const adminUser: User = {
        id: 'admin',
        username: 'admin',
        email: ADMIN_CREDENTIALS.email,
        isAdmin: true
      };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      return true;
    }

    // If not admin, check for customer login
    const customer = users.find(u => u.email === email && u.password === password);
    if (customer) {
      const { password: _, ...customerData } = customer;
      setUser(customerData);
      localStorage.setItem('user', JSON.stringify(customerData));
      return true;
    }

    return false;
  };

  const register = async (data: { 
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    cpf: string;
    phone: string;
  }): Promise<boolean> => {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if email already exists
    if (users.some(u => u.email === data.email)) {
      return false;
    }

    // Check if passwords match
    if (data.password !== data.confirmPassword) {
      throw new Error('As senhas não coincidem');
    }

    // Create new user
    const newUser = {
      id: String(users.length + 1),
      email: data.email,
      password: data.password,
      username: data.email.split('@')[0],
      name: data.name,
      cpf: data.cpf,
      phone: data.phone,
      isAdmin: false
    };

    // Add to users array
    setUsers(prev => [...prev, newUser]);

    // Log in the new user
    const { password: _, ...userData } = newUser;
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        register,
        logout, 
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};