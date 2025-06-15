import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-dark-lighter mt-10 pt-10 pb-6 border-t border-gray-200 dark:border-gray-700 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center mb-4">
              <img
                src="https://raw.githubusercontent.com/Lusxka/logompz/refs/heads/main/logompz-Photoroom.png"
                alt="D'Pazz Imports"
                className="h-20 ml-20"
              />
            </Link>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              A D'Pazz Imports é sua loja online especializada em produtos importados de alta qualidade.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://facebook.com/dpazzimports" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
                <Facebook size={24} />
              </a>
              <a href="https://instagram.com/dpazzimports" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
                <Instagram size={24} />
              </a>
              <a href="https://twitter.com/dpazzimports" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
                <Twitter size={24} />
              </a>
            </div>
          </div>

          {/* Nossas Categorias - Atualizado para match do Header */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-dark dark:text-white">Nossas Categorias</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/marca/nike" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  Nike
                </Link>
              </li>
              <li>
                <Link to="/marca/adidas" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  Adidas
                </Link>
              </li>
              <li>
                <Link to="/marca/mizuno" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  Mizuno
                </Link>
              </li>
              <li>
                <Link to="/novidades" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  Novidades
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Informações e Suporte */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-dark dark:text-white">Informações</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/sobre" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/termos-de-servico" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  Termos de Serviço
                </Link>
              </li>
              <li>
                <Link to="/politica-de-privacidade" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/trocas-e-devolucoes" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  Trocas e Devoluções
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-dark dark:text-white">Atendimento ao Cliente</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-primary flex-shrink-0 mt-1" />
                <span className="text-gray-600 dark:text-gray-300">
                  Rua Comendador Artur Capodaglio, 306 - Americanópolis<br/>São Paulo - SP, 04410-080
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-primary" />
                <a href="tel:+551152047813" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  (11) 5204-7813
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-primary" />
                <a href="mailto:marciodpmarques@gmail.com" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  marciodpmarques@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} D'Pazz Imports. CNPJ: 904.861/0001-26. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Webcash Logo Container - Canto inferior direito */}
      <div className="absolute bottom-2 right-4 webcash-container">
        <div className="text-xs text-gray-400 dark:text-gray-500 opacity-60 hover:opacity-100 transition-opacity">
          <div id="webcash-logo" className="w-12 h-6 flex items-center justify-center">
            {/* Logo do Webcash será adicionada aqui */}
            <span className="text-xs font-light">webcash</span>
          </div>
        </div>
      </div>
    </footer>
  );
};