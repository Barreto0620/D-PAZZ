import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ProductDetail } from '../components/ProductDetail';
import { ProductCard } from '../components/ProductCard';
import { getProductById, getProductsByCategory } from '../services/api';
import { Product } from '../types';

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id) : 0;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState({
    product: true,
    related: true
  });

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(prev => ({ ...prev, product: true }));
      try {
        const data = await getProductById(productId);
        setProduct(data);
        
        if (data) {
          // Fetch related products from the same category
          fetchRelatedProducts(data.category, data.id);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(prev => ({ ...prev, product: false }));
      }
    };

    const fetchRelatedProducts = async (categoryId: number, currentProductId: number) => {
      setLoading(prev => ({ ...prev, related: true }));
      try {
        const products = await getProductsByCategory(categoryId);
        // Filter out the current product and limit to 4 products
        const related = products
          .filter(p => p.id !== currentProductId)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoading(prev => ({ ...prev, related: false }));
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  return (
    <div className="min-h-screen bg-light dark:bg-dark">
      <Helmet>
        <title>{product ? `${product.name} - ImportShop` : 'Produto - ImportShop'}</title>
        <meta 
          name="description" 
          content={product?.description || 'Detalhes do produto na ImportShop.'} 
        />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        {/* Product Detail */}
        <section className="mb-12">
          {loading.product ? (
            <div className="bg-light-darker dark:bg-dark-lighter rounded-2xl animate-pulse h-96" />
          ) : product ? (
            <ProductDetail product={product} />
          ) : (
            <div className="bg-white dark:bg-dark-lighter rounded-2xl p-8 text-center">
              <p className="text-xl text-dark dark:text-white">
                Produto não encontrado.
              </p>
            </div>
          )}
        </section>
        
        {/* Related Products */}
        {product && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-dark dark:text-white mb-6">
              Produtos Relacionados
            </h2>
            
            {loading.related ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                  <div 
                    key={index} 
                    className="bg-light-darker dark:bg-dark-lighter rounded-2xl animate-pulse h-80"
                  />
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
                <p className="text-dark dark:text-white">
                  Nenhum produto relacionado encontrado.
                </p>
              </div>
            )}
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};