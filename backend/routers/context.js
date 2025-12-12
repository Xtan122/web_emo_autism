// backend/routers/context.js
import express from 'express';
import { getContextQuestions } from '../controllers/contextController.js';

const router = express.Router();

// 🔥 ĐỊNH NGHĨA ROUTE ĐỂ NHẬN PATH PARAMETER
// Dạng gọi Backend: /api/contexts/1 (nếu bạn dùng tên số nhiều)
router.get('/:level', getContextQuestions);

export default router;