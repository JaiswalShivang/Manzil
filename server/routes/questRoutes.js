import express from 'express';
import {
  getQuests,
  createQuest,
  updateQuest,
  completeQuest,
  deleteQuest,
} from '../controllers/questController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate, createQuestSchema, updateQuestSchema } from '../middleware/validate.js';
import { questCompleteLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// All quest routes require authentication
router.use(protect);

router.route('/')
  .get(getQuests)
  .post(validate(createQuestSchema), createQuest);

router.route('/:id')
  .patch(validate(updateQuestSchema), updateQuest)
  .delete(deleteQuest);

router.post('/:id/complete', questCompleteLimiter, completeQuest);

export default router;
