import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { uploadImage, uploadMultipleImages, deleteImage } from '../controllers/uploadController.js';

const router = express.Router();

// Upload single image
router.post('/single', upload.single('image'), uploadImage);

// Upload multiple images (tối đa 10 ảnh)
router.post('/multiple', upload.array('images', 10), uploadMultipleImages);

// Delete image
router.delete('/delete', deleteImage);

export default router;
