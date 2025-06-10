import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// Contexts
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { FavoritesProvider } from './contexts/FavoritesContext';

// Pages
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { PurchaseHistoryPage } from './pages/PurchaseHistoryPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <Router>
              <Helmet>
                <title>D'Pazz Imports - Tênis Premium | Qualidade Internacional</title>
                <meta name="description" content="A melhor loja de produtos importados do Brasil. Eletrônicos, roupas, acessórios e mais com os melhores preços." />
                <meta name="keywords" content="importados, eletrônicos, roupas, acessórios, produtos importados" />
              </Helmet>
              
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/categoria/:id" element={<CategoryPage />} />
                <Route path="/produto/:id" element={<ProductPage />} />
                <Route path="/carrinho" element={<CartPage />} />
                <Route path="/favoritos" element={<FavoritesPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/cliente/painel" element={<CustomerDashboardPage />} />
                <Route path="/cliente/compras" element={<PurchaseHistoryPage />} />
              </Routes>
            </Router>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;