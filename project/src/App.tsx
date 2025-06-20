import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Importe Navigate
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
import { AdminProductsPage } from './pages/AdminProductsPage';
import { AdminOrdersPage } from './pages/AdminOrdersPage';
import { AdminCustomersPage } from './pages/AdminCustomersPage'; // Importe AdminCustomersPage (CORRIGIDO)
// import { AdminClientsPage } from './pages/AdminClientsPage'; // REMOVIDO: A página de clientes foi padronizada como AdminCustomersPage
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { PurchaseHistoryPage } from './pages/PurchaseHistoryPage';
import { NotFoundPage } from './pages/NotFoundPage'; // Você precisará criar esta página

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <Router>
              <Helmet>
                <title>D'Pazz Imports - Tênis Premium | Qualidade Internacional</title>
                <meta name="description" content="A melhor loja de produtos importados do Brasil. Tênis premium, eletrônicos, roupas, acessórios e mais com os melhores preços." /> {/* Descrição aprimorada */}
                <meta name="keywords" content="tênis premium, importados, eletrônicos, roupas, acessórios, produtos importados, d'pazz, d'pazz imports" /> {/* Keywords aprimoradas */}
              </Helmet>
              
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/categoria/:id" element={<CategoryPage />} />
                <Route path="/produto/:id" element={<ProductPage />} />
                <Route path="/carrinho" element={<CartPage />} />
                <Route path="/favoritos" element={<FavoritesPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/login" element={<LoginPage />} />
                {/* Rotas Admin */}
                {/* Adicionado um redirecionamento da raiz /admin para /admin/dashboard */}
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/products" element={<AdminProductsPage />} />
                <Route path="/admin/orders" element={<AdminOrdersPage />} />
                <Route path="/admin/customers" element={<AdminCustomersPage />} /> {/* Rota para Clientes padronizada como customers (CORRIGIDO) */}
                {/* Rotas Cliente */}
                <Route path="/cliente/painel" element={<CustomerDashboardPage />} />
                <Route path="/cliente/compras" element={<PurchaseHistoryPage />} />
                {/* Catch-all para rotas não encontradas */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Router>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;