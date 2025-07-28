// frontend/src/pages/AdminDashboardPage.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { AdminLayout } from '../components/Admin/AdminLayout';
import { StatsCard } from '../components/Admin/StatsCard';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Toast } from '../components/Toast';
import ChartComponent from '../components/Admin/ChartComponent';

export const AdminDashboardPage: React.FC = () => {
  // A página chama o hook e controla o estado de loading
  const { authLoading } = useProtectedRoute(true);
  const [toast, setToast] = React.useState(null);

  // Dados de exemplo para os gráficos (mantidos)
  const salesData = [ { name: 'Jan', vendas: 4000, receita: 2400 }, { name: 'Fev', vendas: 3000, receita: 1398 }, { name: 'Mar', vendas: 2000, receita: 9800 }, { name: 'Abr', vendas: 2780, receita: 3908 }, { name: 'Mai', vendas: 1890, receita: 4800 }, { name: 'Jun', vendas: 2390, receita: 3800 }, { name: 'Jul', vendas: 3490, receita: 4300 }, ];
  const productPerformanceData = [ { name: 'Notebooks', views: 8000, sales: 250 }, { name: 'Smartphones', views: 7000, sales: 300 }, { name: 'Acessórios', views: 5000, sales: 180 }, ];
  const orderStatusDistribution = [ { name: 'Concluídos', value: 70, color: '#10B981' }, { name: 'Pendentes', value: 15, color: '#F59E0B' }, { name: 'Em Processamento', value: 10, color: '#3B82F6' }, { name: 'Cancelados', value: 5, color: '#EF4444' }, ];

  // A página mostra um spinner enquanto o hook verifica a autenticação
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

  // Se o hook não redirecionou, a página é renderizada com segurança
  return (
    <>
      <Helmet>
        <title>Dashboard Admin - D'Pazz Imports</title>
        <meta name="description" content="Painel de controle administrativo da D'Pazz Imports." />
      </Helmet>
      <AdminLayout title="Dashboard">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total de Produtos" value="150" icon={<Package size={24} />} color="border-blue-500 text-blue-500" />
          <StatsCard title="Pedidos Pendentes" value="12" icon={<ShoppingCart size={24} />} color="border-orange-500 text-orange-500" />
          <StatsCard title="Total de Clientes" value="243" icon={<Users size={24} />} color="border-purple-500 text-purple-500" />
          <StatsCard title="Vendas Mensais" value="R$ 15.000" icon={<TrendingUp size={24} />} color="border-green-500 text-green-500" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartComponent type="line" title="Vendas e Receita Mensal" data={salesData} xAxisDataKey="name" dataKeys={[{ name: 'vendas', color: '#6366F1' }, { name: 'receita', color: '#10B981' }]} />
          <ChartComponent type="bar" title="Performance dos Produtos" data={productPerformanceData} xAxisDataKey="name" dataKeys={[{ name: 'views', color: '#F59E0B' }, { name: 'sales', color: '#3B82F6' }]} />
        </div>
        <div className="grid grid-cols-1 gap-6 mb-8">
          <ChartComponent type="pie" title="Distribuição do Status dos Pedidos" data={orderStatusDistribution} pieDataKey="value" nameKey="name" dataKeys={orderStatusDistribution.map(item => ({ name: item.name, color: item.color }))} />
        </div>
      </AdminLayout>
      {toast && ( <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} /> )}
    </>
  );
};