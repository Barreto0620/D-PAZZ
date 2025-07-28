// frontend/src/pages/AdminCategoriesPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import { AdminLayout } from '../components/Admin/AdminLayout';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Toast } from '../components/Toast';
import { Category } from '../types';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';
import { CategoryDataTable } from '../components/Admin/CategoryDataTable';
import { CategoryCRUDForm } from '../components/Admin/CategoryCRUDForm';

// COPIADO O MODAL DE 'AdminProductsPage' PARA CÁ, COMO SOLICITADO
const DeleteConfirmationModal: React.FC<{
  isOpen: boolean;
  itemName: string;
  itemType?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}> = ({ isOpen, itemName, itemType = 'item', onConfirm, onCancel, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-lighter rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div><h3 className="text-lg font-semibold text-gray-900 dark:text-white">Confirmar Exclusão</h3></div>
        </div>
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300 mb-2">Tem certeza que deseja excluir a {itemType}:</p>
          <p className="font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-2 rounded">"{itemName}"</p>
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">Esta ação não pode ser desfeita.</p>
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} disabled={isDeleting} className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg">Cancelar</button>
          <button onClick={onConfirm} disabled={isDeleting} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2">
            {isDeleting ? (<><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> Excluindo...</>) : (<><Trash2 size={16} /> Excluir</>)}
          </button>
        </div>
      </div>
    </div>
  );
};


export const AdminCategoriesPage: React.FC = () => {
  useProtectedRoute(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    categoryId: null as string | null,
    categoryName: '',
    isDeleting: false,
  });
  
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      showToast('Erro ao carregar categorias', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSave = async (categoryData: Partial<Omit<Category, 'id'>>) => {
    setIsSaving(true);
    try {
      const action = currentCategory ? 'atualizada' : 'criada';
      if (currentCategory) {
        await updateCategory(currentCategory.id, categoryData);
      } else {
        await createCategory(categoryData);
      }
      showToast(`Categoria ${action} com sucesso!`, 'success');
      setIsFormOpen(false);
      setCurrentCategory(undefined);
      fetchCategories();
    } catch (error: any) {
      console.error('Falha ao salvar categoria:', error);
      const errorMessage = error.message || 'Ocorreu um erro desconhecido.';
      showToast(`Erro ao salvar: ${errorMessage}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setDeleteModal({
        isOpen: true,
        categoryId,
        categoryName: category.name,
        isDeleting: false,
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.categoryId) return;
    setDeleteModal(prev => ({ ...prev, isDeleting: true }));
    try {
      await deleteCategory(deleteModal.categoryId);
      showToast('Categoria excluída com sucesso!', 'success');
      fetchCategories();
    } catch (error: any) {
      console.error('Falha ao excluir categoria:', error);
      const errorMessage = error.message || 'Ocorreu um erro desconhecido.';
      showToast(`Erro ao excluir: ${errorMessage}`, 'error');
    } finally {
      setDeleteModal({ isOpen: false, categoryId: null, categoryName: '', isDeleting: false });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, categoryId: null, categoryName: '', isDeleting: false });
  };

  return (
    <>
      <Helmet><title>Categorias - Dashboard Admin</title></Helmet>
      <AdminLayout title="Gerenciar Categorias">
        <div className="mb-6 flex justify-end">
          <button onClick={() => { setCurrentCategory(undefined); setIsFormOpen(true); }} className="flex items-center gap-2 bg-primary hover:bg-secondary text-dark px-4 py-2 rounded-lg">
            <Plus size={20} /> Nova Categoria
          </button>
        </div>
        
        {loading ? <p className="text-center dark:text-white">Carregando categorias...</p> : 
          <CategoryDataTable 
            categories={categories} 
            onEdit={(cat) => { setCurrentCategory(cat); setIsFormOpen(true); }}
            onDelete={handleDelete}
          />
        }
        
        {isFormOpen && 
          <CategoryCRUDForm 
            category={currentCategory}
            onClose={() => { setIsFormOpen(false); setCurrentCategory(undefined); }}
            onSave={handleSave}
            isSaving={isSaving}
          />
        }

        <DeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          itemName={deleteModal.categoryName}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          isDeleting={deleteModal.isDeleting}
          itemType="categoria"
        />
      </AdminLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
};