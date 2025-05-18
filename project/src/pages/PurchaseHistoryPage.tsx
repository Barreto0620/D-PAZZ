import React from 'react';
import { Helmet } from 'react-helmet';
import { CustomerLayout } from '../components/Customer/CustomerLayout';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Package, Truck, CheckCircle } from 'lucide-react';

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
      ]
    },
    {
      id: '#12344',
      date: '10/03/2025',
      status: 'shipped',
      total: 159.90,
      items: [
        { name: 'Fones de Ouvido Bluetooth', quantity: 1, price: 159.90 }
      ]
    }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'delivered':
        return {
          label: 'Entregue',
          icon: CheckCircle,
          color: 'text-success bg-success/10'
        };
      case 'shipped':
        return {
          label: 'Em Trânsito',
          icon: Truck,
          color: 'text-warning bg-warning/10'
        };
      default:
        return {
          label: 'Processando',
          icon: Package,
          color: 'text-primary bg-primary/10'
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
        <div className="space-y-6">
          {purchases.map(purchase => {
            const status = getStatusInfo(purchase.status);
            const StatusIcon = status.icon;

            return (
              <div 
                key={purchase.id}
                className="bg-white dark:bg-dark-lighter rounded-2xl shadow-md overflow-hidden"
              >
                {/* Purchase Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-medium text-dark dark:text-white">
                        Pedido {purchase.id}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Realizado em {purchase.date}
                      </p>
                    </div>
                    
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.color}`}>
                      <StatusIcon size={16} />
                      <span className="text-sm font-medium">{status.label}</span>
                    </div>
                  </div>
                </div>
                
                {/* Purchase Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {purchase.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="text-dark dark:text-white">{item.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Quantidade: {item.quantity}
                          </p>
                        </div>
                        <p className="text-dark dark:text-white font-medium">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-dark dark:text-white">Total</span>
                      <span className="text-lg font-bold text-dark dark:text-white">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(purchase.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CustomerLayout>
    </>
  );
};