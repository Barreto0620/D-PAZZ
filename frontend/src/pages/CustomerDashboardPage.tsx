
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { CustomerLayout } from '../components/Customer/CustomerLayout';
import { User, Edit, X, Save, Loader, Heart, ShoppingBag, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Toast } from '../components/Toast';
// ✅ CORREÇÃO: Importação do useProtectedRoute que estava faltando
import { useProtectedRoute } from '../hooks/useProtectedRoute';

// Componente para exibir um campo de informação, com estado de loading
const InfoField = ({ label, value, isLoading }: { label: string, value: string | undefined | null, isLoading: boolean }) => (
    <div className="md:col-span-1">
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{label}</label>
        <div className="p-4 bg-gray-50 dark:bg-dark-light rounded-xl border-2 border-transparent h-[56px] flex items-center">
            {isLoading ? (
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
            ) : (
                <p className="text-dark dark:text-white font-medium">
                    {value || <span className="italic text-gray-400 dark:text-gray-500">Não informado</span>}
                </p>
            )}
        </div>
    </div>
);

const EnhancedStatsCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string; gradient: string; trend?: string; }> = ({ title, value, icon, color, gradient, trend }) => ( <div className="group relative overflow-hidden"> <div className={`bg-gradient-to-br ${gradient} p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-opacity-20 ${color}`}> <div className="absolute inset-0 opacity-5"> <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white"></div> <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white"></div> </div> <div className="relative z-10"> <div className="flex items-center justify-between mb-4"> <div className={`p-3 rounded-xl bg-white bg-opacity-20 backdrop-blur-sm ${color} group-hover:scale-110 transition-transform duration-300`}> {icon} </div> {trend && ( <div className="flex items-center text-xs text-white bg-white bg-opacity-20 rounded-full px-2 py-1"> <TrendingUp size={12} className="mr-1" /> {trend} </div> )} </div> <div className="text-white"> <h3 className="text-2xl font-bold mb-1 transform group-hover:scale-105 transition-transform duration-300"> {value} </h3> <p className="text-sm opacity-90">{title}</p> </div> <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-full transition-all duration-700"></div> </div> </div> </div> );

export const CustomerDashboardPage: React.FC = () => {
    useProtectedRoute();
    const { user, profile, updateUserProfile, loadingProfile } = useAuth();
    const { favorites } = useFavorites();
    
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', cpf: '', phone: '', address: '' });

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.nome_completo || '',
                email: user?.email || '',
                cpf: profile.cpf || '',
                phone: profile.telefone || '',
                address: profile.endereco || ''
            });
        }
    }, [profile, user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateUserProfile({
                nome_completo: formData.name,
                telefone: formData.phone,
                cpf: formData.cpf,
                endereco: formData.address
            });
            setShowToast(true);
            setIsEditing(false);
            setTimeout(() => setShowToast(false), 3000);
        } catch (error) {
            console.error("Falha ao salvar:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Minha Conta - D'Pazz Imports</title>
                <meta name="description" content="Gerencie sua conta e pedidos na D'Pazz Imports." />
            </Helmet>
            
            <CustomerLayout title="Minha Conta">
                <div className="mb-8 p-6 bg-gradient-to-r from-blue-900 to-red-700 rounded-2xl text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">
                                Bem-vindo, {profile?.nome_completo?.split(' ')[0] || 'Cliente'}! 👋
                            </h2>
                            <p className="opacity-90">
                                Gerencie sua conta e acompanhe seus pedidos
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="w-20 h-20 bg-yellow-500 bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-yellow-400">
                                <User size={32} className="text-yellow-300" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <EnhancedStatsCard title="Compras Realizadas" value="0" icon={<ShoppingBag size={24} />} color="text-blue-900" gradient="from-blue-900 to-blue-800" trend="+0%" />
                    <EnhancedStatsCard title="Favoritos" value={String(favorites.length)} icon={<Heart size={24} />} color="text-red-700" gradient="from-red-700 to-red-600" />
                    <EnhancedStatsCard title="Último Acesso" value={user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('pt-BR') : 'Hoje'} icon={<Calendar size={24} />} color="text-green-700" gradient="from-green-700 to-green-600" />
                </div>
                
                <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-yellow-50 dark:from-blue-900/20 dark:to-yellow-900/20 p-6 border-b border-gray-200 dark:border-gray-600">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-900 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                                    <User size={24} className="text-yellow-300" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-dark dark:text-white">Informações Pessoais</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Gerencie seus dados pessoais</p>
                                </div>
                            </div>
                            {!isEditing && (
                                <button onClick={() => setIsEditing(true)} className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-yellow-300 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                                    <Edit size={18} className="group-hover:rotate-12 transition-transform" />
                                    <span className="font-medium">Editar</span>
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {!isEditing ? (
                                    <>
                                        <InfoField label="Nome Completo" value={profile?.nome_completo} isLoading={loadingProfile} />
                                        <InfoField label="Email" value={user?.email} isLoading={loadingProfile} />
                                        <InfoField label="CPF" value={profile?.cpf} isLoading={loadingProfile} />
                                        <InfoField label="Telefone" value={profile?.telefone} isLoading={loadingProfile} />
                                        <div className="md:col-span-2">
                                            <InfoField label="Endereço" value={profile?.endereco} isLoading={loadingProfile} />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Campo Nome - EDITÁVEL */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                                Nome Completo
                                            </label>
                                            <input 
                                                type="text" 
                                                name="name" 
                                                value={formData.name} 
                                                onChange={handleInputChange} 
                                                className="w-full p-4 rounded-xl border-2 dark:border-gray-700 bg-white dark:bg-dark-light text-dark dark:text-white focus:outline-none focus:border-blue-900 transition-colors"
                                            />
                                        </div>

                                        {/* Campo Email - DESABILITADO */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                                Email
                                            </label>
                                            <input 
                                                type="email" 
                                                name="email" 
                                                value={formData.email} 
                                                disabled 
                                                className="w-full p-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                            />
                                        </div>

                                        {/* Campo CPF - DESABILITADO */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                                CPF
                                            </label>
                                            <input 
                                                type="text" 
                                                name="cpf" 
                                                value={formData.cpf} 
                                                disabled 
                                                className="w-full p-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                            />
                                        </div>

                                        {/* Campo Telefone - DESABILITADO */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                                Telefone
                                            </label>
                                            <input 
                                                type="tel" 
                                                name="phone" 
                                                value={formData.phone} 
                                                disabled 
                                                className="w-full p-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                            />
                                        </div>

                                        {/* Campo Endereço - EDITÁVEL */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                                Endereço
                                            </label>
                                            <input 
                                                type="text" 
                                                name="address" 
                                                value={formData.address} 
                                                onChange={handleInputChange} 
                                                className="w-full p-4 rounded-xl border-2 dark:border-gray-700 bg-white dark:bg-dark-light text-dark dark:text-white focus:outline-none focus:border-blue-900 transition-colors"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                            
                            {isEditing && (
                                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsEditing(false)} 
                                        className="group flex items-center space-x-2 px-6 py-3 border-2 border-red-600 text-red-700 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <X size={18} />
                                        <span>Cancelar</span>
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={isSaving} 
                                        className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-700 to-green-600 text-white rounded-xl shadow-lg hover:from-green-600 hover:to-green-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader size={18} className="animate-spin" />
                                                <span>Salvando...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                <span>Salvar</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </CustomerLayout>

            {showToast && (
                <Toast 
                    message="Informações atualizadas com sucesso!" 
                    type="success" 
                    onClose={() => setShowToast(false)} 
                />
            )}
        </>
    );
};