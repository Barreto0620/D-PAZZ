import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, Heart, User, Save, X, Edit3, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { CustomerLayout } from '../components/Customer/CustomerLayout';
import { Toast } from '../components/Toast';

// Componente StatsCard aprimorado
const EnhancedStatsCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  trend?: string;
}> = ({ title, value, icon, color, gradient, trend }) => (
  <div className="group relative overflow-hidden">
    <div className={`bg-gradient-to-br ${gradient} p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-opacity-20 ${color}`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white"></div>
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-white bg-opacity-20 backdrop-blur-sm ${color} group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          {trend && (
            <div className="flex items-center text-xs text-white bg-white bg-opacity-20 rounded-full px-2 py-1">
              <TrendingUp size={12} className="mr-1" />
              {trend}
            </div>
          )}
        </div>
        
        <div className="text-white">
          <h3 className="text-2xl font-bold mb-1 transform group-hover:scale-105 transition-transform duration-300">
            {value}
          </h3>
          <p className="text-sm opacity-90">{title}</p>
        </div>
        
        {/* Animated border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
      </div>
    </div>
  </div>
);

export const CustomerDashboardPage: React.FC = () => {
  useProtectedRoute();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    cpf: user?.cpf || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowToast(true);
    setIsEditing(false);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <>
      <Helmet>
        <title>Minha Conta - ImportShop</title>
        <meta name="description" content="Gerencie sua conta e pedidos na ImportShop." />
      </Helmet>
      
      <CustomerLayout title="Minha Conta">
        {/* Welcome Section */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-900 to-red-700 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Bem-vindo, {user?.name?.split(' ')[0] || 'Cliente'}! 👋
              </h2>
              <p className="opacity-90">
                Gerencie sua conta e acompanhe seus pedidos
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-yellow-500 bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-yellow-400">
                <User size={32} className="text-yellow-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <EnhancedStatsCard 
            title="Compras Realizadas" 
            value="5" 
            icon={<ShoppingBag size={24} />}
            color="text-blue-900"
            gradient="from-blue-900 to-blue-800"
            trend="+12%"
          />
          
          <EnhancedStatsCard 
            title="Favoritos" 
            value="8" 
            icon={<Heart size={24} />}
            color="text-red-700"
            gradient="from-red-700 to-red-600"
            trend="+3"
          />
          
          <EnhancedStatsCard 
            title="Último Acesso" 
            value="Hoje" 
            icon={<Calendar size={24} />}
            color="text-green-700"
            gradient="from-green-700 to-green-600"
          />
        </div>
        
        {/* Enhanced Profile Info */}
        <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-lg overflow-hidden transform hover:shadow-xl transition-all duration-300">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-50 to-yellow-50 dark:from-blue-900 dark:to-yellow-900 dark:from-opacity-20 dark:to-opacity-20 p-6 border-b border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-900 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                  <User size={24} className="text-yellow-300" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-dark dark:text-white">
                    Informações Pessoais
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Gerencie seus dados pessoais
                  </p>
                </div>
              </div>
              
              {!isEditing && (
                <button 
                  onClick={handleEditToggle}
                  className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-yellow-300 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-yellow-400 border-opacity-30"
                >
                  <Edit3 size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                  <span className="font-medium">Editar</span>
                </button>
              )}
            </div>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome Completo */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 group-focus-within:text-blue-900 transition-colors">
                    Nome Completo
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-light text-dark dark:text-white focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900 focus:ring-opacity-20 transition-all duration-300"
                      placeholder="Digite seu nome completo"
                    />
                  ) : (
                    <div className="p-4 bg-gray-50 dark:bg-dark-light rounded-xl border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300">
                      <p className="text-dark dark:text-white font-medium">
                        {formData.name || 'Não informado'}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Email */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 group-focus-within:text-blue-500 transition-colors">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-light text-dark dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-300"
                      placeholder="Digite seu email"
                    />
                  ) : (
                    <div className="p-4 bg-gray-50 dark:bg-dark-light rounded-xl border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300">
                      <p className="text-dark dark:text-white font-medium">{formData.email}</p>
                    </div>
                  )}
                </div>
                
                {/* CPF */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    CPF
                  </label>
                  <div className="p-4 bg-gray-50 dark:bg-dark-light rounded-xl border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300">
                    <p className="text-dark dark:text-white font-medium">
                      {formData.cpf || 'Não informado'}
                    </p>
                  </div>
                </div>
                
                {/* Telefone */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 group-focus-within:text-blue-500 transition-colors">
                    Telefone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-light text-dark dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-300"
                      placeholder="Digite seu telefone"
                    />
                  ) : (
                    <div className="p-4 bg-gray-50 dark:bg-dark-light rounded-xl border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300">
                      <p className="text-dark dark:text-white font-medium">
                        {formData.phone || 'Não informado'}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Endereço */}
                <div className="md:col-span-2 group">
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 group-focus-within:text-blue-500 transition-colors">
                    Endereço
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-light text-dark dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-300"
                      placeholder="Digite seu endereço completo"
                    />
                  ) : (
                    <div className="p-4 bg-gray-50 dark:bg-dark-light rounded-xl border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300">
                      <p className="text-dark dark:text-white font-medium">
                        {formData.address || 'Não informado'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {isEditing && (
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="group flex items-center space-x-2 px-6 py-3 border-2 border-red-600 dark:border-red-500 text-red-700 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105"
                  >
                    <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span className="font-medium">Cancelar</span>
                  </button>
                  <button
                    type="submit"
                    className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-yellow-100 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-yellow-400 border-opacity-30"
                  >
                    <Save size={18} className="group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium">Salvar</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </CustomerLayout>

      {showToast && (
        <Toast
          message="Informações atualizadas com sucesso!"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};