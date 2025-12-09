import dotenv from 'dotenv';

dotenv.config();

export const MONGO_URI = process.env.MONGO_URI;

export const PORT = process.env.PORT;

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export const EMAIL_USER = process.env.EMAIL_USER;

export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

export const EMAIL_HOST = process.env.EMAIL_HOST;

export const EMAIL_PORT = process.env.EMAIL_PORT;

export const EMAIL_TOKEN_SECRET_KEY = process.env.EMAIL_TOKEN_SECRET_KEY;
