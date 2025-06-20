// project/src/pages/AdminDashboardPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react'; // Removido Plus, BarChart2
import { AdminLayout } from '../components/Admin/AdminLayout';
import { StatsCard } from '../components/Admin/StatsCard';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Toast } from '../components/Toast';
import ChartComponent from '../components/Admin/ChartComponent'; // Certifique-se que o import está correto (default export)

export const AdminDashboardPage: React.FC = () => {
  const { loading: authLoading } = useProtectedRoute(true);

  // Removido estados e lógica relacionados a produtos (products, isFormOpen, currentProduct, etc.)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  // Dados de exemplo para os gráficos
  const salesData = [
    { name: 'Jan', vendas: 4000, receita: 2400 },
    { name: 'Fev', vendas: 3000, receita: 1398 },
    { name: 'Mar', vendas: 2000, receita: 9800 },
    { name: 'Abr', vendas: 2780, receita: 3908 },
    { name: 'Mai', vendas: 1890, receita: 4800 },
    { name: 'Jun', vendas: 2390, receita: 3800 },
    { name: 'Jul', vendas: 3490, receita: 4300 },
    { name: 'Ago', vendas: 2800, receita: 3000 },
    { name: 'Set', vendas: 3200, receita: 3500 },
    { name: 'Out', vendas: 4500, receita: 5000 },
    { name: 'Nov', vendas: 3800, receita: 4200 },
    { name: 'Dez', vendas: 5000, receita: 6000 },
  ];

  const productPerformanceData = [
    { name: 'Notebooks', views: 8000, sales: 250 },
    { name: 'Smartphones', views: 7000, sales: 300 },
    { name: 'Acessórios', views: 5000, sales: 180 },
    { name: 'Periféricos', views: 4500, sales: 150 },
    { name: 'Audio', views: 3000, sales: 100 },
  ];

  const orderStatusDistribution = [
    { name: 'Concluídos', value: 70, color: '#10B981' }, // green
    { name: 'Pendentes', value: 15, color: '#F59E0B' },  // warning
    { name: 'Em Processamento', value: 10, color: '#3B82F6' }, // blue
    { name: 'Cancelados', value: 5, color: '#EF4444' },     // error
  ];

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-darker dark:bg-dark text-dark dark:text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary dark:border-primary-dark mb-4"></div>
          Carregando painel administrativo...
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard Admin - D'Pazz Imports</title>
        <meta name="description" content="Painel de controle administrativo da D'Pazz Imports. Visualize métricas e gráficos importantes." />
      </Helmet>

      <AdminLayout title="Dashboard">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total de Produtos"
            value="150" // Valor mockado, você pode buscar da API se precisar
            icon={<Package size={24} />}
            color="border-blue-500 text-blue-500"
          />

          <StatsCard
            title="Pedidos Pendentes"
            value="12" // Valor mockado
            icon={<ShoppingCart size={24} />}
            color="border-orange-500 text-orange-500"
          />

          <StatsCard
            title="Total de Clientes"
            value="243" // Valor mockado
            icon={<Users size={24} />}
            color="border-purple-500 text-purple-500"
          />
          <StatsCard
            title="Vendas Mensais"
            value="R$ 15.000" // Valor mockado
            icon={<TrendingUp size={24} />}
            color="border-green-500 text-green-500"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartComponent
            type="line"
            title="Vendas e Receita Mensal"
            data={salesData}
            xAxisDataKey="name"
            dataKeys={[
              { name: 'vendas', color: '#6366F1' }, // primary
              { name: 'receita', color: '#10B981' } // success
            ]}
          />
          <ChartComponent
            type="bar"
            title="Performance dos Produtos"
            data={productPerformanceData}
            xAxisDataKey="name"
            dataKeys={[
              { name: 'views', color: '#F59E0B' }, // warning
              { name: 'sales', color: '#3B82F6' } // blue
            ]}
          />
        </div>

        {/* Adicionado Gráfico de Pizza para Status dos Pedidos */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <ChartComponent
            type="pie"
            title="Distribuição do Status dos Pedidos"
            data={orderStatusDistribution}
            pieDataKey="value"
            nameKey="name"
            dataKeys={orderStatusDistribution.map(item => ({ name: item.name, color: item.color }))}
          />
        </div>

        {/* Removido completamente a seção "Products Management" */}

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