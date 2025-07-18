import { Router } from 'express';
import { getAllProducts } from '../controllers/productController';

const router = Router();

// Quando o frontend chamar GET /api/products, a função getAllProducts será executada
router.get('/', getAllProducts);

export default router;