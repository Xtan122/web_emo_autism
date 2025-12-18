// backend/routers/user.js
import express from 'express';
import { getUserProfile } from '../controllers/userController.js';
import verifyToken from '../middleware/authMiddleware.js'; // Nhớ import đúng cách (default/named)

const router = express.Router();

// Route: GET /api/user/profile
router.get('/profile', verifyToken, getUserProfile);

export default router;