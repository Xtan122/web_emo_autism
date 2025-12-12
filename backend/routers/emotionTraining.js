// backend/routers/emotionTraining.js
import express from 'express';
import { getEmotionTrainingLessons } from '../controllers/emotionTrainingController.js';

const router = express.Router();

// 🔥 ĐỊNH NGHĨA ROUTE ĐỂ NHẬN PATH PARAMETER
// Dạng gọi Backend: /api/emotion-training/1
router.get('/:level', getEmotionTrainingLessons);

export default router;