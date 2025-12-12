import express from 'express';
import { getUserReport } from '../controllers/reportController.js';
import verifyToken from '../middleware/authMiddleware.js'; // Import middleware

const router = express.Router();

// Thêm verifyToken để bảo vệ trang báo cáo
router.get('/', verifyToken, getUserReport);

export default router;