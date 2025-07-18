import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase'; // ✅ 1. Importa o cliente Supabase que você já configurou
import { Session, User } from '@supabase/supabase-js';
import { Profile } from '../types'; // Supondo que você tenha um tipo Profile em types.ts

// ✅ 2. A interface agora reflete os dados reais do Supabase e do seu perfil
type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email, password) => Promise<any>;
  register: (formData) => Promise<any>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    // ✅ 3. Gerenciamento de sessão automático com o Supabase
    useEffect(() => {
        // Pega a sessão ativa quando o app carrega
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Ouve por qualquer mudança no estado de autenticação (LOGIN, LOGOUT, etc)
        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        // Limpa o listener quando o componente é desmontado
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    // ✅ 4. Busca o perfil do usuário na sua tabela 'perfis' sempre que o usuário logar
    useEffect(() => {
        if (user) {
            supabase
                .from('perfis') // Busca na sua tabela em português
                .select('*')
                .eq('id', user.id)
                .single()
                .then(({ data, error }) => {
                    if (error) {
                        console.error("Erro ao buscar perfil do usuário:", error);
                    }
                    if (data) {
                        setProfile(data);
                        // Define se é admin baseado na coluna 'funcao' da sua tabela
                        setIsAdmin(data.funcao === 'admin'); 
                    }
                });
        } else {
            // Limpa o perfil se o usuário deslogar
            setProfile(null);
            setIsAdmin(false);
        }
    }, [user]);

    // ✅ 5. Função de REGISTRO real com Supabase
    const register = async (formData) => {
        const { email, password, nome_completo, cpf, telefone } = formData;
        
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                // Estes dados são passados para o gatilho SQL que cria o perfil
                data: {
                    nome_completo: nome_completo,
                    cpf: cpf,
                    telefone: telefone,
                },
            },
        });
        if (error) throw error;
        return data;
    };

    // ✅ 6. Função de LOGIN real com Supabase
    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    };

    // ✅ 7. Função de LOGOUT real com Supabase
    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    const value = {
        user,
        profile,
        session,
        isAuthenticated: !!user,
        isAdmin,
        loading,
        login,
        register,
        logout,
    };

    // Mostra um loading enquanto a sessão inicial é verificada
    if (loading) {
        return <div>Carregando sessão...</div>
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};