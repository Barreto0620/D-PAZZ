import { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*, categories(name)'); // Pega todos os produtos e o nome da categoria

        if (error) throw error;

        // Formata os dados para o frontend
        const formattedData = data.map((product: any) => ({
            ...product,
            categoryName: product.categories ? product.categories.name : 'Sem Categoria'
        }));

        res.status(200).json(formattedData);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Adicione aqui outras funções como getProductById, getCategories, etc.