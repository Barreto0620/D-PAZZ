import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Search, Menu, X, LogIn, User } from 'lucide-react';
import { DarkModeToggle } from './DarkModeToggle';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategories } from '../services/api';
import { Category } from '../types';
import { useSearch } from '../hooks/useSearch';
import { SearchResults } from './SearchResults';

export const Navbar: React.FC = () => {
  const { getItemCount } = useCart();
  const { favorites } = useFavorites();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  
  const { 
    searchQuery, 
    setSearchQuery, 
    searchResults, 
    isSearching 
  } = useSearch();

  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(true);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchResults(value.trim().length > 0);
  };

  const handleSearchResultClick = () => {
    setShowSearchResults(false);
    setSearchQuery('');
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.search-container')) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const cartItemCount = getItemCount();
  const favoritesCount = favorites.length;

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-dark-lighter shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/dpazz-imports-logo.png"
              alt="D'Pazz Imports"
              className="h-12"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-dark dark:text-white hover:text-primary dark:hover:text-primary transition-colors">
              Início
            </Link>
            {categories.slice(0, 4).map(category => (
              <Link 
                key={category.id}
                to={`/categoria/${category.id}`}
                className="text-dark dark:text-white hover:text-primary dark:hover:text-primary transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Search, Cart, Favorites, Dark Mode */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative search-container">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  className="px-4 py-2 pl-10 rounded-full bg-light-darker dark:bg-dark-lighter text-dark dark:text-white w-96 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
                <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              </form>
              
              {showSearchResults && (
                <SearchResults 
                  results={searchResults} 
                  onClose={handleSearchResultClick} 
                />
              )}
            </div>

            <Link 
              to="/favoritos" 
              className="relative p-2 rounded-full hover:bg-light-darker dark:hover:bg-dark-light transition-colors"
            >
              <Heart size={24} className="text-dark dark:text-white" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>

            <div className="relative group">
              {isAuthenticated ? (
                <button className="flex items-center gap-2 p-2 rounded-full hover:bg-light-darker dark:hover:bg-dark-light transition-colors">
                  <User size={24} className="text-dark dark:text-white" />
                </button>
              ) : (
                <Link 
                  to="/login"
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-light-darker dark:hover:bg-dark-light transition-colors"
                >
                  <LogIn size={24} className="text-dark dark:text-white" />
                  <span className="text-sm font-medium text-dark dark:text-white">Entrar</span>
                </Link>
              )}
              
              {isAuthenticated && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-dark-lighter shadow-lg rounded-lg overflow-hidden hidden group-hover:block border border-gray-200 dark:border-gray-700">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <User size={20} className="text-primary" />
                      <div>
                        <p className="text-sm font-medium text-dark dark:text-white">
                          {isAdmin ? 'Admin' : 'Cliente'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {isAdmin ? 'admin@example.com' : 'customer@example.com'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    to={isAdmin ? '/admin/dashboard' : '/cliente/painel'}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-dark dark:text-white hover:bg-light-darker dark:hover:bg-dark-light transition-colors"
                  >
                    {isAdmin ? 'Dashboard Admin' : 'Minha Conta'}
                  </Link>
                  
                  <button 
                    onClick={logout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-error hover:bg-light-darker dark:hover:bg-dark-light transition-colors"
                  >
                    <LogIn size={18} />
                    <span>Sair</span>
                  </button>
                </div>
              )}
            </div>

            <Link 
              to="/carrinho" 
              className="relative p-2 rounded-full hover:bg-light-darker dark:hover:bg-dark-light transition-colors"
            >
              <ShoppingCart size={24} className="text-dark dark:text-white" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-dark text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <DarkModeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-4 md:hidden">
            <Link to="/favoritos" className="relative p-2">
              <Heart size={24} className="text-dark dark:text-white" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {!isAuthenticated && (
              <Link to="/login" className="relative p-2">
                <LogIn size={24} className="text-dark dark:text-white" />
              </Link>
            )}
            
            <Link to="/carrinho" className="relative p-2">
              <ShoppingCart size={24} className="text-dark dark:text-white" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-dark text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-lg bg-light-darker dark:bg-dark-lighter"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X size={24} className="text-dark dark:text-white" />
              ) : (
                <Menu size={24} className="text-dark dark:text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <nav className="flex flex-col px-4 py-4 space-y-4 bg-white dark:bg-dark-lighter">
              <div className="relative search-container">
                <form onSubmit={handleSearch} className="relative mb-2">
                  <input
                    type="text"
                    placeholder="Buscar produtos..."
                    className="w-full px-4 py-2 pl-10 rounded-full bg-light-darker dark:bg-dark-lighter text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                  />
                  <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                </form>
                
                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-50">
                    <SearchResults 
                      results={searchResults} 
                      onClose={handleSearchResultClick} 
                    />
                  </div>
                )}
              </div>

              <Link 
                to="/" 
                className="text-dark dark:text-white hover:text-primary dark:hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </Link>

              {categories.map(category => (
                <Link 
                  key={category.id}
                  to={`/categoria/${category.id}`}
                  className="text-dark dark:text-white hover:text-primary dark:hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}

              <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                <DarkModeToggle />
                
                {isAuthenticated ? (
                  <div className="flex space-x-4">
                    <Link 
                      to={isAdmin ? '/admin/dashboard' : '/cliente/painel'}
                      className="text-dark dark:text-white hover:text-primary dark:hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {isAdmin ? 'Admin' : 'Minha Conta'}
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="text-dark dark:text-white hover:text-primary dark:hover:text-primary transition-colors"
                    >
                      Sair
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/login"
                    className="text-dark dark:text-white hover:text-primary dark:hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};