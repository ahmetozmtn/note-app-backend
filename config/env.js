import dotenv from 'dotenv';

dotenv.config();

export const MONGO_URI = process.env.MONGO_URI;

export const PORT = process.env.PORT;

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
