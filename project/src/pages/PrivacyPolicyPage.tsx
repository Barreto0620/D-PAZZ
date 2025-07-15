// src/pages/PrivacyPolicyPage.tsx
import React from 'react';
import { Helmet } from 'react-helmet';
import { Navbar } from '../components/Navbar';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-neutral-900">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-20">
        <Helmet>
          <title>Política de Privacidade - D'Pazz Imports</title>
          <meta
            name="description"
            content="Saiba como a D'Pazz Imports coleta, usa e protege suas informações pessoais."
          />
        </Helmet>
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-10">Política de Privacidade</h1>
        <div className="space-y-8 text-neutral-700 dark:text-neutral-300 leading-relaxed">
          <p>
            A D'Pazz Imports respeita sua privacidade e está comprometida com a proteção dos seus dados pessoais.
            Esta política explica como coletamos, usamos e protegemos suas informações.
          </p>

          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">1. Coleta de Informações</h2>
          <p>
            Coletamos informações fornecidas por você como nome, email, endereço, telefone e dados de pagamento
            quando realiza uma compra ou entra em contato conosco.
          </p>

          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">2. Uso das Informações</h2>
          <p>
            Utilizamos suas informações para processar pedidos, enviar atualizações, personalizar sua experiência
            e melhorar nossos serviços.
          </p>

          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">3. Compartilhamento de Dados</h2>
          <p>
            Não vendemos ou compartilhamos seus dados com terceiros, exceto quando necessário para entrega ou
            cumprimento legal.
          </p>

          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">4. Segurança</h2>
          <p>
            Utilizamos medidas de segurança técnicas e administrativas para proteger suas informações contra
            acessos não autorizados.
          </p>

          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">5. Direitos do Usuário</h2>
          <p>
            Você pode solicitar a correção, exclusão ou acesso aos seus dados pessoais a qualquer momento através
            do email:{' '}
            <a
              href="mailto:contato@dpazzimports.com"
              className="text-primary underline hover:opacity-80"
            >
              contato@dpazzimports.com
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};
