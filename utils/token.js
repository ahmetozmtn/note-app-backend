import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY, JWT_EXPIRES_IN } from '../config/env.js';

export const generateToken = ({ id }) =>
    jwt.sign({ id }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });

export const verifyToken = token => {
    try {
        return jwt.verify(token, JWT_SECRET_KEY);
    } catch (error) {
        throw new Error('Invalid token');
    }
};
