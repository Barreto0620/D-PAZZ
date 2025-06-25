// project/src/components/Admin/DataTable.tsx

import React from 'react';
import { Edit, Trash2, Eye, Palette, Ruler } from 'lucide-react';
import { Product } from '../../types';

interface DataTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
}

export const DataTable: React.FC<DataTableProps> = ({ products, onEdit, onDelete }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (products.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-md p-8 text-center">
        <div className="text-gray-400 dark:text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <Eye size={24} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Nenhum produto cadastrado</h3>
          <p>Comece adicionando seu primeiro produto clicando no botão "Novo Produto".</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Produto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Preço
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <Palette size={14} />
                  Cor
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <Ruler size={14} />
                  Tamanho
                </div>
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
            {products.map((product, index) => (
              <tr 
                key={product.id} 
                className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  index % 2 === 0 ? 'bg-white dark:bg-dark-lighter' : 'bg-gray-25 dark:bg-gray-900/20'
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {product.image ? (
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          className="h-12 w-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                          src={product.image}
                          alt={product.name}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Eye size={20} className="text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {truncateText(product.name, 30)}
                      </div>
                      {product.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {truncateText(product.description, 40)}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                    {product.category || 'Sem categoria'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {formatPrice(product.price)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.color ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm"
                           style={{ 
                             backgroundColor: product.color.toLowerCase() === 'branco' ? '#ffffff' :
                                            product.color.toLowerCase() === 'preto' ? '#000000' :
                                            product.color.toLowerCase() === 'vermelho' ? '#ef4444' :
                                            product.color.toLowerCase() === 'azul' ? '#3b82f6' :
                                            product.color.toLowerCase() === 'verde' ? '#10b981' :
                                            product.color.toLowerCase() === 'amarelo' ? '#f59e0b' :
                                            product.color.toLowerCase() === 'rosa' ? '#ec4899' :
                                            product.color.toLowerCase() === 'marrom' ? '#92400e' :
                                            product.color.toLowerCase() === 'cinza' ? '#6b7280' :
                                            product.color.toLowerCase() === 'bege' ? '#d2b48c' :
                                            product.color.toLowerCase() === 'dourado' ? '#fbbf24' :
                                            product.color.toLowerCase() === 'prateado' ? '#9ca3af' :
                                            '#6b7280'
                           }}
                      ></div>
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {product.color}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.shoeNumber ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      {product.shoeNumber}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
                  )}
                </td>
                {/* Coluna Ações com fundo destacado */}
                <td className="px-6 py-4 whitespace-nowrap text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 border-l-2 border-blue-200 dark:border-blue-700">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="group relative p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 transform hover:scale-105"
                      title="Editar produto"
                    >
                      <Edit size={16} />
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Editar
                      </span>
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="group relative p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 transform hover:scale-105"
                      title="Excluir produto"
                    >
                      <Trash2 size={16} />
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Excluir
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Rodapé da tabela */}
      <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando <span className="font-medium">{products.length}</span> produto(s)
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            Use os botões de ação para gerenciar seus produtos
          </div>
        </div>
      </div>
    </div>
  );
};