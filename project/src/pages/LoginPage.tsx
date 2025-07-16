import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, AlertCircle, Mail, Lock, User, Phone, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

// URL do logo da D'PAZZ
const DpazzLogo = 'https://github.com/Lusxka/logompz/blob/e8477de0803ee21809d05f7ab35f73e2b4fc6164/logompz-Photoroom.png?raw=true';

// URL da imagem de fundo
const newBackgroundImage = 'https://raw.githubusercontent.com/Barreto0620/img_public/d405c1b9b97e7823508aecf32bb28ce62a1cbbbc/logo_grafite.png';

export const LoginPage: React.FC = () => {
  // ... (toda a lógica de estado e funções permanece a mesma)
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
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      if (isForgotPassword) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSuccess(`Código de recuperação enviado para ${recoveryMethod === 'email' ? 'seu email' : 'seu telefone'}`);
        return;
      }
      
      const successAction = isRegistering
        ? await register(formData)
        : await login(formData.email, formData.password);

      if (!successAction) {
        setError(isRegistering ? 'Este email já está em uso' : 'Email ou senha inválidos');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setIsForgotPassword(false);
    setError(null);
    setSuccess(null);
    setFormData({ email: '', password: '', confirmPassword: '', name: '', cpf: '', phone: '' });
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-slate-900">
      <Helmet>
        <title>
          {isForgotPassword ? 'Recuperar Senha' : isRegistering ? 'Criar Conta' : 'Login'} - D' PAZZ Imports
        </title>
        <meta name="description" content={isForgotPassword ? 'Recupere sua senha na D\' PAZZ Imports.' : isRegistering ? 'Crie sua conta na D\' PAZZ Imports.' : 'Acesse sua conta na D\' PAZZ Imports.'} />
      </Helmet>

      {/* === FUNDO CORRIGIDO COM MAIOR VISIBILIDADE === */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 opacity-80" // Opacidade da imagem aumentada
          style={{ backgroundImage: `url(${newBackgroundImage})` }}
        ></div>
        {/* Sobreposição de cor mais suave */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-blue-900/70 to-slate-800/60 backdrop-blur-sm"></div>
        
        {/* Efeitos visuais mantidos */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-700 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-red-600 rounded-full mix-blend-screen filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-green-600 rounded-full mix-blend-screen filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      <Link
        to="/"
        className="absolute top-6 left-6 text-white/80 hover:text-white flex items-center gap-2 text-lg font-medium transition-all duration-300 z-20 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-black/40"
      >
        <ArrowLeft size={20} />
        Voltar para Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="relative z-10 bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/30 p-8 md:p-10 max-w-md w-full transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img src={DpazzLogo} alt="D' PAZZ Imports Logo" className="h-16 object-contain drop-shadow-lg" />
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full scale-150 -z-10"></div>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">
            {isForgotPassword ? 'Recuperar Senha' : isRegistering ? 'Crie sua Conta' : 'Bem-vindo de volta!'}
          </h1>
          <p className="text-gray-400 text-md">
            {isForgotPassword ? 'Insira seus dados para recuperar o acesso.' : isRegistering ? 'Junte-se à família D\' PAZZ Imports!' : 'Faça login para gerenciar seus pedidos.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ... (código dos inputs, erros, etc., permanece o mesmo) ... */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-900/30 text-red-300 rounded-lg flex items-center gap-3"
            >
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-green-900/30 text-green-300 rounded-lg flex items-center gap-3"
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
                      ? 'border-blue-500 bg-blue-900/30 text-blue-300 shadow-md'
                      : 'border-gray-700 text-gray-400 hover:border-blue-600'
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
                    ? 'border-blue-500 bg-blue-900/30 text-blue-300 shadow-md'
                    : 'border-gray-700 text-gray-400 hover:border-blue-600'
                  }`}
                >
                  <Phone size={32} className="mb-2" />
                  <span className="block font-semibold">SMS</span>
                </button>
              </div>

              {recoveryMethod === 'email' ? (
                <div>
                  <div className="relative">
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3.5 rounded-lg border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="seu.email@exemplo.com" />
                    <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="relative">
                    <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3.5 rounded-lg border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="(XX) XXXXX-XXXX" />
                    <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {isRegistering && (
                <>
                  <div>
                    <div className="relative">
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3.5 rounded-lg border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Nome Completo" />
                      <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    </div>
                    <p className="mt-1.5 text-xs text-gray-500">Nome e sobrenome, por favor.</p>
                  </div>
                   <div>
                     <div className="relative">
                       <input type="text" id="cpf" name="cpf" value={formData.cpf} onChange={handleInputChange} maxLength={14} className="w-full pl-12 pr-4 py-3.5 rounded-lg border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="XXX.XXX.XXX-XX" />
                       <FileText size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                     </div>
                   </div>
                   <div>
                     <div className="relative">
                       <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} maxLength={15} className="w-full pl-12 pr-4 py-3.5 rounded-lg border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="(XX) XXXXX-XXXX" />
                       <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                     </div>
                   </div>
                </>
              )}
              
              <div>
                <div className="relative">
                  <input type="email" id="email" name="email" autoComplete="email" value={formData.email} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3.5 rounded-lg border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Email" />
                  <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>
              </div>
              
              <div>
                <div className="relative">
                  <input type="password" id="password" name="password" autoComplete={isRegistering ? 'new-password' : 'current-password'} value={formData.password} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3.5 rounded-lg border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Senha" />
                  <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>
                {isRegistering && <p className="mt-1.5 text-xs text-gray-500">Mínimo de 8 caracteres, com letras e números.</p>}
              </div>

              {isRegistering && (
                <div>
                  <div className="relative">
                    <input type="password" id="confirmPassword" name="confirmPassword" autoComplete="new-password" value={formData.confirmPassword} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3.5 rounded-lg border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Confirmar Senha" />
                    <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="shine-button w-full relative overflow-hidden py-3.5 bg-gradient-to-r from-blue-600 via-blue-700 to-slate-800 hover:from-blue-700 hover:to-slate-900 text-white rounded-lg font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg shadow-blue-800/20 hover:shadow-xl hover:shadow-blue-700/30"
          >
            {isLoading ? 'Processando...' : isForgotPassword ? 'Enviar Código' : isRegistering ? 'Criar Minha Conta' : 'Entrar na Conta'}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          {!isForgotPassword && (
            <button onClick={toggleMode} className="text-blue-400 hover:text-blue-300 transition-colors font-medium text-md">
              {isRegistering ? 'Já tem uma conta? Faça login' : 'Não tem uma conta? Crie agora!'}
            </button>
          )}

          {!isRegistering && (
            <button onClick={toggleForgotPassword} className="block w-full text-blue-400 hover:text-blue-300 transition-colors font-medium text-md">
              {isForgotPassword ? 'Lembrei minha senha, voltar' : 'Esqueceu sua senha?'}
            </button>
          )}
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        .shine-button::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0) 60%);
          transform: rotate(45deg);
          transition: transform 0.6s ease;
          opacity: 0;
        }
        .shine-button:hover::after {
          opacity: 1;
          transform: scale(2) rotate(25deg) translateX(20%);
        }
      `}</style>
    </div>
  );
};