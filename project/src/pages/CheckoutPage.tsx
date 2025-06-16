import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useCart } from '../contexts/CartContext';
import { submitOrder } from '../services/api';
import { ArrowLeft, CheckCircle, AlertCircle, ShoppingBag, Truck, CreditCard, Shield } from 'lucide-react';
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
  const [finalOrderTotal, setFinalOrderTotal] = useState<number>(0); // New state to store the total

  const subtotal = getCartTotal();
  const shipping = cartItems.length > 0 ? 15.99 : 0;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
    // Clear error when field is being edited
    if (errors[name]) { // Corrected: access dynamically using [name]
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name]; // Corrected: delete dynamically using [name]
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
      // Store the current total *before* clearing the cart
      setFinalOrderTotal(total);

      // Simulate API call to submit order
      const result = await submitOrder(customerInfo, cartItems);

      if (result?.success) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Helmet>
        <title>Checkout - ImportShop</title>
        <meta name="description" content="Finalize sua compra na ImportShop." />
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
              <CheckCircle size={20} className="text-gray-900" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              Finalizar Compra
            </h1>
          </div>
          <p className="text-gray-300">
            Preencha seus dados para concluir seu pedido.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!orderSuccess ? (
            <motion.div
              key="checkout-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 xl:grid-cols-3 gap-8"
            >
              {/* Customer Information Form */}
              <div className="xl:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden"
                >
                  {/* Header do Formulário */}
                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-4 border-b border-gray-700">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Shield size={20} /> Informações do Cliente
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-base font-medium text-gray-200 mb-2"
                      >
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={customerInfo.name}
                        onChange={handleInputChange}
                        className={`w-full p-3 rounded-lg border ${errors.name
                          ? 'border-red-500'
                          : 'border-gray-700'
                        } bg-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary text-base transition-colors duration-200`}
                        placeholder="Digite seu nome completo"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-400 font-medium">{errors.name}</p>
                      )}
                    </div>

                    {/* Email and Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-base font-medium text-gray-200 mb-2"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={customerInfo.email}
                          onChange={handleInputChange}
                          className={`w-full p-3 rounded-lg border ${errors.email
                            ? 'border-red-500'
                            : 'border-gray-700'
                          } bg-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary text-base transition-colors duration-200`}
                          placeholder="Digite seu email"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-400 font-medium">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-base font-medium text-gray-200 mb-2"
                        >
                          Telefone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={customerInfo.phone}
                          onChange={handleInputChange}
                          className={`w-full p-3 rounded-lg border ${errors.phone
                            ? 'border-red-500'
                            : 'border-gray-700'
                          } bg-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary text-base transition-colors duration-200`}
                          placeholder="Digite seu telefone"
                        />
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-400 font-medium">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label
                        htmlFor="address"
                        className="block text-base font-medium text-gray-200 mb-2"
                      >
                        Endereço Completo
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={customerInfo.address}
                        onChange={handleInputChange}
                        rows={3}
                        className={`w-full p-3 rounded-lg border ${errors.address
                          ? 'border-red-500'
                          : 'border-gray-700'
                        } bg-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary text-base transition-colors duration-200`}
                        placeholder="Digite seu endereço completo"
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-400 font-medium">{errors.address}</p>
                      )}
                    </div>

                    {/* Submit error */}
                    {errors.submit && (
                      <div className="p-3 bg-red-900/20 text-red-400 rounded-lg flex items-center gap-2">
                        <AlertCircle size={18} />
                        <p className="text-sm font-medium">{errors.submit}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4">
                      <Link
                        to="/carrinho"
                        className="inline-flex items-center gap-2 text-gray-300 hover:text-primary transition-colors font-medium"
                      >
                        <ArrowLeft size={18} />
                        <span>Voltar ao Carrinho</span>
                      </Link>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Processando...' : 'Confirmar Pedido'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>

              {/* Order Summary */}
              <div className="xl:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="sticky top-6"
                >
                  <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
                    {/* Header do Resumo */}
                    <div className="bg-gradient-to-r from-primary to-secondary p-6">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <ShoppingBag size={20} /> Resumo do Pedido
                      </h2>
                    </div>

                    <div className="p-6">
                      {/* Item list */}
                      <div className="space-y-3 mb-4 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                        {cartItems.map(item => (
                          <div key={item.product.id} className="flex justify-between items-center py-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm bg-gray-700 rounded-full h-6 w-6 flex items-center justify-center text-gray-300 font-medium">
                                {item.quantity}
                              </span>
                              <span className="text-gray-200 truncate max-w-[180px]">
                                {item.product.name}
                              </span>
                            </div>
                            <span className="text-white font-semibold">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-gray-700 pt-4">
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-300 font-medium">Subtotal</span>
                          <span className="text-lg font-semibold text-white">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-2">
                          <div className="flex items-center gap-2">
                            <Truck size={16} className="text-gray-400" />
                            <span className="text-gray-300 font-medium">Frete</span>
                          </div>
                          <span className="text-lg font-semibold text-white">
                            {shipping > 0
                              ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(shipping)
                              : 'Grátis'
                            }
                          </span>
                        </div>

                        <div className="border-t-2 border-gray-700 pt-4 mt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-white">Total</span>
                            <span className="text-2xl font-bold text-primary">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Garantias */}
                      <div className="mt-6 space-y-3">
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                          <Shield size={16} className="text-green-500" />
                          <span>Compra 100% segura e protegida</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                          <Truck size={16} className="text-blue-500" />
                          <span>Frete grátis acima de R$ 199</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                          <CreditCard size={16} className="text-purple-500" />
                          <span>Parcelamento em até 12x sem juros</span>
                        </div>
                      </div>

                      {/* Métodos de Pagamento */}
                      <div className="mt-6 p-4 bg-green-900/20 rounded-xl">
                        <p className="text-sm font-medium text-gray-300 mb-2">
                          Métodos de pagamento aceitos:
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span className="px-2 py-1 bg-green-800/30 rounded text-xs font-medium">PIX</span>
                          <span className="px-2 py-1 bg-green-800/30 rounded text-xs font-medium">Cartão</span>
                          <span className="px-2 py-1 bg-green-800/30 rounded text-xs font-medium">Boleto</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="order-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-gray-800 rounded-3xl shadow-xl border border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-8 text-center">
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
                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle size={40} className="text-white" />
                    </div>
                  </motion.div>

                  <h2 className="text-2xl font-bold text-white mb-3">
                    Pedido Recebido!
                  </h2>

                  <p className="text-gray-300 mb-4 text-lg">
                    Seu pedido <span className="font-bold text-primary">#{orderId}</span> foi recebido com sucesso. Você receberá um email de confirmação em breve.
                  </p>

                  <div className="bg-gray-700 rounded-xl p-4 mb-6">
                    <p className="text-white text-lg font-semibold">
                      Total do Pedido: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finalOrderTotal)} {/* Use finalOrderTotal here */}
                    </p>
                  </div>

                  <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <ArrowLeft size={20} />
                    <span>Continuar Comprando</span>
                  </Link>
                </div>

                {/* Seção de benefícios - Copied from CartPage */}
                <div className="p-8">
                  <h3 className="text-lg font-semibold text-white mb-4 text-center">
                    O que acontece agora?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Shield size={20} className="text-green-400" />
                      </div>
                      <h4 className="font-medium text-white mb-1">Confirmação</h4>
                      <p className="text-sm text-gray-300">Você receberá um email com os detalhes do pedido.</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Truck size={20} className="text-blue-400" />
                      </div>
                      <h4 className="font-medium text-white mb-1">Envio</h4>
                      <p className="text-sm text-gray-300">Preparemos seu pedido para envio em breve.</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CreditCard size={20} className="text-purple-400" />
                      </div>
                      <h4 className="font-medium text-white mb-1">Acompanhamento</h4>
                      <p className="text-sm text-gray-300">Notificaremos você sobre o status de entrega.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: #4b5563; /* Darker thumb for dark theme */
          border-radius: 3px;
        }
        .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
          background-color: #6b7280; /* Lighter thumb for hover in dark theme */
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