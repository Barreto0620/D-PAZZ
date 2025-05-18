import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Package, AlertCircle, Mail, Lock, User, Phone, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export const LoginPage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [recoveryMethod, setRecoveryMethod] = useState<'email' | 'sms'>('email');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    cpf: '',
    phone: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/cliente/painel');
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14);
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'phone') {
      formattedValue = formatPhone(value);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    setError(null);
    setSuccess(null);
  };

  const validateForm = () => {
    if (isForgotPassword) {
      if (recoveryMethod === 'email' && !formData.email) {
        setError('Por favor, insira seu email');
        return false;
      }
      if (recoveryMethod === 'sms' && !formData.phone) {
        setError('Por favor, insira seu telefone');
        return false;
      }
      return true;
    }

    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return false;
    }

    if (isRegistering) {
      if (!formData.name || !formData.cpf || !formData.phone) {
        setError('Por favor, preencha todos os campos obrigatórios');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('As senhas não coincidem');
        return false;
      }

      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
      if (!cpfRegex.test(formData.cpf)) {
        setError('CPF inválido. Use o formato XXX.XXX.XXX-XX');
        return false;
      }

      const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
      if (!phoneRegex.test(formData.phone)) {
        setError('Telefone inválido. Use o formato (XX) XXXXX-XXXX');
        return false;
      }

      const nameWords = formData.name.trim().split(/\s+/);
      if (nameWords.length < 2) {
        setError('Por favor, insira seu nome completo');
        return false;
      }

      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        setError('A senha deve ter pelo menos 8 caracteres, incluindo letras e números');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isForgotPassword) {
        // Simulate password recovery request
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSuccess(`Código de recuperação enviado para ${recoveryMethod === 'email' ? 'seu email' : 'seu telefone'}`);
        return;
      }

      let success;
      
      if (isRegistering) {
        success = await register(formData);
        if (!success) {
          setError('Este email já está em uso');
        }
      } else {
        success = await login(formData.email, formData.password);
        if (!success) {
          setError('Email ou senha inválidos');
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Ocorreu um erro. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setIsForgotPassword(false);
    setError(null);
    setSuccess(null);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      cpf: '',
      phone: ''
    });
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen bg-light dark:bg-dark flex items-center justify-center px-4">
      <Helmet>
        <title>
          {isForgotPassword 
            ? 'Recuperar Senha' 
            : isRegistering 
              ? 'Criar Conta' 
              : 'Login'} - ImportShop
        </title>
        <meta 
          name="description" 
          content={
            isForgotPassword 
              ? 'Recupere sua senha na ImportShop.' 
              : isRegistering 
                ? 'Crie sua conta na ImportShop.' 
                : 'Acesse sua conta na ImportShop.'
          } 
        />
      </Helmet>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-lighter rounded-2xl shadow-lg p-8 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Package size={40} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">
            {isForgotPassword 
              ? 'Recuperar Senha'
              : isRegistering 
                ? 'Criar Conta' 
                : 'Bem-vindo de volta!'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {isForgotPassword
              ? 'Escolha como deseja receber o código de recuperação'
              : isRegistering 
                ? 'Preencha seus dados para começar' 
                : 'Entre na sua conta para continuar'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} />
                <p>{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} />
                <p>{success}</p>
              </div>
            </div>
          )}

          {isForgotPassword ? (
            <>
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setRecoveryMethod('email')}
                  className={`flex-1 p-3 rounded-lg border transition-colors ${
                    recoveryMethod === 'email'
                      ? 'border-primary bg-primary/10 text-dark dark:text-white'
                      : 'border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <Mail size={24} className="mx-auto mb-2" />
                  <span className="block text-sm">Email</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setRecoveryMethod('sms')}
                  className={`flex-1 p-3 rounded-lg border transition-colors ${
                    recoveryMethod === 'sms'
                      ? 'border-primary bg-primary/10 text-dark dark:text-white'
                      : 'border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <Phone size={24} className="mx-auto mb-2" />
                  <span className="block text-sm">SMS</span>
                </button>
              </div>

              {recoveryMethod === 'email' ? (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-light text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Digite seu email"
                    />
                    <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Telefone
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-light text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="(XX) XXXXX-XXXX"
                    />
                    <Phone size={18} className="absolute left-3 top-3.5 text-gray-400" />
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {isRegistering && (
                <>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nome Completo
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-light text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Digite seu nome completo"
                      />
                      <User size={18} className="absolute left-3 top-3.5 text-gray-400" />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Digite seu nome e sobrenome</p>
                  </div>

                  <div>
                    <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      CPF
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="cpf"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleInputChange}
                        maxLength={14}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-light text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="XXX.XXX.XXX-XX"
                      />
                      <FileText size={18} className="absolute left-3 top-3.5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Telefone
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        maxLength={15}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-light text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="(XX) XXXXX-XXXX"
                      />
                      <Phone size={18} className="absolute left-3 top-3.5 text-gray-400" />
                    </div>
                  </div>
                </>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-light text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Digite seu email"
                  />
                  <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    autoComplete={isRegistering ? 'new-password' : 'current-password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-light text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Digite sua senha"
                  />
                  <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
                </div>
                {isRegistering && (
                  <p className="mt-1 text-xs text-gray-500">Mínimo de 8 caracteres, incluindo letras e números</p>
                )}
              </div>

              {isRegistering && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-light text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Confirme sua senha"
                    />
                    <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
                  </div>
                </div>
              )}
            </>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary hover:bg-secondary text-dark rounded-lg font-medium transition-colors disabled:opacity-70"
          >
            {isLoading 
              ? 'Processando...' 
              : isForgotPassword
                ? 'Enviar Código'
                : isRegistering 
                  ? 'Criar Conta' 
                  : 'Entrar'}
          </button>
        </form>
        
        <div className="mt-6 text-center space-y-4">
          {!isForgotPassword && (
            <button 
              onClick={toggleMode}
              className="text-primary hover:text-secondary transition-colors"
            >
              {isRegistering ? 'Já tem uma conta? Entre aqui' : 'Não tem uma conta? Cadastre-se'}
            </button>
          )}
          
          {!isRegistering && (
            <button
              onClick={toggleForgotPassword}
              className="block w-full text-primary hover:text-secondary transition-colors"
            >
              {isForgotPassword ? 'Voltar ao login' : 'Esqueceu sua senha?'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};