// frontend/src/components/Admin/CategoryDataTable.tsx
import React from 'react';
import { Edit, Trash2, CheckCircle, XCircle, Package } from 'lucide-react'; // Importa Package
import { Category } from '../../types';

interface CategoryDataTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

export const CategoryDataTable: React.FC<CategoryDataTableProps> = ({ categories, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-md overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Categoria</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Destaque</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Exibir no Header</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider bg-gradient-to-r from-blue-600 to-purple-600">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-dark-lighter divide-y divide-gray-200 dark:divide-gray-700">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* --- CORREÇÃO APLICADA AQUI --- */}
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      {category.image ? (
                        <img 
                          className="h-12 w-12 rounded-lg object-cover" 
                          src={category.image} 
                          alt={category.name}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/placeholder-product.jpg'; // Imagem fallback
                          }}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <Package size={20} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{category.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{category.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {category.featured ? <CheckCircle className="h-5 w-5 text-green-500 mx-auto" /> : <XCircle className="h-5 w-5 text-red-500 mx-auto" />}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {category.showInHeader ? <CheckCircle className="h-5 w-5 text-green-500 mx-auto" /> : <XCircle className="h-5 w-5 text-red-500 mx-auto" />}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button onClick={() => onEdit(category)} className="p-2 text-indigo-600 hover:text-indigo-900 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><Edit size={16} /></button>
                    <button onClick={() => onDelete(category.id)} className="p-2 text-red-600 hover:text-red-900 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};