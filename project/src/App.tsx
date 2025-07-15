// project/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// Contexts
import { ProductProvider } from './contexts/ProductContext';
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
import { AdminCustomersPage } from './pages/AdminCustomersPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { PurchaseHistoryPage } from './pages/PurchaseHistoryPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { BrandPage } from './pages/BrandPage';
import { ContactPage } from './pages/ContactPage';
import { NoveltiesPage } from './pages/NoveltiesPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';

// Componente que engloba todos os providers para melhor organização
const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <ProductProvider>{children}</ProductProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  </ThemeProvider>
);

function App() {
  return (
    <AppProviders>
      <Router future={{ v7_startTransition: true, v7_normalizeSplatPaths: true }}>
        <Helmet>
          <title>D'Pazz Imports - Tênis Premium | Qualidade Internacional</title>
          <meta
            name="description"
            content="A melhor loja de produtos importados do Brasil. Tênis premium, eletrônicos, roupas, acessórios e mais com os melhores preços."
          />
          <meta
            name="keywords"
            content="tênis premium, importados, eletrônicos, roupas, acessórios, produtos importados, d'pazz, d'pazz imports"
          />
        </Helmet>

        <Routes>
          {/* Páginas públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/categoria/:id" element={<CategoryPage />} />
          <Route path="/marca/:slug" element={<BrandPage />} />
          <Route path="/produto/:id" element={<ProductPage />} />
          <Route path="/carrinho" element={<CartPage />} />
          <Route path="/favoritos" element={<FavoritesPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/contato" element={<ContactPage />} />
          <Route path="/novidades" element={<NoveltiesPage />} />
          <Route path="/termos-de-servico" element={<TermsOfServicePage />} />
          <Route path="/politica-de-privacidade" element={<PrivacyPolicyPage />} />

          {/* Rotas administrativas */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/customers" element={<AdminCustomersPage />} />

          {/* Rotas de cliente */}
          <Route path="/cliente/painel" element={<CustomerDashboardPage />} />
          <Route path="/cliente/compras" element={<PurchaseHistoryPage />} />

          {/* Página 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AppProviders>
  );
}

export default App;
