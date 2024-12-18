import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// File imports
import connectDB from './config/mongodb.js';
import UserRoutes from './routes/UserRoutes.js';
import ChatRoutes from './routes/ChatRoutes.js';
import QuizRoutes from './routes/QuizRoutes.js';
import ProgressRoutes from './routes/ProgressRoutes.js';

// Configuration and connecting to MongoDB database
dotenv.config();
connectDB();

// Creating server via express
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie']
}));

const PORT = process.env.PORT || 5000;

// Routes
app.use('/api/users', UserRoutes);
app.use('/api/chats', ChatRoutes);
app.use('/api/quizzes', QuizRoutes);
app.use('/api/progress', ProgressRoutes);

// Starting server
app.listen(PORT, console.log('Server is running on port 5000'));
