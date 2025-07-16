import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types';
import { getProducts } from '../services/api';

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await getProducts();
        setAllProducts(products);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };
    loadProducts();
  }, []);

  const searchProducts = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const normalizedQuery = query.toLowerCase().trim();
    const results = allProducts.filter(product => {
      const normalizedName = product.name.toLowerCase();
      const normalizedCategory = product.categoryName?.toLowerCase() || '';
      const normalizedDescription = product.description.toLowerCase();

      return (
        normalizedName.includes(normalizedQuery) ||
        normalizedCategory.includes(normalizedQuery) ||
        normalizedDescription.includes(normalizedQuery)
      );
    });

    setSearchResults(results);
  }, [allProducts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        setIsSearching(true);
        searchProducts(searchQuery);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchProducts]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
  };
}