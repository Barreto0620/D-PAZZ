// frontend/src/components/Admin/DataTable.tsx
import React from 'react';
import { Package, Edit, Trash2, Eye } from 'lucide-react';
import { Product } from '../../types';

interface DataTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void; // CORREÇÃO: de 'number' para 'string'
}

export const DataTable: React.FC<DataTableProps> = ({ 
  products = [],
  onEdit, 
  onDelete 
}) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const truncateText = (text: string, maxLength: number = 50): string => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  if (!products || products.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-md p-8 text-center">
        <div className="text-gray-400 dark:text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <Package size={24} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Nenhum produto encontrado</h3>
          <p>Comece adicionando novos produtos ao seu catálogo.</p>
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
                Estoque
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
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
                    <div className="flex-shrink-0 h-12 w-12">
                      {/* Lógica para usar o novo campo 'images' (array) */}
                      {product.images && product.images.length > 0 ? (
                        <img 
                          className="h-12 w-12 rounded-lg object-cover" 
                          src={product.images[0]} 
                          alt={product.name}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/placeholder-product.jpg';
                          }}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <Package size={20} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {truncateText(product.name, 30)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {truncateText(product.description, 40)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                    {product.categoryName || 'Sem categoria'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div className="font-semibold">
                    {formatPrice(product.price)}
                  </div>
                  {product.oldPrice && (
                    <div className="text-xs text-gray-500 line-through">
                      {formatPrice(product.oldPrice)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      (product.stock || 0) > 10 ? 'bg-green-400' : 
                      (product.stock || 0) > 0 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}></div>
                    {product.stock || 0} unidades
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    {product.featured && ( <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Destaque</span> )}
                    {product.onSale && ( <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Promoção</span> )}
                    {product.bestSeller && ( <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Mais Vendido</span> )}
                    {!product.featured && !product.onSale && !product.bestSeller && ( <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Normal</span> )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 border-l-2 border-blue-200 dark:border-blue-700">
                  <div className="flex items-center justify-center space-x-2">
                    <button onClick={() => onEdit(product)} className="inline-flex items-center justify-center w-8 h-8 text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/20 hover:bg-indigo-200 dark:hover:bg-indigo-800/30 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1" title="Editar produto">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => onDelete(product.id)} className="inline-flex items-center justify-center w-8 h-8 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-800/30 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1" title="Excluir produto">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando <span className="font-medium">{products.length}</span> produto(s)
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            Gerencie seus produtos.
          </div>
        </div>
      </div>
    </div>
  );
};