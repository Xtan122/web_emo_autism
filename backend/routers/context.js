import express from 'express';
import { getContextQuestions } from '../controllers/contextController.js';

const router = express.Router();

router.get('/:level', getContextQuestions);

export default router;