// frontend/src/components/Admin/CategoryDataTable.tsx
import React from 'react';
import { Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nome da Categoria</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Destaque</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Exibir no Header</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider bg-gradient-to-r from-blue-600 to-purple-600">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-dark-lighter divide-y divide-gray-200 dark:divide-gray-700">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{category.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{category.description}</div>
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