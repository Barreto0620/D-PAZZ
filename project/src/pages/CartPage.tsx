import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartItem } from '../components/CartItem';
import { useCart } from '../contexts/CartContext';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export const CartPage: React.FC = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  
  const subtotal = getCartTotal();
  // Normally you would calculate shipping based on address or weight
  const shipping = cartItems.length > 0 ? 15.99 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-light dark:bg-dark">
      <Helmet>
        <title>Carrinho de Compras - ImportShop</title>
        <meta name="description" content="Revise os itens no seu carrinho de compras e prossiga para o checkout." />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark dark:text-white">
            Carrinho de Compras
          </h1>
        </div>
        
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                {cartItems.map(item => (
                  <motion.div
                    key={item.product.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.5 }
                      }
                    }}
                  >
                    <CartItem item={item} />
                  </motion.div>
                ))}
              </motion.div>
              
              <div className="flex justify-between items-center mt-6">
                <Link 
                  to="/"
                  className="flex items-center gap-2 text-primary hover:text-secondary transition-colors"
                >
                  <ArrowLeft size={18} />
                  <span>Continuar Comprando</span>
                </Link>
                
                <button 
                  onClick={clearCart}
                  className="text-error hover:text-red-700 transition-colors"
                >
                  Limpar Carrinho
                </button>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-dark dark:text-white mb-6">
                  Resumo do Pedido
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                    <span className="text-dark dark:text-white">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Frete</span>
                    <span className="text-dark dark:text-white">
                      {shipping > 0 
                        ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(shipping)
                        : 'Grátis'
                      }
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <div className="flex justify-between font-bold">
                      <span className="text-dark dark:text-white">Total</span>
                      <span className="text-dark dark:text-white">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Link 
                  to="/checkout"
                  className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-dark py-3 rounded-lg font-medium transition-colors"
                >
                  <ShoppingBag size={20} />
                  <span>Finalizar Compra</span>
                </Link>
                
                {/* Additional info */}
                <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                  <p>Aceitamos os seguintes métodos de pagamento:</p>
                  <p className="mt-2">
                    Cartão de Crédito, PIX, Boleto Bancário
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <ShoppingBag size={64} className="text-gray-300 dark:text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold text-dark dark:text-white mb-2">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Parece que você ainda não adicionou nenhum item ao seu carrinho.
            </p>
            <Link 
              to="/"
              className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-dark px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Continuar Comprando</span>
            </Link>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};