import express from 'express';
import { getProgressMap, logActivity } from '../controllers/progressController.js';
import verifyToken from '../middleware/authMiddleware.js'; // Import middleware

const router = express.Router();

router.get('/', verifyToken, getProgressMap); 
router.post('/log', verifyToken, logActivity);

export default router;