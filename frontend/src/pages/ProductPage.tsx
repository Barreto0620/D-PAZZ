// src/pages/ProductPage.tsx (VERSÃO FINAL CORRIGIDA)

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ProductDetail } from '../components/ProductDetail';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { supabase } from '../lib/supabase';

type ProdutoComRelacoes = Product & {
  categorias: { nome: string } | null;
  marcas: { nome: string } | null;
};

export const ProductPage: React.FC = () => {
  // A MUDANÇA PRINCIPAL ESTÁ AQUI. 'id' AGORA É TRATADO COMO TEXTO (string).
  const { id } = useParams<{ id: string }>(); 
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState({
    product: true,
    related: true
  });

  useEffect(() => {
    const fetchProductData = async () => {
      // A verificação agora é apenas se o 'id' existe.
      if (!id) return;

      setLoading({ product: true, related: true });
      
      try {
        // Buscamos o produto usando o 'id' como string, que é o correto para 'uuid'.
        // O select completo para buscar nomes de categoria e marca foi restaurado.
        const { data: productData, error: productError } = await supabase
          .from('produtos')
          .select(`*, categorias(nome), marcas(nome)`)
          .eq('id', id) // 'id' é usado diretamente como string
          .single();

        if (productError) throw productError;
        if (!productData) throw new Error('Nenhum dado retornado para este ID.');

        const formattedProduct: Product = {
            id: productData.id,
            name: productData.nome,
            description: productData.descricao || '',
            price: parseFloat(productData.preco),
            oldPrice: productData.preco_antigo ? parseFloat(productData.preco_antigo) : undefined,
            category: productData.categoria_id,
            categoryName: (productData as ProdutoComRelacoes).categorias?.nome || 'Desconhecida',
            brand: (productData as ProdutoComRelacoes).marcas?.nome || 'Sem Marca',
            images: Array.isArray(productData.imagens) ? productData.imagens : [],
            stock: productData.estoque || 0,
            rating: productData.avaliacoes || 0,
            reviewCount: productData.numero_avaliacoes || 0,
            color: productData.cor || undefined,
        };
        setProduct(formattedProduct);
        setLoading(prev => ({ ...prev, product: false }));

        const { data: relatedData, error: relatedError } = await supabase
          .from('produtos')
          .select('*')
          .eq('categoria_id', formattedProduct.category)
          .neq('id', formattedProduct.id)
          .limit(4);

        if (relatedError) throw relatedError;
        
        setRelatedProducts(relatedData as Product[]);

      } catch (error) {
        console.error('Erro ao buscar dados do produto:', error);
        setProduct(null);
        setRelatedProducts([]);
      } finally {
        setLoading({ product: false, related: false });
      }
    };

    fetchProductData();
  }, [id]);

  // Nenhuma mudança no JSX abaixo
  return (
    <div className="min-h-screen bg-light dark:bg-dark">
      <Helmet>
        <title>{product ? `${product.name} - SuaLoja` : 'Produto - SuaLoja'}</title>
        <meta 
          name="description" 
          content={product?.description || 'Detalhes do produto na SuaLoja.'} 
        />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <section className="mb-12">
          {loading.product ? (
            <div className="bg-light-darker dark:bg-dark-lighter rounded-2xl animate-pulse h-96" />
          ) : product ? (
            <ProductDetail product={product} />
          ) : (
            <div className="bg-white dark:bg-dark-lighter rounded-2xl p-8 text-center">
              <p className="text-xl text-dark dark:text-white">Produto não encontrado.</p>
            </div>
          )}
        </section>
        
        {product && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-dark dark:text-white mb-6">
              Produtos Relacionados
            </h2>
            {loading.related ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="bg-light-darker dark:bg-dark-lighter rounded-2xl animate-pulse h-80" />
                ))}
              </div>
            ) : relatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts.map(relatedProduct => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-dark-lighter rounded-2xl p-6 text-center">
                <p className="text-dark dark:text-white">Nenhum produto relacionado encontrado.</p>
              </div>
            )}
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};