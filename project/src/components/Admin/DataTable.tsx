// Exemplo para AdminOrdersPage.tsx ou AdminCustomersPage.tsx
import React from 'react';
// Importe seus tipos e componentes de ícone aqui
import { Eye } from 'lucide-react'; // Exemplo, se for usar a mensagem de vazio

interface AdminOrdersPageProps {
  orders: Order[]; // Ou customers: Customer[];
  // ... outras props
}

export const AdminOrdersPage: React.FC<AdminOrdersPageProps> = ({ orders }) => {
  // Funções utilitárias como formatPrice, truncateText, etc., se aplicável

  if (orders.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-md p-8 text-center">
        <div className="text-gray-400 dark:text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <Eye size={24} /> {/* Adapte o ícone */}
          </div>
          <h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3> {/* Adapte o texto */}
          <p>Comece processando novos pedidos.</p> {/* Adapte o texto */}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-md overflow-hidden">
      {/* Conteúdo da tabela ou lista de cards aqui */}
      <div className="overflow-x-auto"> {/* Se for uma tabela */}
        <table className="w-full">
          {/* ... Thead com o mesmo estilo do DataTable ... */}
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ID do Pedido
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Cliente
              </th>
              {/* ... Outros cabeçalhos ... */}
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
            {/* Mapear os pedidos/clientes aqui */}
            {orders.map((order, index) => (
              <tr 
                key={order.id} 
                className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  index % 2 === 0 ? 'bg-white dark:bg-dark-lighter' : 'bg-gray-25 dark:bg-gray-900/20'
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {order.customerName}
                </td>
                {/* ... Outras colunas ... */}
                <td className="px-6 py-4 whitespace-nowrap text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 border-l-2 border-blue-200 dark:border-blue-700">
                  <div className="flex items-center justify-center space-x-2">
                    {/* Botões de ação com o mesmo estilo */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rodapé da tabela/lista, se aplicável */}
      <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando <span className="font-medium">{orders.length}</span> pedido(s)
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            Gerencie seus pedidos.
          </div>
        </div>
      </div>
    </div>
  );
};