// frontend/src/components/Admin/CategoryCRUDForm.tsx
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Category } from '../../types';
import { ToggleSwitch } from './ToggleSwitch';

interface CategoryCRUDFormProps {
  category?: Category;
  onClose: () => void;
  onSave: (category: Partial<Omit<Category, 'id'>>) => void;
  isSaving: boolean;
}

// REMOVIDA a função createSlug

export const CategoryCRUDForm: React.FC<CategoryCRUDFormProps> = ({ category, onClose, onSave, isSaving }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    featured: false,
    showInHeader: false,
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        image: category.image || '',
        featured: category.featured || false,
        showInHeader: category.showInHeader || false,
      });
    }
  }, [category]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // A propriedade 'slug' foi removida do objeto enviado
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-lighter rounded-lg shadow-xl max-w-lg w-full">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category ? 'Editar' : 'Nova'} Categoria</h3>
          <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"><X size={24} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL da Imagem</label>
            <input type="url" name="image" value={formData.image} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
          </div>
          <div className="space-y-3 pt-2">
            <ToggleSwitch label="Marcar como Destaque" enabled={formData.featured} onChange={(val) => setFormData(p => ({...p, featured: val}))} />
            <ToggleSwitch label="Exibir no Cabeçalho" enabled={formData.showInHeader} onChange={(val) => setFormData(p => ({...p, showInHeader: val}))} />
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-dark-lighter/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Cancelar</button>
          <button type="submit" disabled={isSaving} className="px-4 py-2 bg-primary text-dark rounded-lg disabled:opacity-50 flex items-center gap-2">
            {isSaving ? 'Salvando...' : <><Save size={16}/> Salvar</>}
          </button>
        </div>
      </form>
    </div>
  );
};