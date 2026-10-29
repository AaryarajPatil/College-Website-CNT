import express from 'express';
import {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from '../controllers/achievementController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getAchievements).post(createAchievement);
router.route('/:id').put(updateAchievement).delete(deleteAchievement);

export default router;
