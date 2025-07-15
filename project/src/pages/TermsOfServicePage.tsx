// src/pages/TermsOfServicePage.tsx
import React from 'react';
import { Helmet } from 'react-helmet';
import { Navbar } from '../components/Navbar';

export const TermsOfServicePage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-neutral-900">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-20">
        <Helmet>
          <title>Termos de Serviço - D'Pazz Imports</title>
          <meta
            name="description"
            content="Leia atentamente os Termos de Serviço da D'Pazz Imports antes de utilizar nosso site."
          />
        </Helmet>
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-10">Termos de Serviço</h1>
        <div className="space-y-8 text-neutral-700 dark:text-neutral-300 leading-relaxed">
          <p>
            Ao acessar o site da D'Pazz Imports, você concorda com os termos e condições aqui descritos. Caso não
            concorde com qualquer parte dos termos, por favor, não utilize o site.
          </p>

          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">1. Uso do Site</h2>
          <p>
            Você se compromete a utilizar este site apenas para fins legais e de maneira que não infrinja os direitos
            de terceiros ou restrinja o uso e aproveitamento do site por terceiros.
          </p>

          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">2. Propriedade Intelectual</h2>
          <p>
            Todo o conteúdo disponível neste site, incluindo logotipos, textos, imagens e vídeos, são propriedade da
            D'Pazz Imports e protegidos por leis de direitos autorais.
          </p>

          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">3. Compras e Pagamentos</h2>
          <p>
            As compras estão sujeitas à disponibilidade de estoque. Reservamo-nos o direito de recusar ou cancelar
            pedidos por diversos motivos, incluindo erros de preço ou problemas de pagamento.
          </p>

          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">4. Modificações</h2>
          <p>
            Podemos alterar estes termos a qualquer momento, e é sua responsabilidade verificar esta página
            periodicamente.
          </p>

          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">5. Contato</h2>
          <p>
            Em caso de dúvidas sobre nossos termos, entre em contato pelo email:{' '}
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
