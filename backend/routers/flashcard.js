// backend/routers/flashcard.js
import express from 'express';
import { getFlashcards } from '../controllers/flashcardController.js';

const router = express.Router();

// 🔥 ROUTE ĐƯỢC THAY ĐỔI ĐỂ NHẬN PATH PARAMETER 'level'
// Dạng gọi Backend: /api/flashcards/1
router.get('/:level', getFlashcards); 

export default router;