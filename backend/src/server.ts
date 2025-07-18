import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(cors()); // Permite que seu frontend se comunique com este backend
app.use(express.json()); // Permite que o servidor entenda JSON

// Rotas da API
app.use('/api/products', productRoutes);
// Adicione aqui outras rotas (categorias, usuários, etc.)

// Rota de teste
app.get('/', (req, res) => {
    res.send('API D-PAZZ está funcionando!');
});

app.listen(port, () => {
    console.log(`🚀 Servidor backend rodando na porta ${port}`);
});