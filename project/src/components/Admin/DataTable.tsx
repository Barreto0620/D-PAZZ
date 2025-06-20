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
    // Tratamento para campos numéricos e strings para garantir ordenação correta
    const aValue = typeof a[sortField] === 'string' ? (a[sortField] as string).toLowerCase() : a[sortField];
    const bValue = typeof b[sortField] === 'string' ? (b[sortField] as string).toLowerCase() : b[sortField];

    if (aValue === undefined || bValue === undefined) {
      // Handle undefined values, perhaps by pushing them to the end or beginning
      if (aValue === undefined && bValue !== undefined) return sortDirection === 'asc' ? 1 : -1;
      if (aValue !== undefined && bValue === undefined) return sortDirection === 'asc' ? -1 : 1;
      return 0; // Both are undefined or both are defined
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-light-darker dark:bg-dark-light text-left">
              <th className="px-6 py-3 min-w-[80px]"> {/* Adicionado min-w */}
                <button 
                  onClick={() => handleSort('id')} 
                  className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider group"
                >
                  ID
                  {sortField === 'id' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1 text-primary group-hover:text-secondary transition-colors" /> : <ChevronDown size={16} className="ml-1 text-primary group-hover:text-secondary transition-colors" />
                  )}
                  {sortField !== 'id' && <ChevronDown size={16} className="ml-1 text-gray-400 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </button>
              </th>
              <th className="px-6 py-3 min-w-[200px]"> {/* Adicionado min-w */}
                <button 
                  onClick={() => handleSort('name')} 
                  className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider group"
                >
                  Nome
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1 text-primary group-hover:text-secondary transition-colors" /> : <ChevronDown size={16} className="ml-1 text-primary group-hover:text-secondary transition-colors" />
                  )}
                  {sortField !== 'name' && <ChevronDown size={16} className="ml-1 text-gray-400 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </button>
              </th>
              <th className="px-6 py-3 min-w-[120px]"> {/* Adicionado min-w */}
                <button 
                  onClick={() => handleSort('price')} 
                  className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider group"
                >
                  Preço
                  {sortField === 'price' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1 text-primary group-hover:text-secondary transition-colors" /> : <ChevronDown size={16} className="ml-1 text-primary group-hover:text-secondary transition-colors" />
                  )}
                  {sortField !== 'price' && <ChevronDown size={16} className="ml-1 text-gray-400 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </button>
              </th>
              <th className="px-6 py-3 min-w-[100px]"> {/* Adicionado min-w */}
                <button 
                  onClick={() => handleSort('stock')} 
                  className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider group"
                >
                  Estoque
                  {sortField === 'stock' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1 text-primary group-hover:text-secondary transition-colors" /> : <ChevronDown size={16} className="ml-1 text-primary group-hover:text-secondary transition-colors" />
                  )}
                  {sortField !== 'stock' && <ChevronDown size={16} className="ml-1 text-gray-400 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </button>
              </th>
              <th className="px-6 py-3 text-right min-w-[100px]">Ações</th> {/* Adicionado min-w */}
            </tr>
          </thead>
          <tbody>
            {sortedProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Nenhum produto encontrado.
                </td>
              </tr>
            ) : (
              sortedProducts.map((product) => (
                <motion.tr 
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }} // Adicionada duração para transição suave
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
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      product.stock > 10 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300' // Verde para estoque alto
                        : product.stock > 0 
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' // Amarelo para estoque baixo
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' // Vermelho para sem estoque
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
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
  );
};