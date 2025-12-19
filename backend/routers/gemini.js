import express from 'express';
import { analyzeEmotion } from '../controllers/geminiController.js';

const router = express.Router();

router.post('/analyze', analyzeEmotion);

export default router;