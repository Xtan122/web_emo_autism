// backend/routers/matching.js
import express from 'express';
import { getMatchingCards } from '../controllers/matchingController.js';

const router = express.Router();

// 🔥 ĐỊNH NGHĨA ROUTE ĐỂ NHẬN PATH PARAMETER
// Dạng gọi Backend: /api/matchings/1 (nếu bạn dùng tên số nhiều)
router.get('/:level', getMatchingCards);

export default router;