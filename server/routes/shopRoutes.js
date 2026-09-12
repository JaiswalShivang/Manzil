import express from 'express';
import { getShopItems, purchaseItem } from '../controllers/shopController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/items', getShopItems);
router.post('/purchase/:itemId', protect, purchaseItem);

export default router;
