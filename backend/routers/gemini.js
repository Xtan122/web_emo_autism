import express from 'express';
import { analyzeEmotion } from '../controllers/geminiController.js';

const router = express.Router();

// Route POST để phân tích cảm xúc
router.post('/analyze', analyzeEmotion);

export default router;