import express from 'express';
import connectDB from './config/mongodb.js';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';

// Configuration and connecting to MongoDB database
dotenv.config();
connectDB();

// Starting server
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

// Routes
app.listen(PORT, console.log('Server is running on port 5000'));
