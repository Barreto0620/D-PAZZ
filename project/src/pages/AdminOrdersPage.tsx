// project/src/pages/AdminOrdersPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { AdminLayout } from '../components/Admin/AdminLayout';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Toast } from '../components/Toast';
import { Order } from '../types'; // Certifique-se de que sua interface Order está definida em types.ts
import { getOrders, updateOrderStatus, deleteOrder } from '../services/api'; // Você precisará criar essas funções no api.ts
import { Eye, CheckCircle, XCircle, Package, Search } from 'lucide-react'; // Ícones para ações de pedido, Search adicionado
import { motion } from 'framer-motion';

export const AdminOrdersPage: React.FC = () => {
  const { authLoading } = useProtectedRoute(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de pesquisa
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]); // Estado para pedidos filtrados

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      // Dados de exemplo se a API não estiver pronta, remova isso quando integrar com a API real
      const mockOrders: Order[] = [
        { id: 'ORD001', userId: 'user123', total: 150.75, status: 'pending', createdAt: '2025-06-10T10:00:00Z', items: [] },
        { id: 'ORD002', userId: 'user124', total: 300.00, status: 'processing', createdAt: '2025-06-11T11:30:00Z', items: [] },
        { id: 'ORD003', userId: 'user125', total: 75.20, status: 'delivered', createdAt: '2025-06-12T14:45:00Z', items: [] },
        { id: 'ORD004', userId: 'user123', total: 50.00, status: 'shipped', createdAt: '2025-06-13T09:15:00Z', items: [] },
        { id: 'ORD005', userId: 'user126', total: 420.50, status: 'cancelled', createdAt: '2025-06-14T16:00:00Z', items: [] },
      ];
      // const data = await getOrders(); // Descomente esta linha e remova a de mockOrders quando tiver a API
      const data = mockOrders; // Use mockOrders por enquanto
      setOrders(data);
      setFilteredOrders(data); // Inicializa pedidos filtrados com todos os pedidos
    } catch (error) {
      console.error('Error fetching orders:', error);
      showToast('Erro ao carregar pedidos', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      fetchOrders();
    }
  }, [authLoading, fetchOrders]);

  // Efeito para filtrar pedidos quando searchTerm ou orders mudam
  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const results = orders.filter(order =>
      order.id.toLowerCase().includes(lowercasedSearchTerm) ||
      order.userId.toLowerCase().includes(lowercasedSearchTerm) || // Assumindo que userId pode ser usado para pesquisa de cliente
      order.status.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredOrders(results);
  }, [searchTerm, orders]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      // await updateOrderStatus(orderId, newStatus); // Descomente quando integrar com a API
      setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
      showToast(`Status do pedido ${orderId} atualizado para ${newStatus}`, 'success');
    } catch (error) {
      console.error('Error updating order status:', error);
      showToast('Erro ao atualizar status do pedido', 'error');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o pedido ${orderId}?`)) {
      return;
    }
    try {
      // await deleteOrder(orderId); // Descomente quando integrar com a API
      setOrders(prev => prev.filter(order => order.id !== orderId));
      showToast(`Pedido ${orderId} excluído com sucesso`, 'success');
    } catch (error) {
      console.error('Error deleting order:', error);
      showToast('Erro ao excluir pedido', 'error');
    }
  };

  const getStatusClasses = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-darker dark:bg-dark text-dark dark:text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary dark:border-primary-dark mb-4"></div>
          Carregando pedidos...
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Pedidos - Dashboard Admin - D'Pazz Imports</title>
        <meta name="description" content="Gerencie pedidos na sua loja D'Pazz Imports. Visualize, atualize status e exclua pedidos." />
      </Helmet>

      <AdminLayout title="Gerenciar Pedidos">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-dark dark:text-white">
            Lista de Pedidos
          </h2>
          <div className="relative w-full sm:w-auto flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Pesquisar pedidos por ID, cliente ou status..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-light-darker dark:bg-dark-light">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ID do Pedido
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Cliente (ID)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-lighter divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Carregando pedidos...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? ( // Usa filteredOrders
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Nenhum pedido encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => ( // Renderiza filteredOrders
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-light-darker dark:hover:bg-dark-light"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark dark:text-white">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {order.userId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dark dark:text-white">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => console.log('Ver detalhes do pedido:', order.id)}
                            className="p-2 text-primary hover:text-secondary dark:text-primary-dark dark:hover:text-secondary-dark transition-colors rounded-md hover:bg-light-darker dark:hover:bg-dark-light"
                            title="Ver Detalhes"
                          >
                            <Eye size={16} />
                          </button>
                          <select
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value as Order['status'])}
                            value={order.status}
                            className="ml-2 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-dark-light text-dark dark:text-white text-xs focus:ring-primary focus:border-primary"
                          >
                            <option value="pending">Pendente</option>
                            <option value="processing">Processando</option>
                            <option value="shipped">Enviado</option>
                            <option value="delivered">Entregue</option>
                            <option value="cancelled">Cancelado</option>
                          </select>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Excluir Pedido"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};