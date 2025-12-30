import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import expressRate from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import { connectDB } from './config/db.js';
import swaggerSpec from './config/swagger.js';
import authRoutes from './routes/auth.routes.js';
import noteRoutes from './routes/note.routes.js';
import userRoutes from './routes/user.routes.js';
import { requestLogger } from './middlewares/logger.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { notFoundMiddleware } from './middlewares/notFound.middleware.js';

import { CORS_ORIGIN } from './config/env.js';

const app = express();

// Middlewares
app.use(
    cors({
        origin: CORS_ORIGIN,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(helmet());
app.use(requestLogger);

// Connect to MongoDB
connectDB();

// Rate Limiter
const rateLimiter = expressRate({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Too many requests, please try again later.' },
});

app.use(rateLimiter);

app.get('/', (req, res) => {
    res.status(200).send({ message: 'Hello World' });
});

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/notes', noteRoutes);

// Error Middlewares
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
