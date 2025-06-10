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
        console.error('Erro ao buscar categorias:', error);
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

  // Fecha os resultados da busca ao clicar fora
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

  // Links de navegação profissionais com marcas principais
  const navLinks = [
    { 
      name: 'Nike', 
      path: categories.find(c => c.name.toLowerCase().includes('nike'))?.id 
        ? `/categoria/${categories.find(c => c.name.toLowerCase().includes('nike'))?.id}` 
        : '/marca/nike'
    },
    { 
      name: 'Adidas', 
      path: categories.find(c => c.name.toLowerCase().includes('adidas'))?.id 
        ? `/categoria/${categories.find(c => c.name.toLowerCase().includes('adidas'))?.id}` 
        : '/marca/adidas'
    },
    { 
      name: 'Mizuno', 
      path: categories.find(c => c.name.toLowerCase().includes('mizuno'))?.id 
        ? `/categoria/${categories.find(c => c.name.toLowerCase().includes('mizuno'))?.id}` 
        : '/marca/mizuno'
    },
    { name: 'Novidades', path: '/novidades' },
    { name: 'Contato', path: '/contato' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-dark-lighter shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img
              src="https://raw.githubusercontent.com/Lusxka/logompz/refs/heads/main/logompz-Photoroom.png"
              alt="D'Pazz Imports"
              className="h-12 ml-20"
            />
          </Link>

          {/* Desktop Navigation - Centralizado e profissional */}
          <nav className="hidden lg:flex items-center justify-center flex-grow">
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="relative text-dark dark:text-white font-semibold hover:text-primary dark:hover:text-primary transition-all duration-300 text-lg group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Actions - Search, User, Favorites, Cart, Dark Mode */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="relative search-container">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  className="px-4 py-2.5 pl-10 pr-4 rounded-full bg-gray-50 dark:bg-dark-lighter text-dark dark:text-white w-72 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-dark-lighter border border-gray-200 dark:border-gray-600 transition-all duration-300"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
                <Search size={18} className="absolute left-3 top-3 text-gray-400" />
              </form>

              {showSearchResults && (
                <SearchResults
                  results={searchResults}
                  onClose={handleSearchResultClick}
                />
              )}
            </div>

            <div className="relative group">
              {isAuthenticated ? (
                <button className="flex items-center gap-2 p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-dark-light transition-all duration-300">
                  <User size={22} className="text-dark dark:text-white" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-dark-light transition-all duration-300"
                >
                  <LogIn size={22} className="text-dark dark:text-white" />
                </Link>
              )}

              {isAuthenticated && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-dark-lighter shadow-xl rounded-xl overflow-hidden hidden group-hover:block border border-gray-200 dark:border-gray-700">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                        <User size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-dark dark:text-white">
                          {isAdmin ? 'Administrador' : 'Cliente'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {isAdmin ? 'admin@dpazzimports.com' : 'cliente@dpazzimports.com'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={isAdmin ? '/admin/dashboard' : '/cliente/painel'}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-dark-light transition-colors"
                  >
                    <User size={16} />
                    {isAdmin ? 'Dashboard Admin' : 'Minha Conta'}
                  </Link>

                  <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogIn size={16} />
                    <span>Sair</span>
                  </button>
                </div>
              )}
            </div>

            <Link
              to="/favoritos"
              className="relative p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-dark-light transition-all duration-300"
            >
              <Heart size={22} className="text-dark dark:text-white" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {favoritesCount}
                </span>
              )}
            </Link>

            <Link
              to="/carrinho"
              className="relative p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-dark-light transition-all duration-300"
            >
              <ShoppingCart size={22} className="text-dark dark:text-white" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <div className="border-l border-gray-200 dark:border-gray-700 pl-3 ml-2">
              <DarkModeToggle />
            </div>
          </div>

          {/* Mobile menu button and icons */}
          <div className="flex items-center space-x-2 lg:hidden">
            <Link to="/favoritos" className="relative p-2">
              <Heart size={22} className="text-dark dark:text-white" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {!isAuthenticated && (
              <Link to="/login" className="relative p-2">
                <LogIn size={22} className="text-dark dark:text-white" />
              </Link>
            )}

            <Link to="/carrinho" className="relative p-2">
              <ShoppingCart size={22} className="text-dark dark:text-white" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg bg-gray-100 dark:bg-dark-lighter hover:bg-gray-200 dark:hover:bg-dark transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X size={22} className="text-dark dark:text-white" />
              ) : (
                <Menu size={22} className="text-dark dark:text-white" />
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
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden border-t border-gray-200 dark:border-gray-700"
          >
            <nav className="flex flex-col px-4 py-6 space-y-4 bg-white dark:bg-dark-lighter">
              <div className="relative search-container mb-4">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Buscar produtos..."
                    className="w-full px-4 py-3 pl-10 rounded-full bg-gray-50 dark:bg-dark-lighter text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary border border-gray-200 dark:border-gray-600"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                  />
                  <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
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

              {/* Mobile Navigation Links */}
              <div className="space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="block text-dark dark:text-white hover:text-primary dark:hover:text-primary transition-colors text-lg font-medium py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-light"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <DarkModeToggle />

                {isAuthenticated ? (
                  <div className="flex space-x-4">
                    <Link
                      to={isAdmin ? '/admin/dashboard' : '/cliente/painel'}
                      className="text-dark dark:text-white hover:text-primary dark:hover:text-primary transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {isAdmin ? 'Admin' : 'Minha Conta'}
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="text-red-600 hover:text-red-700 transition-colors font-medium"
                    >
                      Sair
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="text-dark dark:text-white hover:text-primary dark:hover:text-primary transition-colors font-medium"
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