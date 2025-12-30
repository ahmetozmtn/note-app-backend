import dotenv from 'dotenv';

dotenv.config();

// Environment Variables

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT;
export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
export const COOKIE_SAME_SITE = process.env.COOKIE_SAME_SITE || 'strict';
export const BASE_URL = process.env.BASE_URL || 'http://localhost';

// MongoDB configuration
export const MONGO_URI = process.env.MONGO_URI;
export const MONGO_ROOT_USERNAME = process.env.MONGO_ROOT_USERNAME;
export const MONGO_ROOT_PASSWORD = process.env.MONGO_ROOT_PASSWORD;
export const MONGO_DATABASE = process.env.MONGO_DATABASE;

// JWT Configuration
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

// Email Configuration
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
export const EMAIL_HOST = process.env.EMAIL_HOST;
export const EMAIL_PORT = process.env.EMAIL_PORT;

// Email Token Configuration
export const EMAIL_TOKEN_SECRET_KEY = process.env.EMAIL_TOKEN_SECRET_KEY;
export const EMAIL_TOKEN_EXPIRES_IN = process.env.EMAIL_TOKEN_EXPIRES_IN;

// Refresh Token Configuration
export const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;
export const REFRESH_TOKEN_EXPIRES_IN =
    process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
export const REFRESH_TOKEN_COOKIE_MAX_AGE =
    parseInt(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE) ||
    7 * 24 * 60 * 60 * 1000;
