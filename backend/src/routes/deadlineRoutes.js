import express from 'express';
import {
  getDeadlines,
  createDeadline,
  toggleDeadline,
  deleteDeadline,
} from '../controllers/deadlineController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getDeadlines).post(createDeadline);
router.route('/:id/toggle').patch(toggleDeadline);
router.route('/:id').delete(deleteDeadline);

export default router;
