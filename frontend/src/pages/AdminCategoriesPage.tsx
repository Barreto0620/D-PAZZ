// frontend/src/pages/AdminCategoriesPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus } from 'lucide-react';
import { AdminLayout } from '../components/Admin/AdminLayout';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Toast } from '../components/Toast';
import { Category } from '../types';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';
import { CategoryDataTable } from '../components/Admin/CategoryDataTable';
import { CategoryCRUDForm } from '../components/Admin/CategoryCRUDForm';

export const AdminCategoriesPage: React.FC = () => {
  useProtectedRoute(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
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
      if (currentCategory) {
        await updateCategory(currentCategory.id, categoryData);
        showToast('Categoria atualizada com sucesso!', 'success');
      } else {
        await createCategory(categoryData);
        showToast('Categoria criada com sucesso!', 'success');
      }
      setIsFormOpen(false);
      setCurrentCategory(undefined);
      fetchCategories();
    } catch (error) {
      showToast('Erro ao salvar categoria', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria? Os produtos associados não serão excluídos, mas ficarão sem categoria.')) {
      try {
        await deleteCategory(categoryId);
        showToast('Categoria excluída com sucesso!', 'success');
        fetchCategories();
      } catch (error) {
        showToast('Erro ao excluir categoria', 'error');
      }
    }
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
      </AdminLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
};