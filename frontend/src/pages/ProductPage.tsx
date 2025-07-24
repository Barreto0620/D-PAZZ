// src/pages/ProductPage.tsx (VERSÃO 100% COMPLETA E CORRIGIDA)

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
  const { id } = useParams<{ id: string }>(); 
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState({ product: true, related: true });

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;

      setLoading({ product: true, related: true });
      
      try {
        const { data: productData, error: productError } = await supabase
          .from('produtos')
          .select(`*, categorias(nome), marcas(nome)`)
          .eq('id', id)
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
            categoryName: (productData as ProdutoComRelacoes).categorias?.nome || 'Categoria',
            brand: (productData as ProdutoComRelacoes).marcas?.nome || 'Marca',
            images: Array.isArray(productData.imagens) ? productData.imagens : [],
            stock: productData.estoque || 0,
            rating: productData.avaliacao || 0,
            reviewCount: productData.numero_avaliacoes || 0,
            color: productData.cor || undefined,
            tamanhos: productData.tamanhos || undefined,
        };
        setProduct(formattedProduct);
        setLoading(prev => ({ ...prev, product: false }));

        const { data: relatedData, error: relatedError } = await supabase
          .from('produtos')
          .select(`*, categorias(nome), marcas(nome)`)
          .eq('categoria_id', formattedProduct.category)
          .neq('id', formattedProduct.id)
          .limit(4);

        if (relatedError) throw relatedError;
        
        if (relatedData) {
          const formattedRelatedProducts: Product[] = relatedData.map(p => ({
            id: p.id, name: p.nome, description: p.descricao || '', price: parseFloat(p.preco),
            oldPrice: p.preco_antigo ? parseFloat(p.preco_antigo) : undefined, category: p.categoria_id,
            categoryName: (p as any).categorias?.nome || 'Categoria', brand: (p as any).marcas?.nome || 'Marca',
            images: Array.isArray(p.imagens) ? p.imagens : [], stock: p.estoque || 0,
            rating: p.avaliacao || 0, reviewCount: p.numero_avaliacoes || 0, color: p.cor || undefined, tamanhos: p.tamanhos || undefined,
          }));
          setRelatedProducts(formattedRelatedProducts);
        }

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

  return (
    <div className="min-h-screen bg-light dark:bg-dark">
      <Helmet>
        <title>{product ? `${product.name} - D'PAZZ Imports` : 'Produto'}</title>
        <meta name="description" content={product?.description || 'Detalhes do produto'} />
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
        
        {product && relatedProducts.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-dark dark:text-white mb-6">Produtos Relacionados</h2>
             {loading.related ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="bg-light-darker dark:bg-dark-lighter rounded-2xl animate-pulse h-80" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts.map(relatedProduct => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            )}
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};