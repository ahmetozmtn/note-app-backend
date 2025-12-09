import jwt from 'jsonwebtoken';
import {
    JWT_SECRET_KEY,
    JWT_EXPIRES_IN,
    EMAIL_TOKEN_SECRET_KEY,
} from '../config/env.js';

export const generateToken = ({ id }) =>
    jwt.sign({ id }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });

export const generateEmailToken = ({ id }) =>
    jwt.sign({ id }, EMAIL_TOKEN_SECRET_KEY, { expiresIn: '15m' });

export const verifyToken = token => {
    try {
        return jwt.verify(token, JWT_SECRET_KEY);
    } catch (error) {
        throw new Error('Invalid token');
    }
};
