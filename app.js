import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.js';

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
// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
    res.status(200).send({ message: 'Hello World' });
});

export default app;
