// frontend/src/components/Admin/CRUDForm.tsx
import React from 'react';
import { X, Save, Upload, Ruler, Plus, Trash2, Palette } from 'lucide-react';
import CurrencyInput from 'react-currency-input-field';
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
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    category: '',
    price: '',
    oldPrice: '',
    stock: '',
    images: [''],
    color: '',
    tamanhos: '',
    featured: false,
    onSale: false,
    bestSeller: false,
  });

  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isAddingCategory, setIsAddingCategory] = React.useState(false);
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [isSavingCategory, setIsSavingCategory] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(err => console.error("Falha ao buscar categorias", err));
  }, []);

  React.useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || '',
        price: product.price?.toString().replace('.', ',') || '',
        oldPrice: product.oldPrice?.toString().replace('.', ',') || '',
        stock: product.stock?.toString() || '0',
        images: product.images && product.images.length > 0 ? product.images : [''],
        color: product.color || '',
        tamanhos: (product.tamanhos || []).join(', '),
        featured: product.featured || false,
        onSale: product.onSale || false,
        bestSeller: product.bestSeller || false,
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const tamanhosArray = formData.tamanhos.split(',').map(t => t.trim()).filter(t => t);
    const imagesArray = formData.images.map(img => img.trim()).filter(img => img);

    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      price: parseFloat(formData.price?.replace(/\./g, '').replace(',', '.') || '0'),
      oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice.replace(/\./g, '').replace(',', '.') || '0') : undefined,
      stock: Number(formData.stock) || 0,
      images: imagesArray,
      color: formData.color.trim(),
      tamanhos: tamanhosArray,
      featured: formData.featured,
      onSale: formData.onSale,
      bestSeller: formData.bestSeller,
      rating: product?.rating ?? 0,
      reviewCount: product?.reviewCount ?? 0,
    };
    
    if (product) {
      onSave({ ...product, ...productData });
    } else {
      onSave(productData as Omit<Product, 'id'>);
    }
  };

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    handleChange('images', newImages);
  };

  const addImageField = () => {
    handleChange('images', [...formData.images, '']);
  };

  const removeImageField = (index: number) => {
    if (formData.images.length <= 1) {
      handleImageChange(0, '');
      return;
    }
    handleChange('images', formData.images.filter((_, i) => i !== index));
  };

  const handleSaveNewCategory = async () => {
    if (!newCategoryName.trim()) return;
    setIsSavingCategory(true);
    try {
      const newCategory = await createCategory({ name: newCategoryName.trim(), slug: createSlug(newCategoryName.trim()) });
      const updatedCategories = [...categories, newCategory].sort((a, b) => a.name.localeCompare(b.name));
      setCategories(updatedCategories);
      handleChange('category', newCategory.id);
      setNewCategoryName('');
      setIsAddingCategory(false);
    } catch (error) {
      alert("Erro ao criar nova categoria.");
    } finally {
      setIsSavingCategory(false);
    }
  };

  const predefinedColors = ['Preto', 'Branco', 'Vermelho', 'Azul', 'Verde', 'Amarelo', 'Rosa', 'Marrom', 'Cinza', 'Bege', 'Dourado', 'Prateado'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-lighter rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-dark-lighter border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{product ? 'Editar Produto' : 'Novo Produto'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Produto *</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={(e) => handleChange(e.target.name, e.target.value)} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" />
            </div>
             <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estoque</label>
              <input type="number" id="stock" name="stock" value={formData.stock} onChange={(e) => handleChange(e.target.name, e.target.value)} min="0" className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
            <textarea id="description" name="description" value={formData.description} onChange={(e) => handleChange(e.target.name, e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" />
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoria *</label>
                <div className="flex items-center gap-2">
                  <select id="category" name="category" value={formData.category} onChange={(e) => handleChange(e.target.name, e.target.value)} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
                    <option value="">Selecione uma categoria</option>
                    {categories.map(cat => ( <option key={cat.id} value={cat.id}>{cat.name}</option> ))}
                  </select>
                </div>
            </div>
             <div>
               <label htmlFor="tamanhos" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><Ruler size={16} className="inline mr-1"/> Tamanhos</label>
               <input type="text" id="tamanhos" name="tamanhos" value={formData.tamanhos} onChange={(e) => handleChange(e.target.name, e.target.value)} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" placeholder="Ex: 38, 39, 40" />
             </div>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preço {formData.onSale ? 'Promocional' : ''} *</label>
              <CurrencyInput id="price" name="price" className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" value={formData.price} onValueChange={(value, name) => handleChange(name || 'price', value)} placeholder="R$ 0,00" intlConfig={{ locale: 'pt-BR', currency: 'BRL' }} />
            </div>
            {formData.onSale && (
              <div>
                <label htmlFor="oldPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preço Antigo (De:)</label>
                <CurrencyInput id="oldPrice" name="oldPrice" className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" value={formData.oldPrice} onValueChange={(value, name) => handleChange(name || 'oldPrice', value)} placeholder="R$ 0,00" intlConfig={{ locale: 'pt-BR', currency: 'BRL' }} />
              </div>
            )}
           </div>
           <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><Palette size={16} className="inline mr-1"/> Cor</label>
            <select id="color" name="color" value={formData.color} onChange={(e) => handleChange(e.target.name, e.target.value)} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
              <option value="">Selecione uma cor</option>
              {predefinedColors.map(color => ( <option key={color} value={color}>{color}</option> ))}
            </select>
           </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><Upload size={16} /> URLs de Imagem</label>
            <div className="space-y-2">
              {formData.images.map((url, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input type="url" value={url} onChange={(e) => handleImageChange(index, e.target.value)} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" placeholder={`https://... (Imagem ${index + 1})`} />
                  <button type="button" onClick={() => removeImageField(index)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full" title="Remover Imagem"><Trash2 size={16}/></button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addImageField} className="mt-2 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"><Plus size={16} /> Adicionar outra URL</button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg space-y-4">
            <ToggleSwitch label="Em Promoção" enabled={formData.onSale} onChange={(val) => handleChange('onSale', val)} />
            <ToggleSwitch label="Marcar como Destaque" enabled={formData.featured} onChange={(val) => handleChange('featured', val)} />
            <ToggleSwitch label="Marcar como Mais Vendido" enabled={formData.bestSeller} onChange={(val) => handleChange('bestSeller', val)} />
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