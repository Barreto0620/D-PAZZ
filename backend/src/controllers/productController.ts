import { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient'; // Importa o cliente do Supabase

// --- FUNÇÃO PARA BUSCAR PRODUTOS (COM FILTROS) ---
export const getAllProducts = async (req: Request, res: Response) => {
    try {
        // Inicia a construção da query
        let query = supabase
            .from('produtos') // ✅ ALTERAÇÃO: Tabela agora é 'produtos'
            .select(`
                *,
                categorias ( nome ),
                marcas ( nome, slug )
            `); // ✅ ALTERAÇÃO: Busca tabelas relacionadas 'categorias' e 'marcas'

        // Aplica filtros baseados nos parâmetros da URL (ex: /api/products?em_promocao=true)
        if (req.query.em_promocao === 'true') {
            query = query.eq('em_promocao', true);
        }
        if (req.query.mais_vendido === 'true') {
            query = query.eq('mais_vendido', true);
        }
        if (req.query.categoriaId) {
            query = query.eq('categoria_id', req.query.categoriaId);
        }

        // Executa a query
        const { data: produtos, error } = await query;

        if (error) throw error;

        // Formata os dados para o frontend
        const dadosFormatados = produtos.map((produto: any) => ({
            ...produto,
            categoryName: produto.categorias ? produto.categorias.nome : 'Sem Categoria',
            brandName: produto.marcas ? produto.marcas.nome : 'Sem Marca'
        }));

        res.status(200).json(dadosFormatados);

    } catch (error: any) {
        res.status(500).json({ message: error.message || "Ocorreu um erro ao buscar os produtos." });
    }
};

// --- FUNÇÃO PARA BUSCAR UM PRODUTO POR ID ---
export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { data: produto, error } = await supabase
            .from('produtos') // ✅ ALTERAÇÃO: Tabela agora é 'produtos'
            .select(`*, categorias ( nome ), marcas ( nome )`)
            .eq('id', id)
            .single();

        if (error) throw error;

        if (produto) {
            const dadoFormatado = {
                ...produto,
                categoryName: produto.categorias ? produto.categorias.nome : 'Sem Categoria',
                brandName: produto.marcas ? produto.marcas.nome : 'Sem Marca'
            };
            res.status(200).json(dadoFormatado);
        } else {
            res.status(404).json({ message: "Produto não encontrado." });
        }

    } catch (error: any) {
        res.status(500).json({ message: error.message || "Ocorreu um erro ao buscar o produto." });
    }
};

// ... (as funções de criar, editar e deletar produtos virão nos próximos passos)