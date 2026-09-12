import express from 'express';
import { equipItem, unequipSlot } from '../controllers/equipController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.patch('/', equipItem);
router.patch('/unequip', unequipSlot);

export default router;
