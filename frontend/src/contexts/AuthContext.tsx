import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { Profile } from '../types';

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  loadingProfile: boolean; // ADICIONADO: Loading específico para o perfil
  login: (email, password) => Promise<any>;
  register: (formData) => Promise<any>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<Profile>) => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingProfile, setLoadingProfile] = useState(true); // NOVO estado

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (user) {
            setLoadingProfile(true); 
            supabase
                .from('perfis')
                .select('*')
                .eq('id', user.id)
                .single()
                .then(({ data, error }) => {
                    if (error) console.error("Erro ao buscar perfil:", error);
                    if (data) {
                        setProfile(data);
                        setIsAdmin(data.funcao === 'admin'); 
                    }
                })
                .finally(() => {
                    setLoadingProfile(false); 
                });
        } else {
            setProfile(null);
            setIsAdmin(false);
            setLoadingProfile(false); 
        }
    }, [user]);

    const register = async (formData) => {
        const { email, password, nome_completo, cpf, telefone } = formData;
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { nome_completo, cpf, telefone } },
        });
        if (error) throw error;
        return data;
    };

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };
    
    const updateUserProfile = async (updates: Partial<Profile>) => {
        if (!user) throw new Error("Usuário não autenticado.");
        const { data, error } = await supabase
            .from('perfis')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single();
        if (error) throw error;
        setProfile(data);
        return data;
    };

    const value = {
        user,
        profile,
        session,
        isAuthenticated: !!user,
        isAdmin,
        loading,
        loadingProfile,
        login,
        register,
        logout,
        updateUserProfile
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};