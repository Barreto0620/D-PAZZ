// project/src/pages/AdminCustomersPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Trash2 } from 'lucide-react';
import { AdminLayout } from '../components/Admin/AdminLayout';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Toast } from '../components/Toast';
import { User } from '../types';
import { getUsers, deleteUser } from '../services/api'; // Assumindo que você tem getUsers e deleteUser na sua API
import { motion } from 'framer-motion'; // Mantenho motion se estiver usando

export const AdminCustomersPage: React.FC = () => {
  const { authLoading } = useProtectedRoute(true);
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<User[]>([]);

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
    if (!window.confirm(`Tem certeza que deseja excluir o cliente ${userId}?`)) {
      return;
    }
    try {
      // await deleteUser(userId); // Descomente quando integrar com a API
      setCustomers(prev => prev.filter(user => user.id !== userId));
      showToast(`Cliente ${userId} excluído com sucesso`, 'success');
    } catch (error) {
      console.error('Error deleting customer:', error);
      showToast('Erro ao excluir cliente', 'error');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-darker dark:bg-dark text-dark dark:text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary dark:border-primary-dark mb-4"></div>
          Carregando clientes...
        </div>
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
            Lista de Clientes
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

        <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-light-darker dark:bg-dark-light">
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
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-lighter divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Carregando clientes...
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Nenhum cliente encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <motion.tr
                      key={customer.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-light-darker dark:hover:bg-dark-light"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark dark:text-white">
                        {customer.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
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
                        {new Date(customer.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Excluir Cliente"
                        >
                          <Trash2 size={16} />
                        </button>
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