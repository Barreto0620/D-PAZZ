import React from 'react';
import { Helmet } from 'react-helmet';
import { CustomerLayout } from '../components/Customer/CustomerLayout';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Package, Truck, CheckCircle, Eye, Download, Calendar } from 'lucide-react';

export const PurchaseHistoryPage: React.FC = () => {
  useProtectedRoute();

  // Mock purchase history data
  const purchases = [
    {
      id: '#12345',
      date: '15/03/2025',
      status: 'delivered',
      total: 299.99,
      items: [
        { name: 'Smartphone Premium XS', quantity: 1, price: 299.99 }
      ],
      estimatedDelivery: '20/03/2025'
    },
    {
      id: '#12344',
      date: '10/03/2025',
      status: 'shipped',
      total: 159.90,
      items: [
        { name: 'Fones de Ouvido Bluetooth', quantity: 1, price: 159.90 }
      ],
      estimatedDelivery: '25/03/2025'
    },
    {
      id: '#12343',
      date: '05/03/2025',
      status: 'processing',
      total: 89.90,
      items: [
        { name: 'Carregador Wireless', quantity: 1, price: 89.90 }
      ],
      estimatedDelivery: '30/03/2025'
    }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'delivered':
        return {
          label: 'Entregue',
          icon: CheckCircle,
          color: 'text-green-700 bg-green-100 dark:bg-green-900 dark:bg-opacity-20 border border-green-200',
          gradient: 'from-green-700 to-green-600'
        };
      case 'shipped':
        return {
          label: 'Em Trânsito',
          icon: Truck,
          color: 'text-blue-900 bg-blue-100 dark:bg-blue-900 dark:bg-opacity-20 border border-blue-200',
          gradient: 'from-blue-900 to-blue-800'
        };
      default:
        return {
          label: 'Processando',
          icon: Package,
          color: 'text-red-700 bg-red-100 dark:bg-red-900 dark:bg-opacity-20 border border-red-200',
          gradient: 'from-red-700 to-red-600'
        };
    }
  };

  return (
    <>
      <Helmet>
        <title>Histórico de Compras - ImportShop</title>
        <meta name="description" content="Seu histórico de compras na ImportShop." />
      </Helmet>
      
      <CustomerLayout title="Histórico de Compras">
        {/* Header Section */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-900 to-red-700 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Suas Compras 📦
              </h2>
              <p className="opacity-90">
                Acompanhe o status dos seus pedidos
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-yellow-500 bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-yellow-400">
                <Package size={32} className="text-yellow-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Purchases List */}
        <div className="space-y-6">
          {purchases.map((purchase, index) => {
            const status = getStatusInfo(purchase.status);
            const StatusIcon = status.icon;

            return (
              <div 
                key={purchase.id}
                className="group bg-white dark:bg-dark-lighter rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Purchase Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-yellow-50 dark:from-blue-900 dark:to-yellow-900 dark:from-opacity-10 dark:to-opacity-10">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${status.gradient} rounded-xl flex items-center justify-center shadow-lg border border-yellow-300 border-opacity-30`}>
                        <StatusIcon size={24} className="text-yellow-100" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-dark dark:text-white">
                          Pedido {purchase.id}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2">
                          <Calendar size={14} />
                          <span>Realizado em {purchase.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${status.color} font-medium shadow-lg`}>
                        <StatusIcon size={16} />
                        <span className="text-sm">{status.label}</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="p-2 bg-blue-900 hover:bg-blue-800 text-yellow-300 rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg border border-yellow-400 border-opacity-30">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 bg-green-700 hover:bg-green-600 text-yellow-100 rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg border border-yellow-400 border-opacity-30">
                          <Download size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Purchase Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {purchase.items.map((item, itemIndex) => (
                      <div 
                        key={itemIndex} 
                        className="flex justify-between items-center p-4 bg-gray-50 dark:bg-dark-light rounded-xl hover:bg-gray-100 dark:hover:bg-dark transition-all duration-300"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-900 to-red-700 rounded-lg flex items-center justify-center shadow-lg border border-yellow-400 border-opacity-30">
                            <Package size={20} className="text-yellow-300" />
                          </div>
                          <div>
                            <p className="text-dark dark:text-white font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Quantidade: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-dark dark:text-white font-bold text-lg">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Order Summary */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                      <div className="flex items-center space-x-6">
                        {purchase.status !== 'delivered' && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-medium">Previsão de entrega:</span>
                            <br />
                            <span className="text-blue-900 dark:text-blue-300 font-bold">
                              {purchase.estimatedDelivery}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <span className="text-sm text-gray-500 dark:text-gray-400 block">Total do Pedido</span>
                        <span className="text-2xl font-bold text-dark dark:text-white">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(purchase.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                    {/* Progress Bar for non-delivered orders */}
                    {purchase.status !== 'delivered' && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-yellow-50 dark:from-blue-900 dark:from-opacity-20 dark:to-yellow-900 dark:to-opacity-20 rounded-xl border border-yellow-200 dark:border-yellow-700 border-opacity-50">
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">
                          <span>Processando</span>
                          <span>Em Trânsito</span>
                          <span>Entregue</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
                          <div 
                            className={`h-3 rounded-full transition-all duration-1000 shadow-lg ${
                              purchase.status === 'processing' 
                                ? 'w-1/3 bg-gradient-to-r from-red-600 to-red-500' 
                                : purchase.status === 'shipped'
                                ? 'w-2/3 bg-gradient-to-r from-blue-800 to-blue-700'
                                : 'w-full bg-gradient-to-r from-green-600 to-green-500'
                            }`}
                          ></div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State (if no purchases) */}
        {purchases.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-dark dark:text-white mb-2">
              Nenhuma compra encontrada
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Você ainda não realizou nenhuma compra.
            </p>
          </div>
        )}
      </CustomerLayout>
    </>
  );
};