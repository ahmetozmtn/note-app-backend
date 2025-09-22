import winston from 'winston';
import 'winston-mongodb';
import { MONGO_URI } from '../config/env.js';

const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
    level: 'info',
    format: combine(timestamp(), json()),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
        }),
        new winston.transports.File({
            filename: 'logs/info.log',
            level: 'info',
        }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
        new winston.transports.MongoDB({
            db: MONGO_URI,
            collection: 'app_logs',
            level: 'info',
            format: combine(timestamp(), json()),
        }),
    ],
});

export default logger;
