// project/src/pages/AdminProductsPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Search } from 'lucide-react';
import { AdminLayout } from '../components/Admin/AdminLayout';
import { DataTable } from '../components/Admin/DataTable'; // Certifique-se de que DataTable lida bem com arrays vazios
import { CRUDForm } from '../components/Admin/CRUDForm';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';
import { Product } from '../types';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Toast } from '../components/Toast';

export const AdminProductsPage: React.FC = () => {
  const { authLoading } = useProtectedRoute(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | undefined>(undefined);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Estado para os produtos filtrados

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data: Product[] = await getProducts(); // Certifique-se de que a API retorna Product[]
      setProducts(data);
      setFilteredProducts(data); // Inicializa produtos filtrados com todos os produtos
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast('Erro ao carregar produtos', 'error');
      setProducts([]); // Garante que products seja um array vazio em caso de erro
      setFilteredProducts([]); // Garante que filteredProducts seja um array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (!authLoading) {
      fetchProducts();
    }
  }, [authLoading, fetchProducts]);

  // Efeito para filtrar produtos quando searchTerm ou products mudam
  useEffect(() => {
    console.log('Filtering products. Search term:', searchTerm, 'Total products:', products.length);
    const lowercasedSearchTerm = searchTerm.toLowerCase().trim(); // Adicionado .trim()
    
    if (lowercasedSearchTerm === '') {
      setFilteredProducts(products); // Se o termo de pesquisa estiver vazio, mostra todos os produtos
      return;
    }

    const results = products.filter(product => {
      // Usar || '' para garantir que a string esteja sempre presente para .includes()
      const nameMatch = product.name.toLowerCase().includes(lowercasedSearchTerm);
      const descriptionMatch = (product.description || '').toLowerCase().includes(lowercasedSearchTerm);
      const categoryMatch = (product.category || '').toLowerCase().includes(lowercasedSearchTerm);
      
      return nameMatch || descriptionMatch || categoryMatch;
    });
    console.log('Filtered results:', results.length, 'Results:', results); // Depuração
    setFilteredProducts(results);
  }, [searchTerm, products]); // Depende de searchTerm e products

  const handleCreateProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const newProduct = await createProduct(product);
      setProducts(prev => [...prev, newProduct]);
      showToast('Produto criado com sucesso', 'success');
    } catch (error) {
      console.error('Error creating product:', error);
      showToast('Erro ao criar produto', 'error');
    } finally {
      setIsFormOpen(false); // Garante que o formulário feche
      setCurrentProduct(undefined); // Limpa o produto atual
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    try {
      const updatedProduct = await updateProduct(product.id, product);
      if (!updatedProduct) {
        throw new Error('Produto não encontrado ou atualização falhou.');
      }

      setProducts(prev =>
        prev.map(p => (p.id === product.id ? { ...p, ...updatedProduct } : p))
      );
      showToast('Produto atualizado com sucesso', 'success');
    } catch (error) {
      console.error('Error updating product:', error);
      showToast(error instanceof Error ? error.message : 'Erro ao atualizar produto', 'error');
    } finally {
      setIsFormOpen(false); // Garante que o formulário feche
      setCurrentProduct(undefined); // Limpa o produto atual
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    try {
      await deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      showToast('Produto excluído com sucesso', 'success');
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast('Erro ao excluir produto', 'error');
    }
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setCurrentProduct(undefined);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentProduct(undefined);
  };

  const handleSaveProduct = (product: Omit<Product, 'id'> | Product) => {
    if ('id' in product) {
      handleUpdateProduct(product as Product);
    } else {
      handleCreateProduct(product);
    }
  };

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
            Lista de Produtos
          </h2>

          <div className="relative w-full sm:w-auto flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Pesquisar produtos..."
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

        {loading ? (
          <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-md h-64 flex items-center justify-center">
            <div className="animate-pulse text-gray-400 dark:text-gray-500">
              Carregando produtos...
            </div>
          </div>
        ) : (
          <DataTable
            products={filteredProducts} // Passa os produtos filtrados para a DataTable
            onEdit={handleEdit}
            onDelete={handleDeleteProduct}
          />
        )}

        {isFormOpen && (
          <CRUDForm
            product={currentProduct}
            onClose={handleCloseForm}
            onSave={handleSaveProduct}
          />
        )}
      </AdminLayout>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};