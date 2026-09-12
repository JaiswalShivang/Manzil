import express from 'express';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';
import {
  getStats,
  getUsers,
  updateUser,
  deleteUser,
  getQuests,
  completeQuest,
  deleteQuest,
  getShopItems,
  createShopItem,
  updateShopItem,
  deleteShopItem,
  reseedShop,
  grantAllUsers,
} from '../controllers/adminController.js';

const router = express.Router();

// Apply auth + admin clearance to all admin routes
router.use(protect, requireAdmin);

// Dashboard & telemetry stats
router.get('/stats', getStats);

// User / Agent management
router.get('/users', getUsers);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Directives / Quest management
router.get('/quests', getQuests);
router.post('/quests/:id/complete', completeQuest);
router.delete('/quests/:id', deleteQuest);

// The Vault / Shop inventory CRUD
router.get('/shop', getShopItems);
router.post('/shop', createShopItem);
router.patch('/shop/:id', updateShopItem);
router.delete('/shop/:id', deleteShopItem);

// System level actions
router.post('/system/seed', reseedShop);
router.post('/system/grant-all', grantAllUsers);

export default router;
