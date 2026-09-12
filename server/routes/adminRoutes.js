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
  getItems,
  updateItem,
  deleteItem,
  uploadZipAssets,
  uploadZipMiddleware,
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

// Paperdoll Avatar Item Management CRUD & Asset Zip Upload
router.post('/assets/upload', uploadZipMiddleware.single('file'), uploadZipAssets);
router.get('/items', getItems);
router.patch('/items/:id', updateItem);
router.delete('/items/:id', deleteItem);

// Backwards compatibility aliases for /shop
router.get('/shop', getItems);
router.patch('/shop/:id', updateItem);
router.delete('/shop/:id', deleteItem);

// System level actions
router.post('/system/grant-all', grantAllUsers);

export default router;
