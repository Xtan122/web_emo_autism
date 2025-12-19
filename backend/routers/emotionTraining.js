import express from 'express';
import { getEmotionTrainingLessons } from '../controllers/emotionTrainingController.js';

const router = express.Router();

router.get('/:level', getEmotionTrainingLessons);

export default router;