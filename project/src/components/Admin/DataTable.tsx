import React, { useState } from 'react';
import { Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Product } from '../../types';
import { motion } from 'framer-motion';

interface DataTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
}

export const DataTable: React.FC<DataTableProps> = ({ 
  products, 
  onEdit, 
  onDelete 
}) => {
  const [sortField, setSortField] = useState<keyof Product>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const sortedProducts = [...products].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-light-darker dark:bg-dark-light text-left">
              <th className="px-6 py-3">
                <button 
                  onClick={() => handleSort('id')} 
                  className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  ID
                  {sortField === 'id' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </button>
              </th>
              <th className="px-6 py-3">
                <button 
                  onClick={() => handleSort('name')} 
                  className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Nome
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </button>
              </th>
              <th className="px-6 py-3">
                <button 
                  onClick={() => handleSort('price')} 
                  className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Preço
                  {sortField === 'price' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </button>
              </th>
              <th className="px-6 py-3">
                <button 
                  onClick={() => handleSort('stock')} 
                  className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Estoque
                  {sortField === 'stock' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product) => (
              <motion.tr 
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-light-darker dark:hover:bg-dark-light transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  #{product.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="h-10 w-10 rounded-md object-cover mr-3"
                    />
                    <div className="text-sm text-dark dark:text-white">{product.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark dark:text-white">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.stock > 10 
                      ? 'bg-success/10 text-success' 
                      : product.stock > 0 
                        ? 'bg-warning/10 text-warning' 
                        : 'bg-error/10 text-error'
                  }`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};