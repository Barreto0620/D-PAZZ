// project/src/pages/AdminOrdersPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { AdminLayout } from '../components/Admin/AdminLayout';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Toast } from '../components/Toast';
import { Order } from '../types';
import { getOrders, updateOrderStatus, deleteOrder } from '../services/api';
import { CheckCircle, XCircle, Package, Search, Trash2, AlertTriangle, Eye } from 'lucide-react'; // Adicionado Eye para o estado vazio

// Modal de confirmação para exclusão
const DeleteConfirmationModal: React.FC<{
  isOpen: boolean;
  orderId: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}> = ({ isOpen, orderId, onConfirm, onCancel, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-lighter rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Confirmar Exclusão
            </h3>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            Tem certeza que deseja excluir o pedido:
          </p>
          <p className="font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-2 rounded">
            "{orderId}"
          </p>
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">
            Esta ação não pode ser desfeita.
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Excluindo...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Excluir
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminOrdersPage: React.FC = () => {
  const { authLoading } = useProtectedRoute(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  // Estados para o modal de exclusão
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    orderId: string | null;
    isDeleting: boolean;
  }>({
    isOpen: false,
    orderId: null,
    isDeleting: false
  });

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      // Dados de exemplo se a API não estiver pronta, remova isso quando integrar com a API real
      const mockOrders: Order[] = [
        { id: 'ORD001', userId: 'user123', total: 150.75, status: 'pending', createdAt: '2025-06-10T10:00:00Z', items: [{productId: 1, quantity: 1, price: 150.75, name: 'Produto A'}] },
        { id: 'ORD002', userId: 'user124', total: 300.00, status: 'processing', createdAt: '2025-06-11T11:30:00Z', items: [{productId: 2, quantity: 2, price: 150.00, name: 'Produto B'}] },
        { id: 'ORD003', userId: 'user125', total: 75.20, status: 'delivered', createdAt: '2025-06-12T14:45:00Z', items: [{productId: 3, quantity: 1, price: 75.20, name: 'Produto C'}] },
        { id: 'ORD004', userId: 'user123', total: 50.00, status: 'shipped', createdAt: '2025-06-13T09:15:00Z', items: [{productId: 4, quantity: 1, price: 50.00, name: 'Produto D'}] },
        { id: 'ORD005', userId: 'user126', total: 420.50, status: 'cancelled', createdAt: '2025-06-14T16:00:00Z', items: [{productId: 5, quantity: 1, price: 420.50, name: 'Produto E'}] },
      ];
      // const data = await getOrders(); // Descomente esta linha e remova a de mockOrders quando tiver a API
      const data = mockOrders; // Use mockOrders por enquanto
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showToast('Erro ao carregar pedidos', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (!authLoading) {
      fetchOrders();
    }
  }, [authLoading, fetchOrders]);

  // Efeito para filtrar pedidos quando searchTerm ou orders mudam
  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase().trim();

    if (!lowercasedSearchTerm) {
      setFilteredOrders(orders);
      return;
    }

    const results = orders.filter(order =>
      order.id.toLowerCase().includes(lowercasedSearchTerm) ||
      order.userId.toLowerCase().includes(lowercasedSearchTerm) ||
      getStatusDisplayName(order.status).toLowerCase().includes(lowercasedSearchTerm) ||
      order.items.some(item => item.name.toLowerCase().includes(lowercasedSearchTerm)) // Permite pesquisa por nome do produto
    );
    setFilteredOrders(results);
  }, [searchTerm, orders]);

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      // await updateOrderStatus(orderId, newStatus); // Descomente quando integrar com a API
      setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
      showToast(`Status do pedido ${orderId} atualizado para ${getStatusDisplayName(newStatus)}`, 'success');
    } catch (error) {
      console.error('Error updating order status:', error);
      showToast('Erro ao atualizar status do pedido', 'error');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    setDeleteModal({
      isOpen: true,
      orderId,
      isDeleting: false
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.orderId) return;

    setDeleteModal(prev => ({ ...prev, isDeleting: true }));

    try {
      // await deleteOrder(deleteModal.orderId); // Descomente quando integrar com a API
      setOrders(prev => prev.filter(order => order.id !== deleteModal.orderId));
      setDeleteModal({
        isOpen: false,
        orderId: null,
        isDeleting: false
      });
      showToast(`Pedido ${deleteModal.orderId} excluído com sucesso! 🗑️`, 'success');
    } catch (error) {
      console.error('Error deleting order:', error);
      showToast('Erro ao excluir pedido', 'error');
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const cancelDelete = () => {
    setDeleteModal({
      isOpen: false,
      orderId: null,
      isDeleting: false
    });
  };

  const getStatusClasses = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'; // Alterado para dark:bg-yellow-900/20
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'; // Alterado para dark:bg-blue-900/20
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400'; // Alterado para dark:bg-indigo-900/20
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'; // Alterado para dark:bg-green-900/20
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'; // Alterado para dark:bg-red-900/20
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusDisplayName = (status: Order['status']): string => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'processing': return 'Processando';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
      default: return 'Desconhecido';
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
        <Helmet>
          <title>Carregando - Pedidos - Dashboard Admin</title>
        </Helmet>
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
            Lista de Pedidos ({filteredOrders.length})
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

        {loading ? (
          <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-md h-64 flex items-center justify-center">
            <div className="animate-pulse text-gray-400 dark:text-gray-500">
              Carregando pedidos...
            </div>
          </div>
        ) : filteredOrders.length === 0 && searchTerm ? (
          <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-md p-8 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Search size={48} className="mx-auto mb-2" />
              <h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3>
              <p>Não encontramos pedidos que correspondam à sua pesquisa "{searchTerm}".</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors"
              >
                Limpar pesquisa
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full"> {/* Removido min-w-full para consistência com DataTable */}
                <thead className="bg-gray-50 dark:bg-gray-800"> {/* Consistente com DataTable */}
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
                    {/* Coluna Ações com destaque especial */}
                    <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 shadow-lg">
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        Ações
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-dark-lighter divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8">
                        <div className="text-gray-400 dark:text-gray-500">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <Eye size={24} />
                          </div>
                          <h3 className="text-lg font-semibold mb-2">Nenhum pedido cadastrado</h3>
                          <p>Nenhum pedido para exibir no momento.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order, index) => (
                      <tr
                        key={order.id}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                          index % 2 === 0 ? 'bg-white dark:bg-dark-lighter' : 'bg-gray-25 dark:bg-gray-900/20'
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {order.userId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(order.status)}`}>
                            {getStatusDisplayName(order.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }).replace(', ', ' às ')}
                        </td>
                        {/* Coluna Ações com fundo destacado */}
                        <td className="px-6 py-4 whitespace-nowrap text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 border-l-2 border-blue-200 dark:border-blue-700">
                          <div className="flex items-center justify-center space-x-2">
                            <select
                              onChange={(e) => handleUpdateStatus(order.id, e.target.value as Order['status'])}
                              value={order.status}
                              className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-colors"
                            >
                              <option value="pending">Pendente</option>
                              <option value="processing">Processando</option>
                              <option value="shipped">Enviado</option>
                              <option value="delivered">Entregue</option>
                              <option value="cancelled">Cancelado</option>
                            </select>
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              className="group relative p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 transform hover:scale-105"
                              title="Excluir Pedido"
                            >
                              <Trash2 size={16} />
                              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                Excluir
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Rodapé da tabela */}
            <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Mostrando <span className="font-medium">{filteredOrders.length}</span> pedido(s)
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  Use os botões de ação para gerenciar seus pedidos
                </div>
              </div>
            </div>
          </div>
        )}

        <DeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          orderId={deleteModal.orderId || ''}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          isDeleting={deleteModal.isDeleting}
        />
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