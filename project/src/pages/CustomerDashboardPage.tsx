import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { ShoppingBag, Heart, User, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { CustomerLayout } from '../components/Customer/CustomerLayout';
import { StatsCard } from '../components/Admin/StatsCard';
import { Toast } from '../components/Toast';

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
    // Here you would typically update the user data through an API
    // For demo purposes, we'll just show a success message
    setShowToast(true);
    setIsEditing(false);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      <Helmet>
        <title>Minha Conta - ImportShop</title>
        <meta name="description" content="Gerencie sua conta e pedidos na ImportShop." />
      </Helmet>
      
      <CustomerLayout title="Minha Conta">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard 
            title="Compras Realizadas" 
            value="5" 
            icon={<ShoppingBag size={24} />}
            color="border-primary text-primary"
          />
          
          <StatsCard 
            title="Favoritos" 
            value="8" 
            icon={<Heart size={24} />}
            color="border-error text-error"
          />
          
          <StatsCard 
            title="Último Acesso" 
            value="Hoje" 
            icon={<User size={24} />}
            color="border-success text-success"
          />
        </div>
        
        {/* Profile Info */}
        <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-dark dark:text-white">
              Informações Pessoais
            </h2>
            
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-primary hover:bg-secondary text-dark rounded-lg transition-colors"
              >
                Editar
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Nome Completo
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-light text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="text-dark dark:text-white">{formData.name || 'Não informado'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-light text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="text-dark dark:text-white">{formData.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                  CPF
                </label>
                <p className="text-dark dark:text-white">{formData.cpf || 'Não informado'}</p>
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Telefone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-light text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="text-dark dark:text-white">{formData.phone || 'Não informado'}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Endereço
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-light text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="text-dark dark:text-white">{formData.address || 'Não informado'}</p>
                )}
              </div>
            </div>
            
            {isEditing && (
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-dark dark:text-white rounded-lg hover:bg-light-darker dark:hover:bg-dark-light transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <X size={18} />
                    Cancelar
                  </span>
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-secondary text-dark rounded-lg transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Save size={18} />
                    Salvar
                  </span>
                </button>
              </div>
            )}
          </form>
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