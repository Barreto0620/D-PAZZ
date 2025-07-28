// frontend/src/components/Admin/CRUDForm.tsx (VERSÃO FINAL)
import React, { useState, useEffect } from 'react';
import { X, Save, Upload, Palette, Ruler, Plus, ArrowLeft } from 'lucide-react';
import { Product, Category } from '../../types';
import { getCategories, createCategory } from '../../services/api';
import { ToggleSwitch } from './ToggleSwitch';

interface CRUDFormProps {
  product?: Product;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id'> | Product) => void;
}

const createSlug = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

export const CRUDForm: React.FC<CRUDFormProps> = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    oldPrice: '',
    stock: '',
    image: '',
    color: '',
    tamanhos: '',
    featured: false,
    onSale: false,
    bestSeller: false,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) { console.error("Falha ao buscar categorias", error); }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || '',
        price: product.price != null ? product.price.toString() : '',
        oldPrice: product.oldPrice != null ? product.oldPrice.toString() : '',
        stock: product.stock != null ? product.stock.toString() : '0',
        image: Array.isArray(product.images) ? product.images[0] || '' : '',
        color: product.color || '',
        tamanhos: Array.isArray(product.tamanhos) ? product.tamanhos.join(', ') : '',
        featured: product.featured || false,
        onSale: product.onSale || false,
        bestSeller: product.bestSeller || false,
      });
    }
  }, [product]);

  const validateForm = () => { /* ... */ return true; };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSaving(true);
    try {
      const tamanhosArray = formData.tamanhos.split(',').map(t => t.trim()).filter(t => t);
      const productData = {
        name: formData.name.trim(), description: formData.description.trim(), category: formData.category, price: Number(formData.price) || 0, oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined, stock: Number(formData.stock) || 0, images: formData.image ? [formData.image.trim()] : [], color: formData.color.trim(), tamanhos: tamanhosArray, featured: formData.featured, onSale: formData.onSale, bestSeller: formData.bestSeller, rating: product?.rating ?? 0, reviewCount: product?.reviewCount ?? 0,
      };
      if (product) {
        onSave({ ...product, ...productData });
      } else {
        onSave(productData as Omit<Product, 'id'>);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      setIsSaving(false); // Garante que o botão seja reativado em caso de erro
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveNewCategory = async () => {
    if (!newCategoryName.trim()) return;
    setIsSavingCategory(true);
    try {
      const newCategory = await createCategory({ name: newCategoryName.trim(), slug: createSlug(newCategoryName.trim()) });
      const updatedCategories = [...categories, newCategory].sort((a, b) => a.name.localeCompare(b.name));
      setCategories(updatedCategories);
      setFormData(prev => ({ ...prev, category: newCategory.id }));
      setNewCategoryName('');
      setIsAddingCategory(false);
    } catch (error) {
      console.error("Falha ao criar nova categoria", error);
      alert("Erro ao criar nova categoria.");
    } finally {
      setIsSavingCategory(false);
    }
  };

  const predefinedColors = ['Preto', 'Branco', 'Vermelho', 'Azul', 'Verde', 'Amarelo', 'Rosa', 'Marrom', 'Cinza', 'Bege', 'Dourado', 'Prateado'];
  const inputClasses = `w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500`;
  const defaultBorder = `border-gray-300 dark:border-gray-600`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-lighter rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-dark-lighter border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{product ? 'Editar Produto' : 'Novo Produto'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome do Produto *</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`${inputClasses} ${defaultBorder}`} />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descrição</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className={`${inputClasses} ${defaultBorder}`} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoria *</label>
              {isAddingCategory ? (
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setIsAddingCategory(false)} className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white" title="Voltar"><ArrowLeft size={18}/></button>
                  <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Nome da nova categoria" className="flex-grow px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button type="button" onClick={handleSaveNewCategory} disabled={isSavingCategory} className="px-4 py-2 bg-primary hover:bg-secondary text-dark rounded-lg disabled:opacity-50">{isSavingCategory ? '...' : 'Salvar'}</button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <select id="category" name="category" value={formData.category} onChange={handleChange} className={`${inputClasses} ${defaultBorder}`}>
                    <option value="">Selecione uma categoria</option>
                    {categories.map(cat => ( <option key={cat.id} value={cat.id}>{cat.name}</option> ))}
                  </select>
                  <button type="button" onClick={() => setIsAddingCategory(true)} className="p-2 flex-shrink-0 bg-gray-200 dark:bg-gray-600 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500" title="Adicionar Nova Categoria"><Plus size={18}/></button>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estoque</label>
              <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} min="0" className={`${inputClasses} ${defaultBorder}`} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preço {formData.onSale ? 'Promocional (Por:)' : ''} *</label>
              <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} step="0.01" min="0" className={`${inputClasses} ${defaultBorder}`} />
            </div>
            {formData.onSale && (
              <div>
                <label htmlFor="oldPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preço Antigo (De:)</label>
                <input type="number" id="oldPrice" name="oldPrice" value={formData.oldPrice} onChange={handleChange} step="0.01" min="0" className={`${inputClasses} ${defaultBorder}`} />
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <label htmlFor="color" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><Palette size={16} /> Cor</label>
               <select id="color" name="color" value={formData.color} onChange={handleChange} className={`${inputClasses} ${defaultBorder}`}>
                 <option value="">Selecione uma cor</option>
                 {predefinedColors.map(color => ( <option key={color} value={color}>{color}</option> ))}
               </select>
             </div>
             <div>
               <label htmlFor="tamanhos" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><Ruler size={16} /> Tamanhos</label>
               <input type="text" id="tamanhos" name="tamanhos" value={formData.tamanhos} onChange={handleChange} className={`${inputClasses} ${defaultBorder}`} placeholder="Ex: 38, 39, 40, 41-44" />
             </div>
           </div>
          <div>
            <label htmlFor="image" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><Upload size={16} /> URL da Imagem Principal</label>
            <input type="url" id="image" name="image" value={formData.image} onChange={handleChange} className={`${inputClasses} ${defaultBorder}`} />
          </div>
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg space-y-4">
            <ToggleSwitch label="Em Promoção" enabled={formData.onSale} onChange={(val) => setFormData(p => ({...p, onSale: val}))} />
            <ToggleSwitch label="Marcar como Destaque" enabled={formData.featured} onChange={(val) => setFormData(p => ({...p, featured: val}))} />
            <ToggleSwitch label="Marcar como Mais Vendido" enabled={formData.bestSeller} onChange={(val) => setFormData(p => ({...p, bestSeller: val}))} />
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="button" onClick={onClose} disabled={isSaving} className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg">Cancelar</button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 bg-primary hover:bg-secondary text-dark rounded-lg flex items-center gap-2">
              {isSaving ? (<>Salvando...</>) : (<><Save size={16} />{product ? 'Atualizar' : 'Criar'} Produto</>)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};