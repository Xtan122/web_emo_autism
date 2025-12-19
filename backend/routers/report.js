import express from 'express';
import { getUserReport } from '../controllers/reportController.js';

import verifyToken from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.get('/', verifyToken, getUserReport);

export default router;