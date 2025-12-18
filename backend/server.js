// backend/server.js
import express from 'express';
import cors from 'cors';
// import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import authRoutes from './routers/auth.js';
import userRoutes from './routers/user.js';
import flashcardRoutes from './routers/flashcard.js';
import matchingRoutes from './routers/matching.js';
import contextRoutes from './routers/context.js';
import emotionTrainingRoutes from './routers/emotionTraining.js'; 
import aiRoutes from './routers/ai.js';
import progressRoutes from './routers/progress.js';
import reportRoutes from './routers/report.js';
import geminiRoutes from './routers/gemini.js'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/progress-map', progressRoutes);
app.use('/api/flashcard', flashcardRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/context', contextRoutes);
app.use('/api/emotion-training', emotionTrainingRoutes);
app.use('/api/ai', aiRoutes); 
app.use('/api/report', reportRoutes);
app.use('/api/gemini',geminiRoutes)

app.get('/', (req, res) => {
    res.send('Autism Learning App Backend is running...');
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});