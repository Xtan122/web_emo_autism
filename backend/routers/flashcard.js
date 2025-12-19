import express from 'express';
import { getFlashcards } from '../controllers/flashcardController.js';

const router = express.Router();

router.get('/:level', getFlashcards); 

export default router;