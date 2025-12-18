import express from 'express';
import { getUserReport } from '../controllers/reportController.js';

import verifyToken from '../middleware/authMiddleware.js'; 

const router = express.Router();

// @route   GET /api/report
// @desc    Lấy báo cáo chi tiết
// @access  Private
router.get('/', verifyToken, getUserReport);

export default router;