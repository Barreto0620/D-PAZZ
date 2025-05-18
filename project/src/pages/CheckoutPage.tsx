import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useCart } from '../contexts/CartContext';
import { submitOrder } from '../services/api';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CheckoutPage: React.FC = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  
  const subtotal = getCartTotal();
  const shipping = cartItems.length > 0 ? 15.99 : 0;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!customerInfo.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }
    
    if (!customerInfo.address.trim()) {
      newErrors.address = 'Endereço é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || cartItems.length === 0) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call to submit order
      const result = await submitOrder(customerInfo, cartItems);
      
      if (result.success) {
        setOrderSuccess(true);
        setOrderId(result.orderId);
        clearCart(); // Clear cart after successful order
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      setErrors(prev => ({ ...prev, submit: 'Ocorreu um erro ao finalizar o pedido. Tente novamente.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0 && !orderSuccess) {
    navigate('/carrinho');
    return null;
  }

  return (
    <div className="min-h-screen bg-light dark:bg-dark">
      <Helmet>
        <title>Checkout - ImportShop</title>
        <meta name="description" content="Finalize sua compra na ImportShop." />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark dark:text-white">
            Finalizar Compra
          </h1>
        </div>
        
        <AnimatePresence mode="wait">
          {!orderSuccess ? (
            <motion.div 
              key="checkout-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Customer Information Form */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-dark dark:text-white mb-6">
                    Informações do Cliente
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label 
                        htmlFor="name" 
                        className="block text-base font-medium text-text-dark dark:text-text-light mb-2"
                      >
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={customerInfo.name}
                        onChange={handleInputChange}
                        className={`w-full p-3 rounded-lg border ${
                          errors.name 
                            ? 'border-red-500 dark:border-red-500' 
                            : 'border-gray-300 dark:border-gray-700'
                        } bg-white dark:bg-dark-light text-text-dark dark:text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary text-base`}
                        placeholder="Digite seu nome completo"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-error font-medium">{errors.name}</p>
                      )}
                    </div>
                    
                    {/* Email and Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label 
                          htmlFor="email" 
                          className="block text-base font-medium text-text-dark dark:text-text-light mb-2"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={customerInfo.email}
                          onChange={handleInputChange}
                          className={`w-full p-3 rounded-lg border ${
                            errors.email 
                              ? 'border-red-500 dark:border-red-500' 
                              : 'border-gray-300 dark:border-gray-700'
                          } bg-white dark:bg-dark-light text-text-dark dark:text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary text-base`}
                          placeholder="Digite seu email"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-error font-medium">{errors.email}</p>
                        )}
                      </div>
                      
                      <div>
                        <label 
                          htmlFor="phone" 
                          className="block text-base font-medium text-text-dark dark:text-text-light mb-2"
                        >
                          Telefone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={customerInfo.phone}
                          onChange={handleInputChange}
                          className={`w-full p-3 rounded-lg border ${
                            errors.phone 
                              ? 'border-red-500 dark:border-red-500' 
                              : 'border-gray-300 dark:border-gray-700'
                          } bg-white dark:bg-dark-light text-text-dark dark:text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary text-base`}
                          placeholder="Digite seu telefone"
                        />
                        {errors.phone && (
                          <p className="mt-1 text-sm text-error font-medium">{errors.phone}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Address */}
                    <div>
                      <label 
                        htmlFor="address" 
                        className="block text-base font-medium text-text-dark dark:text-text-light mb-2"
                      >
                        Endereço Completo
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={customerInfo.address}
                        onChange={handleInputChange}
                        rows={3}
                        className={`w-full p-3 rounded-lg border ${
                          errors.address 
                            ? 'border-red-500 dark:border-red-500' 
                            : 'border-gray-300 dark:border-gray-700'
                        } bg-white dark:bg-dark-light text-text-dark dark:text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary text-base`}
                        placeholder="Digite seu endereço completo"
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-error font-medium">{errors.address}</p>
                      )}
                    </div>
                    
                    {/* Submit error */}
                    {errors.submit && (
                      <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertCircle size={18} />
                          <p>{errors.submit}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between pt-4">
                      <Link 
                        to="/carrinho"
                        className="flex items-center gap-2 text-primary hover:text-secondary transition-colors"
                      >
                        <ArrowLeft size={18} />
                        <span>Voltar ao Carrinho</span>
                      </Link>
                      
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-primary hover:bg-secondary text-dark rounded-lg font-medium transition-colors disabled:opacity-70"
                      >
                        {isSubmitting ? 'Processando...' : 'Confirmar Pedido'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-dark dark:text-white mb-6">
                    Resumo do Pedido
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    {/* Item list */}
                    <div className="space-y-3 mb-4">
                      {cartItems.map(item => (
                        <div key={item.product.id} className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm bg-light-darker dark:bg-dark-light rounded-full h-5 w-5 flex items-center justify-center">
                              {item.quantity}
                            </span>
                            <span className="text-gray-600 dark:text-gray-300 truncate max-w-[200px]">
                              {item.product.name}
                            </span>
                          </div>
                          <span className="text-dark dark:text-white">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                        <span className="text-dark dark:text-white">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between mt-2">
                        <span className="text-gray-600 dark:text-gray-300">Frete</span>
                        <span className="text-dark dark:text-white">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(shipping)}
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
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="order-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white dark:bg-dark-lighter rounded-2xl shadow-md p-8 max-w-lg mx-auto text-center"
            >
              <div className="flex justify-center mb-4">
                <CheckCircle size={64} className="text-success" />
              </div>
              
              <h2 className="text-2xl font-bold text-dark dark:text-white mb-2">
                Pedido Recebido!
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Seu pedido #{orderId} foi recebido com sucesso. Você receberá um email de confirmação em breve.
              </p>
              
              <div className="bg-light-darker dark:bg-dark-light rounded-lg p-4 mb-6">
                <p className="text-dark dark:text-white">
                  Total do Pedido: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                </p>
              </div>
              
              <Link 
                to="/"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-dark px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Continuar Comprando
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <Footer />
    </div>
  );
};