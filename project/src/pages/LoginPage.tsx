import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, AlertCircle, Mail, Lock, User, Phone, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

// IMPORTANT: Ensure this path is correct for your logo file!
// If your logo is directly in the 'public' folder: '/logompz-Photoroom.png'
// If you're importing it from an 'assets' folder: import DpazzLogo from '../assets/logompz-Photoroom.png';
const DpazzLogo = 'https://github.com/Lusxka/logompz/blob/e8477de0803ee21809d05f7ab35f73e2b4fc6164/logompz-Photoroom.png?raw=true'; 

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

      const passwordRegex = /^(?=.*?[A-Za-z])(?=.*?[0-9]).{8,}$/;
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
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSuccess(`Código de recuperação enviado para ${recoveryMethod === 'email' ? 'seu email' : 'seu telefone'}`);
        return;
      }

      let successAction;

      if (isRegistering) {
        successAction = await register(formData);
        if (!successAction) {
          setError('Este email já está em uso');
        }
      } else {
        successAction = await login(formData.email, formData.password);
        if (!successAction) {
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
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-gradient-to-r from-blue-900 to-cyan-500"> {/* Updated Gradient */}
      <Helmet>
        <title>
          {isForgotPassword
            ? 'Recuperar Senha'
            : isRegistering
              ? 'Criar Conta'
              : 'Login'} - D' PAZZ Imports
        </title>
        <meta
          name="description"
          content={
            isForgotPassword
              ? 'Recupere sua senha na D\' PAZZ Imports.'
              : isRegistering
                ? 'Crie sua conta na D\' PAZZ Imports.'
                : 'Acesse sua conta na D\' PAZZ Imports.'
          }
        />
      </Helmet>

      {/* Background Shapes/Elements (adjust colors to match new gradient or keep subtle) */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-700 rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div> {/* Adjusted color */}
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-cyan-400 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div> {/* Adjusted color */}
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div> {/* Adjusted color */}
      </div>

      {/* Back to Home Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 text-white hover:text-gray-200 flex items-center gap-2 text-lg font-medium transition-colors z-10"
      >
        <ArrowLeft size={20} />
        Voltar para Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
        className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-10 max-w-md w-full border border-gray-200 dark:border-gray-700"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img src={DpazzLogo} alt="D' PAZZ Imports Logo" className="h-16 object-contain" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            {isForgotPassword
              ? 'Recuperar Senha'
              : isRegistering
                ? 'Crie sua Conta'
                : 'Bem-vindo de volta!'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-md">
            {isForgotPassword
              ? 'Insira seu e-mail ou telefone para recuperar o acesso.'
              : isRegistering
                ? 'Junte-se à família D\' PAZZ Imports e comece a explorar!'
                : 'Faça login para gerenciar seus pedidos e favoritos.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg flex items-center gap-3 shadow-sm"
            >
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-3 shadow-sm"
            >
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{success}</p>
            </motion.div>
          )}

          {isForgotPassword ? (
            <>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setRecoveryMethod('email')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center ${
                    recoveryMethod === 'email'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 shadow-md'
                      : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-400'
                  }`}
                >
                  <Mail size={32} className="mb-2" />
                  <span className="block font-semibold">Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRecoveryMethod('sms')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center ${
                    recoveryMethod === 'sms'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 shadow-md'
                      : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-400'
                  }`}
                >
                  <Phone size={32} className="mb-2" />
                  <span className="block font-semibold">SMS</span>
                </button>
              </div>

              {recoveryMethod === 'email' ? (
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3.5 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="seu.email@exemplo.com"
                    />
                    <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" />
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="phone" className="sr-only">Telefone</label>
                  <div className="relative">
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3.5 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="(XX) XXXXX-XXXX"
                    />
                    <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" />
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {isRegistering && (
                <>
                  <div>
                    <label htmlFor="name" className="sr-only">Nome Completo</label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Nome Completo"
                      />
                      <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Nome e sobrenome, por favor.</p>
                  </div>

                  <div>
                    <label htmlFor="cpf" className="sr-only">CPF</label>
                    <div className="relative">
                      <input
                        type="text"
                        id="cpf"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleInputChange}
                        maxLength={14}
                        className="w-full pl-12 pr-4 py-3.5 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="XXX.XXX.XXX-XX"
                      />
                      <FileText size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="sr-only">Telefone</label>
                    <div className="relative">
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        maxLength={15}
                        className="w-full pl-12 pr-4 py-3.5 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="(XX) XXXXX-XXXX"
                      />
                      <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3.5 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Email"
                  />
                  <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="sr-only">Senha</label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    autoComplete={isRegistering ? 'new-password' : 'current-password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3.5 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Senha"
                  />
                  <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" />
                </div>
                {isRegistering && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Mínimo de 8 caracteres, letras e números.</p>
                )}
              </div>

              {isRegistering && (
                <div>
                  <label htmlFor="confirmPassword" className="sr-only">Confirmar Senha</label>
                  <div className="relative">
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3.5 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Confirmar Senha"
                    />
                    <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" />
                  </div>
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            // Changed button colors to match the new professional theme
            className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
          >
            {isLoading
              ? 'Processando...'
              : isForgotPassword
                ? 'Enviar Código de Recuperação'
                : isRegistering
                  ? 'Criar Minha Conta'
                  : 'Entrar na Conta'}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          {!isForgotPassword && (
            <button
              onClick={toggleMode}
              // Changed link colors to match the new professional theme
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium text-md"
            >
              {isRegistering ? 'Já tem uma conta? Faça login aqui' : 'Não tem uma conta? Crie sua conta agora!'}
            </button>
          )}

          {!isRegistering && (
            <button
              onClick={toggleForgotPassword}
              // Changed link colors to match the new professional theme
              className="block w-full text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium text-md"
            >
              {isForgotPassword ? 'Lembrei minha senha, voltar ao login' : 'Esqueceu sua senha?'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};