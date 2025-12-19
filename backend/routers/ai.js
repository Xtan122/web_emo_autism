import express from 'express';
import { getAiLessons } from '../controllers/aiController.js';

const router = express.Router();
router.get('/:level', getAiLessons);

export default router;