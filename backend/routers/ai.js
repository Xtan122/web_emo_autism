// backend/routers/ai.js
import express from 'express';
import { getAiLessons } from '../controllers/aiController.js';

const router = express.Router();

// 🔥 ĐỊNH NGHĨA ROUTE ĐỂ NHẬN PATH PARAMETER
// Dạng gọi Backend: /api/ai/1
router.get('/:level', getAiLessons);

export default router;