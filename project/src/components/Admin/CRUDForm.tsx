import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react'; // Adicionado Plus e Minus
import { Product, Category } from '../../types';
import { getCategories } from '../../services/api';

interface CRUDFormProps {
  product?: Product;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id'> | Product) => void;
}

export const CRUDForm: React.FC<CRUDFormProps> = ({ 
  product, 
  onClose, 
  onSave 
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Omit<Product, 'id'> | Product>({
    id: product?.id || 0,
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    oldPrice: product?.oldPrice || undefined,
    category: product?.category || (categories.length > 0 ? categories[0].id : 1), // Define a primeira categoria como padrão se houver
    images: product?.images && product.images.length > 0 ? product.images : [''], // Garante pelo menos um campo de imagem
    featured: product?.featured || false,
    onSale: product?.onSale || false,
    bestSeller: product?.bestSeller || false,
    stock: product?.stock || 0,
    rating: product?.rating || 4.0, // Valor padrão para rating
    reviewCount: product?.reviewCount || 0 // Valor padrão para reviewCount
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        // Se for um novo produto e não houver categoria selecionada, defina a primeira como padrão
        if (!product && data.length > 0 && !formData.category) {
          setFormData(prev => ({ ...prev, category: data[0].id }));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [product, formData.category]); // Adicionado formData.category para re-avaliar padrão

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (['price', 'oldPrice', 'stock'].includes(name)) {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else if (name === 'category') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index: number) => {
    if (formData.images.length <= 1) return; // Garante que sempre haja pelo menos um campo de imagem
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Preço deve ser maior que zero';
    }
    
    if (formData.stock < 0) {
      newErrors.stock = 'Estoque não pode ser negativo';
    }
    
    if (formData.images.some(img => !img.trim())) {
      newErrors.images = 'Todas as imagens devem ter URLs válidas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-dark dark:text-white">
            {product ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-light-darker dark:hover:bg-dark-light transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border ${
                errors.name 
                  ? 'border-red-500 dark:border-red-500' 
                  : 'border-gray-300 dark:border-gray-700'
              } bg-white dark:bg-dark-light text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full p-3 rounded-lg border ${
                errors.description 
                  ? 'border-red-500 dark:border-red-500' 
                  : 'border-gray-300 dark:border-gray-700'
              } bg-white dark:bg-dark-light text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>
          
          {/* Price and Old Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Preço (R$)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full p-3 rounded-lg border ${
                  errors.price 
                    ? 'border-red-500 dark:border-red-500' 
                    : 'border-gray-300 dark:border-gray-700'
                } bg-white dark:bg-dark-light text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary`}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">{errors.price}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="oldPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Preço Antigo (R$, opcional)
              </label>
              <input
                type="number"
                id="oldPrice"
                name="oldPrice"
                value={formData.oldPrice || ''}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-light text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          {/* Category and Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categoria
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-light text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estoque
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className={`w-full p-3 rounded-lg border ${
                  errors.stock 
                    ? 'border-red-500 dark:border-red-500' 
                    : 'border-gray-300 dark:border-gray-700'
                } bg-white dark:bg-dark-light text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary`}
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-500">{errors.stock}</p>
              )}
            </div>
          </div>
          
          {/* Flags: Featured, On Sale, Best Seller */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="featured" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Destacado
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="onSale"
                name="onSale"
                checked={formData.onSale}
                onChange={handleChange}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="onSale" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Em Promoção
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="bestSeller"
                name="bestSeller"
                checked={formData.bestSeller}
                onChange={handleChange}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="bestSeller" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Mais Vendido
              </label>
            </div>
          </div>
          
          {/* Images */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Imagens
              </label>
              <button
                type="button"
                onClick={addImageField}
                className="flex items-center gap-1 text-sm text-primary hover:text-secondary"
              >
                <Plus size={16} /> Adicionar Imagem
              </button>
            </div>
            
            {formData.images.map((image, index) => (
              <div key={index} className="flex mb-2 gap-2 items-center">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="URL da imagem"
                  className={`flex-1 p-3 rounded-lg border ${
                    errors.images 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-700'
                  } bg-white dark:bg-dark-light text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary`}
                />
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  disabled={formData.images.length <= 1}
                  className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-light text-gray-500 hover:text-red-500 disabled:opacity-50"
                >
                  <Minus size={20} /> {/* Ícone de remover */}
                </button>
              </div>
            ))}
            {errors.images && (
              <p className="mt-1 text-sm text-red-500">{errors.images}</p>
            )}
          </div>
          
          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-light-darker dark:hover:bg-dark-light transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary hover:bg-secondary text-dark rounded-lg transition-colors"
            >
              {product ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};