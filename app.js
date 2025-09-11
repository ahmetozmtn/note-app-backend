import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';

import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import noteRoutes from './routes/note.routes.js';
import { requestLogger } from './middlewares/logger.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

// Middlewares
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(helmet());
app.use(requestLogger);
// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
    res.status(200).send({ message: 'Hello World' });
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

app.use(errorMiddleware);

export default app;
