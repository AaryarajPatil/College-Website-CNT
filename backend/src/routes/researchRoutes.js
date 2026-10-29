import express from 'express';
import {
  getPapers,
  getPaperById,
  createPaper,
  updatePaper,
  deletePaper,
} from '../controllers/researchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getPapers).post(createPaper);
router.route('/:id').get(getPaperById).put(updatePaper).delete(deletePaper);

export default router;
