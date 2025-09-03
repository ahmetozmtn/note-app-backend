import express from 'express';
import connectDB from './config/db.js';

const app = express();

app.use(express.json());

// Connect to MongoDB
connectDB();

export default app;
