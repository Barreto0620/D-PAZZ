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
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}> = ({ isOpen, productName, onConfirm, onCancel, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-lighter rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Confirmar Exclusão
            </h3>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            Tem certeza que deseja excluir o produto:
          </p>
          <p className="font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-2 rounded">
            "{productName}"
          </p>
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">
            Esta ação não pode ser desfeita.
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Excluindo...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Excluir
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
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
  
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    productId: string | null; // CORREÇÃO: number para string
    productName: string;
    isDeleting: boolean;
  }>({
    isOpen: false,
    productId: null,
    productName: '',
    isDeleting: false
  });

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data: Product[] = await getProducts(); // <--- USA A API REAL
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast('Erro ao carregar produtos', 'error');
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (!authLoading) {
      fetchProducts();
    }
  }, [authLoading, fetchProducts]);

  useEffect(() => {
    if (!searchTerm || searchTerm.trim() === '') {
      setFilteredProducts(products);
      return;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase().trim();
    const results = products.filter(product => {
      if (!product) return false;
      const nameMatch = (product.name || '').toLowerCase().includes(lowercasedSearchTerm);
      const descriptionMatch = (product.description || '').toLowerCase().includes(lowercasedSearchTerm);
      const categoryMatch = (product.categoryName || '').toLowerCase().includes(lowercasedSearchTerm);
      const colorMatch = (product.color || '').toLowerCase().includes(lowercasedSearchTerm);
      const shoeNumberMatch = (product.tamanhos || []).join(' ').toLowerCase().includes(lowercasedSearchTerm);
      const brandMatch = (product.brand || '').toLowerCase().includes(lowercasedSearchTerm);
      return nameMatch || descriptionMatch || categoryMatch || colorMatch || shoeNumberMatch || brandMatch;
    });
    setFilteredProducts(results);
  }, [searchTerm, products]);

  const handleSaveProduct = async (productData: Omit<Product, 'id'> | Product) => {
    try {
      if ('id' in productData) {
        // Atualizar produto
        const updated = await updateProduct(productData.id, productData);
        if (updated) {
          // Atualiza a lista local com o produto retornado pela API, que tem todos os dados.
          setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
        }
        showToast('Produto atualizado com sucesso! ✅', 'success');
      } else {
        // Criar produto
        const newProduct = await createProduct(productData);
        // Adiciona o novo produto retornado pela API na lista local.
        setProducts(prev => [...prev, newProduct]);
        showToast('Produto criado com sucesso! 🎉', 'success');
      }
    } catch (error) {
      const action = 'id' in productData ? 'atualizar' : 'criar';
      console.error(`Error ${action} product:`, error);
      showToast(`Erro ao ${action} produto`, 'error');
    } finally {
      setIsFormOpen(false);
      setCurrentProduct(undefined);
    }
  };

  const handleDeleteProduct = async (productId: string) => { // CORREÇÃO: number para string
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setDeleteModal({
      isOpen: true,
      productId,
      productName: product.name,
      isDeleting: false
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.productId) return;
    setDeleteModal(prev => ({ ...prev, isDeleting: true }));

    try {
      await deleteProduct(deleteModal.productId);
      setProducts(prev => prev.filter(p => p.id !== deleteModal.productId));
      setDeleteModal({ isOpen: false, productId: null, productName: '', isDeleting: false });
      showToast('Produto excluído com sucesso! 🗑️', 'success');
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast('Erro ao excluir produto', 'error');
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const cancelDelete = () => { setDeleteModal({ isOpen: false, productId: null, productName: '', isDeleting: false }); };
  const handleEdit = (product: Product) => { setCurrentProduct(product); setIsFormOpen(true); };
  const handleAddNew = () => { setCurrentProduct(undefined); setIsFormOpen(true); };
  const handleCloseForm = () => { setIsFormOpen(false); setCurrentProduct(undefined); };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-darker dark:bg-dark text-dark dark:text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary dark:border-primary-dark mb-4"></div>
          Carregando produtos...
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Produtos - Dashboard Admin - D'Pazz Imports</title>
        <meta name="description" content="Gerencie produtos na sua loja D'Pazz Imports. Adicione, edite e exclua produtos." />
      </Helmet>
      <AdminLayout title="Gerenciar Produtos">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-dark dark:text-white">
            Lista de Produtos ({filteredProducts.length})
          </h2>
          <div className="relative w-full sm:w-auto flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Pesquisar por nome, descrição, categoria, cor ou número..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-primary hover:bg-secondary text-dark px-4 py-2 rounded-lg transition-colors w-full sm:w-auto justify-center"
          >
            <Plus size={20} />
            <span>Novo Produto</span>
          </button>
        </div>
        {loading ? ( <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-md h-64 flex items-center justify-center"> <div className="animate-pulse text-gray-400 dark:text-gray-500"> Carregando produtos... </div> </div>
        ) : filteredProducts.length === 0 && searchTerm ? ( <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-md p-8 text-center"> <div className="text-gray-400 dark:text-gray-500 mb-4"> <Search size={48} className="mx-auto mb-2" /> <h3 className="text-lg font-semibold mb-2">Nenhum produto encontrado</h3> <p>Não encontramos produtos que correspondam à sua pesquisa "{searchTerm}".</p> <button onClick={() => setSearchTerm('')} className="mt-4 text-primary hover:text-secondary underline" > Limpar pesquisa </button> </div> </div>
        ) : ( <DataTable products={filteredProducts} onEdit={handleEdit} onDelete={handleDeleteProduct} /> )}
        {isFormOpen && ( <CRUDForm product={currentProduct} onClose={handleCloseForm} onSave={handleSaveProduct} /> )}
        <DeleteConfirmationModal isOpen={deleteModal.isOpen} productName={deleteModal.productName} onConfirm={confirmDelete} onCancel={cancelDelete} isDeleting={deleteModal.isDeleting} />
      </AdminLayout>
      {toast && ( <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} /> )}
    </>
  );
};