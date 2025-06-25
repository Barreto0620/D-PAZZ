// project/src/pages/AdminCustomersPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Trash2, XCircle, AlertTriangle, Eye } from 'lucide-react'; // Adicionado Eye para o estado vazio
import { AdminLayout } from '../components/Admin/AdminLayout';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Toast } from '../components/Toast';
import { User } from '../types';
import { getUsers, deleteUser } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

// Modal de confirmação para exclusão
const DeleteConfirmationModal: React.FC<{
  isOpen: boolean;
  customerId: string;
  customerName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}> = ({ isOpen, customerId, customerName, onConfirm, onCancel, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
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
            Tem certeza que deseja excluir o cliente:
          </p>
          <p className="font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-2 rounded">
            "{customerName}" (ID: {customerId})
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
    </motion.div>
  );
};


export const AdminCustomersPage: React.FC = () => {
  const { authLoading } = useProtectedRoute(true);
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<User[]>([]);

  // Estados para o modal de exclusão
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    customerId: string | null;
    customerName: string;
    isDeleting: boolean;
  }>({
    isOpen: false,
    customerId: null,
    customerName: '',
    isDeleting: false
  });


  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      // Usando mockUsers temporariamente. Descomente a linha abaixo quando integrar com a API real.
      // const data: User[] = await getUsers();
      const mockUsers: User[] = [
        { id: 'usr001', name: 'Alice Smith', email: 'alice.s@example.com', role: 'customer', createdAt: '2024-01-10T10:00:00Z', phone: '(11) 91234-5678', address: 'Rua A, 123', cpf: '123.456.789-00' },
        { id: 'usr002', name: 'Bob Johnson', email: 'bob.j@example.com', role: 'customer', createdAt: '2024-02-15T11:30:00Z', phone: '(21) 98765-4321', address: 'Av. B, 456', cpf: '987.654.321-00' },
        { id: 'usr003', name: 'Charlie Brown', email: 'charlie.b@example.com', role: 'customer', createdAt: '2024-03-20T14:45:00Z', phone: '(31) 99123-4567', address: 'Praça C, 789', cpf: '456.789.123-00' },
        { id: 'usr004', name: 'Diana Prince', email: 'diana.p@example.com', role: 'customer', createdAt: '2024-04-01T09:15:00Z', phone: '(41) 97654-3210', address: 'Travessa D, 101', cpf: '789.123.456-00' },
      ];
      const data: User[] = mockUsers;
      setCustomers(data);
      setFilteredCustomers(data); // Inicializa clientes filtrados com todos os clientes
    } catch (error) {
      console.error('Error fetching customers:', error);
      showToast('Erro ao carregar clientes', 'error');
      setCustomers([]);
      setFilteredCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (!authLoading) {
      fetchCustomers();
    }
  }, [authLoading, fetchCustomers]);

  useEffect(() => {
    console.log('Filtering customers. Search term:', searchTerm, 'Total customers:', customers.length);
    const lowercasedSearchTerm = searchTerm.toLowerCase().trim();

    if (lowercasedSearchTerm === '') {
      setFilteredCustomers(customers);
      return;
    }

    const results = customers.filter(customer => {
      const nameMatch = customer.name.toLowerCase().includes(lowercasedSearchTerm);
      const emailMatch = customer.email.toLowerCase().includes(lowercasedSearchTerm);
      const phoneMatch = (customer.phone || '').toLowerCase().includes(lowercasedSearchTerm);
      const idMatch = customer.id.toLowerCase().includes(lowercasedSearchTerm);
      const cpfMatch = (customer.cpf || '').toLowerCase().includes(lowercasedSearchTerm); // Adicionado CPF

      return nameMatch || emailMatch || phoneMatch || idMatch || cpfMatch;
    });
    console.log('Filtered customer results:', results.length, 'Results:', results);
    setFilteredCustomers(results);
  }, [searchTerm, customers]);

  const handleDeleteCustomer = async (userId: string) => {
    const customerToDelete = customers.find(c => c.id === userId);
    if (!customerToDelete) return;

    setDeleteModal({
      isOpen: true,
      customerId: userId,
      customerName: customerToDelete.name,
      isDeleting: false
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.customerId) return;

    setDeleteModal(prev => ({ ...prev, isDeleting: true }));

    try {
      // await deleteUser(deleteModal.customerId); // Descomente quando integrar com a API
      setCustomers(prev => prev.filter(user => user.id !== deleteModal.customerId));
      setDeleteModal({
        isOpen: false,
        customerId: null,
        customerName: '',
        isDeleting: false
      });
      showToast(`Cliente ${deleteModal.customerName} excluído com sucesso! 🗑️`, 'success');
    } catch (error) {
      console.error('Error deleting customer:', error);
      showToast('Erro ao excluir cliente', 'error');
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const cancelDelete = () => {
    setDeleteModal({
      isOpen: false,
      customerId: null,
      customerName: '',
      isDeleting: false
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-darker dark:bg-dark text-dark dark:text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary dark:border-primary-dark mb-4"></div>
          Carregando clientes...
        </div>
        <Helmet>
          <title>Carregando - Clientes - Dashboard Admin</title>
        </Helmet>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Clientes - Dashboard Admin - D'Pazz Imports</title>
        <meta name="description" content="Gerencie clientes na sua loja D'Pazz Imports. Visualize e exclua contas de clientes." />
      </Helmet>

      <AdminLayout title="Gerenciar Clientes">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-dark dark:text-white">
            Lista de Clientes ({filteredCustomers.length})
          </h2>
          <div className="relative w-full sm:w-auto flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Pesquisar clientes por nome, email, telefone ou ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-md h-64 flex items-center justify-center">
            <div className="animate-pulse text-gray-400 dark:text-gray-500">
              Carregando clientes...
            </div>
          </div>
        ) : filteredCustomers.length === 0 && searchTerm ? ( // Condição para exibir "Nenhum cliente encontrado" com base na pesquisa
          <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-md p-8 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Search size={48} className="mx-auto mb-2" />
              <h3 className="text-lg font-semibold mb-2">Nenhum cliente encontrado</h3>
              <p>Não encontramos clientes que correspondam à sua pesquisa "{searchTerm}".</p>
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
                      ID do Cliente
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Nome
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Telefone
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      CPF
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Data de Criação
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
                <AnimatePresence>
                  <tbody className="bg-white dark:bg-dark-lighter divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8">
                          <div className="text-gray-400 dark:text-gray-500">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                              <Eye size={24} />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Nenhum cliente cadastrado</h3>
                            <p>Nenhum cliente para exibir no momento.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((customer, index) => (
                        <motion.tr
                          key={customer.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                            index % 2 === 0 ? 'bg-white dark:bg-dark-lighter' : 'bg-gray-25 dark:bg-gray-900/20'
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {customer.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {customer.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {customer.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {customer.phone || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {customer.cpf || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(customer.createdAt).toLocaleDateString('pt-BR', {
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
                              {/* Você pode adicionar um botão de "Ver Detalhes" aqui se houver uma rota para isso */}
                              <button
                                onClick={() => handleDeleteCustomer(customer.id)}
                                className="group relative p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 transform hover:scale-105"
                                title="Excluir Cliente"
                              >
                                <Trash2 size={16} />
                                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                  Excluir
                                </span>
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </AnimatePresence>
              </table>
            </div>

            {/* Rodapé da tabela */}
            <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Mostrando <span className="font-medium">{filteredCustomers.length}</span> cliente(s)
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  Use os botões de ação para gerenciar seus clientes
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Modal de Confirmação de Exclusão */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <DeleteConfirmationModal
            isOpen={deleteModal.isOpen}
            customerId={deleteModal.customerId || ''}
            customerName={deleteModal.customerName}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
            isDeleting={deleteModal.isDeleting}
          />
        )}
      </AnimatePresence>
    </>
  );
};