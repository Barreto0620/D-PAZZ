import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Página não encontrada - D'Pazz Imports</title>
        <meta name="description" content="A página que você está procurando não foi encontrada." />
      </Helmet>
      <div className="min-h-screen bg-light-darker dark:bg-dark flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-9xl font-bold text-primary dark:text-primary-dark mb-4">404</h1>
        <p className="text-3xl font-medium text-dark dark:text-white mb-4">Página Não Encontrada</p>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          Desculpe, a página que você está procurando não existe ou foi movida.
        </p>
        <Link 
          to="/" 
          className="px-6 py-3 bg-primary hover:bg-secondary text-dark font-semibold rounded-lg shadow-md transition-colors"
        >
          Voltar para a Página Inicial
        </Link>
      </div>
    </>
  );
};