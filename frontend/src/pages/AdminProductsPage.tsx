// frontend/src/pages/AdminProductsPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Search, Trash2, AlertTriangle } from 'lucide-react';
import { AdminLayout } from '../components/Admin/AdminLayout';
import { DataTable } from '../components/Admin/DataTable';
import { CRUDForm } from '../components/Admin/CRUDForm';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';
import { Product } from '../types';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Toast } from '../components/Toast';

const DeleteConfirmationModal: React.FC<{
  isOpen: boolean;
  itemName: string;
  itemType?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}> = ({ isOpen, itemName, itemType = 'item', onConfirm, onCancel, isDeleting }) => {
  if (!isOpen) return null;
  return ( <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"> <div className="bg-white dark:bg-dark-lighter rounded-lg shadow-xl max-w-md w-full p-6"> <div className="flex items-center gap-3 mb-4"> <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center"> <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" /> </div> <div> <h3 className="text-lg font-semibold text-gray-900 dark:text-white"> Confirmar Exclusão </h3> </div> </div> <div className="mb-6"> <p className="text-gray-700 dark:text-gray-300 mb-2"> Tem certeza que deseja excluir o {itemType}: </p> <p className="font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-2 rounded"> "{itemName}" </p> <p className="text-sm text-red-600 dark:text-red-400 mt-2"> Esta ação não pode ser desfeita. </p> </div> <div className="flex gap-3 justify-end"> <button onClick={onCancel} disabled={isDeleting} className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg">Cancelar</button> <button onClick={onConfirm} disabled={isDeleting} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2"> {isDeleting ? (<><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> Excluindo...</>) : (<><Trash2 size={16} /> Excluir</>)} </button> </div> </div> </div> );
};

export const AdminProductsPage: React.FC = () => {
  const { authLoading } = useProtectedRoute(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | undefined>(undefined);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null as string | null, productName: '', isDeleting: false });

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data: Product[] = await getProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast('Erro ao carregar produtos', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (!authLoading) { fetchProducts(); }
  }, [authLoading, fetchProducts]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredProducts(products);
      return;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase().trim();
    const results = products.filter(p => (p.name || '').toLowerCase().includes(lowercasedSearchTerm));
    setFilteredProducts(results);
  }, [searchTerm, products]);

  const handleSaveProduct = async (productData: Omit<Product, 'id'> | Product) => {
    try {
      const isUpdating = 'id' in productData;
      await (isUpdating ? updateProduct(productData.id, productData) : createProduct(productData));
      showToast(`Produto ${isUpdating ? 'atualizado' : 'criado'} com sucesso!`, 'success');
    } catch (error) {
      const action = 'id' in productData ? 'atualizar' : 'criar';
      showToast(`Erro ao ${action} produto`, 'error');
    } finally {
      setIsFormOpen(false);
      setCurrentProduct(undefined);
      await fetchProducts();
    }
  };
  
  const confirmDelete = async () => {
    if (!deleteModal.productId) return;
    setDeleteModal(prev => ({ ...prev, isDeleting: true }));
    try {
      await deleteProduct(deleteModal.productId);
      showToast('Produto excluído com sucesso!', 'success');
      await fetchProducts();
    } catch (error) {
      showToast('Erro ao excluir produto', 'error');
    } finally {
      setDeleteModal({ isOpen: false, productId: null, productName: '', isDeleting: false });
    }
  };

  const handleDeleteProduct = (productId: string) => { const product = products.find(p => p.id === productId); if (product) { setDeleteModal({ isOpen: true, productId, productName: product.name, isDeleting: false }); } };
  const cancelDelete = () => setDeleteModal({ isOpen: false, productId: null, productName: '', isDeleting: false });
  const handleEdit = (product: Product) => { setCurrentProduct(product); setIsFormOpen(true); };
  const handleAddNew = () => { setCurrentProduct(undefined); setIsFormOpen(true); };
  const handleCloseForm = () => { setIsFormOpen(false); setCurrentProduct(undefined); };

  if (authLoading) { return ( <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div></div> ); }

  return (
    <>
      <Helmet><title>Produtos - Admin</title></Helmet>
      <AdminLayout title="Gerenciar Produtos">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Lista de Produtos ({filteredProducts.length})</h2>
          <div className="relative w-full sm:w-auto flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            {/* --- CORREÇÃO DE ESTILO APLICADA AQUI --- */}
            <input
              type="text"
              placeholder="Pesquisar..."
              className="w-full pl-10 pr-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={handleAddNew} className="flex items-center gap-2 bg-primary hover:bg-secondary text-dark px-4 py-2 rounded-lg"><Plus size={20} /><span>Novo Produto</span></button>
        </div>
        {loading ? ( <p className="text-center dark:text-white">Carregando...</p> ) : ( <DataTable products={filteredProducts} onEdit={handleEdit} onDelete={handleDeleteProduct} /> )}
        {isFormOpen && ( <CRUDForm product={currentProduct} onClose={handleCloseForm} onSave={handleSaveProduct} /> )}
        <DeleteConfirmationModal isOpen={deleteModal.isOpen} itemName={deleteModal.productName} onConfirm={confirmDelete} onCancel={cancelDelete} isDeleting={deleteModal.isDeleting} itemType="produto" />
      </AdminLayout>
      {toast && (<Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />)}
    </>
  );
};