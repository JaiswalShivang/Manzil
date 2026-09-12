import express from 'express';
import { equipItem, unequipSlot } from '../controllers/loadoutController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.patch('/equip', protect, equipItem);
router.patch('/unequip', protect, unequipSlot);

export default router;
