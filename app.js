import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import expressRate from 'express-rate-limit';

import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import noteRoutes from './routes/note.routes.js';
import userRoutes from './routes/user.routes.js';
import { requestLogger } from './middlewares/logger.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { notFoundMiddleware } from './middlewares/notFound.middleware.js';

const app = express();

// Middlewares
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(helmet());
app.use(requestLogger);
// Connect to MongoDB
connectDB();

// Rate Limiter
const rateLimiter = expressRate({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: 'Too many requests, please try again later.' },
});

app.use(rateLimiter);

app.get('/', (req, res) => {
    res.status(200).send({ message: 'Hello World' });
    console.log('Hello World');
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Error Middlewares
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
