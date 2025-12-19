import express from 'express';
import { getMatchingCards } from '../controllers/matchingController.js';

const router = express.Router();

router.get('/:level', getMatchingCards);

export default router;