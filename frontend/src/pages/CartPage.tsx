import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartItem } from '../components/CartItem';
import { useCart } from '../contexts/CartContext';
import { ArrowLeft, ShoppingBag, Trash2, Shield, Truck, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

export const CartPage: React.FC = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  
  const subtotal = getCartTotal();
  const shipping = cartItems.length > 0 ? 15.99 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Helmet>
        <title>Carrinho de Compras - ImportShop</title>
        <meta name="description" content="Revise os itens no seu carrinho de compras e prossiga para o checkout." />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <ShoppingBag size={20} className="text-dark" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Carrinho de Compras
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            {cartItems.length > 0 
              ? `${cartItems.reduce((total, item) => total + item.quantity, 0)} ${cartItems.reduce((total, item) => total + item.quantity, 0) === 1 ? 'item' : 'itens'} no seu carrinho`
              : 'Seu carrinho está vazio'
            }
          </p>
        </motion.div>
        
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Cart Items - Scrollable Section */}
            <div className="xl:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Header dos Itens */}
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Seus Produtos
                  </h2>
                </div>
                
                {/* Lista de Produtos com Scroll Fixo */}
                <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
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
                    className="divide-y divide-gray-100 dark:divide-gray-700"
                  >
                    {cartItems.map((item, index) => (
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
                        className="p-6 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                      >
                        <CartItem item={item} />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
                
                {/* Footer dos Itens */}
                <div className="bg-green-50/50 dark:bg-green-900/10 px-6 py-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
                  <Link 
                    to="/"
                    className="flex items-center gap-2 text-primary hover:text-secondary transition-colors font-medium"
                  >
                    <ArrowLeft size={18} />
                    <span>Continuar Comprando</span>
                  </Link>
                  
                  <button 
                    onClick={clearCart}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors font-medium"
                  >
                    <Trash2 size={18} />
                    <span>Limpar Carrinho</span>
                  </button>
                </div>
              </motion.div>
            </div>
            
            {/* Order Summary - Sticky */}
            <div className="xl:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="sticky top-6"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {/* Header do Resumo */}
                  <div className="bg-gradient-to-r from-primary to-secondary p-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Shield size={20} />
                      Resumo do Pedido
                    </h2>
                  </div>
                  
                  <div className="p-6">
                    {/* Valores */}
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 dark:text-gray-300 font-medium">Subtotal</span>
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-2">
                          <Truck size={16} className="text-gray-500" />
                          <span className="text-gray-600 dark:text-gray-300 font-medium">Frete</span>
                        </div>
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          {shipping > 0 
                            ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(shipping)
                            : 'Grátis'
                          }
                        </span>
                      </div>
                      
                      <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-gray-900 dark:text-white">Total</span>
                          <span className="text-2xl font-bold text-primary">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Botão de Checkout */}
                    <Link 
                      to="/checkout"
                      className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <ShoppingBag size={24} />
                      <span>Finalizar Compra</span>
                    </Link>
                    
                    {/* Garantias */}
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <Shield size={16} className="text-green-500" />
                        <span>Compra 100% segura e protegida</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <Truck size={16} className="text-blue-500" />
                        <span>Frete grátis acima de R$ 199</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <CreditCard size={16} className="text-purple-500" />
                        <span>Parcelamento em até 12x sem juros</span>
                      </div>
                    </div>
                    
                    {/* Métodos de Pagamento */}
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Métodos de pagamento aceitos:
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="px-2 py-1 bg-white dark:bg-green-800/30 rounded text-xs font-medium">PIX</span>
                        <span className="px-2 py-1 bg-white dark:bg-green-800/30 rounded text-xs font-medium">Cartão</span>
                        <span className="px-2 py-1 bg-white dark:bg-green-800/30 rounded text-xs font-medium">Boleto</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 p-8 text-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                  className="flex justify-center mb-6"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
                    <ShoppingBag size={40} className="text-white" />
                  </div>
                </motion.div>
                
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Seu carrinho está vazio
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
                  Que tal dar uma olhada nos nossos produtos incríveis?
                </p>
                
                <Link 
                  to="/"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <ArrowLeft size={20} />
                  <span>Explorar Produtos</span>
                </Link>
              </div>
              
              {/* Seção de benefícios */}
              <div className="p-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                  Por que comprar conosco?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield size={20} className="text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Compra Segura</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Proteção total em todas as transações</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Truck size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Entrega Rápida</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Receba seus produtos rapidamente</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CreditCard size={20} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Facilidade</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Parcele em até 12x sem juros</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
      
      <Footer />
      
      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 3px;
        }
        .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
          background-color: #4b5563;
          border-radius: 3px;
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: #9ca3af;
        }
      `}</style>
    </div>
  );
};