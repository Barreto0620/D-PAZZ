import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Package, ShoppingCart, Users, Plus } from 'lucide-react';
import { AdminLayout } from '../components/Admin/AdminLayout';
import { StatsCard } from '../components/Admin/StatsCard';
import { DataTable } from '../components/Admin/DataTable';
import { CRUDForm } from '../components/Admin/CRUDForm';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';
import { Product } from '../types';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Toast } from '../components/Toast';

export const AdminDashboardPage: React.FC = () => {
  useProtectedRoute(true);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | undefined>(undefined);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast('Erro ao carregar produtos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const newProduct = await createProduct(product);
      setProducts(prev => [...prev, newProduct]);
      setIsFormOpen(false);
      showToast('Produto criado com sucesso', 'success');
    } catch (error) {
      console.error('Error creating product:', error);
      showToast('Erro ao criar produto', 'error');
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    try {
      const updatedProduct = await updateProduct(product.id, product);
      if (!updatedProduct) {
        throw new Error('Produto não encontrado');
      }
      
      setProducts(prev => 
        prev.map(p => p.id === product.id ? { ...p, ...updatedProduct } : p)
      );
      setIsFormOpen(false);
      showToast('Produto atualizado com sucesso', 'success');
    } catch (error) {
      console.error('Error updating product:', error);
      showToast(error instanceof Error ? error.message : 'Erro ao atualizar produto', 'error');
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

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    // Auto hide toast after 3 seconds
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <>
      <Helmet>
        <title>Dashboard Admin - ImportShop</title>
        <meta name="description" content="Painel de controle administrativo da ImportShop." />
      </Helmet>
      
      <AdminLayout title="Dashboard">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard 
            title="Total de Produtos" 
            value={products.length.toString()} 
            icon={<Package size={24} />}
            color="border-primary text-primary"
          />
          
          <StatsCard 
            title="Pedidos Pendentes" 
            value="12" 
            icon={<ShoppingCart size={24} />}
            color="border-success text-success"
          />
          
          <StatsCard 
            title="Total de Clientes" 
            value="243" 
            icon={<Users size={24} />}
            color="border-warning text-warning"
          />
        </div>
        
        {/* Products Management */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-dark dark:text-white">
            Gerenciar Produtos
          </h2>
          
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-primary hover:bg-secondary text-dark px-4 py-2 rounded-lg transition-colors"
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
            products={products}
            onEdit={handleEdit}
            onDelete={handleDeleteProduct}
          />
        )}
        
        {/* CRUD Form Modal */}
        {isFormOpen && (
          <CRUDForm 
            product={currentProduct}
            onClose={handleCloseForm}
            onSave={handleSaveProduct}
          />
        )}
      </AdminLayout>
      
      {/* Toast Notification */}
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