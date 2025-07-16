import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { getProductById } from '../services/api';

type FavoritesContextType = {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  toggleFavorite: (product: Product) => void;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
          const favoriteIds = JSON.parse(savedFavorites) as number[];
          
          // Fetch full product data for each favorite ID
          const favProducts: Product[] = [];
          for (const id of favoriteIds) {
            const product = await getProductById(id);
            if (product) {
              favProducts.push(product);
            }
          }
          
          setFavorites(favProducts);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setInitialized(true);
      }
    };

    loadFavorites();
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    if (initialized) {
      const favoriteIds = favorites.map(product => product.id);
      localStorage.setItem('favorites', JSON.stringify(favoriteIds));
    }
  }, [favorites, initialized]);

  const addToFavorites = (product: Product) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.some(p => p.id === product.id)) {
        return prevFavorites;
      }
      return [...prevFavorites, product];
    });
  };

  const removeFromFavorites = (productId: number) => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(product => product.id !== productId)
    );
  };

  const isFavorite = (productId: number) => {
    return favorites.some(product => product.id === productId);
  };

  const toggleFavorite = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <FavoritesContext.Provider 
      value={{ 
        favorites, 
        addToFavorites, 
        removeFromFavorites, 
        isFavorite,
        toggleFavorite
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};