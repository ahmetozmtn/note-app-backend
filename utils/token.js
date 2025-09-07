import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config/env.js';

export const generateToken = payload => {
    return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1h' });
};

export const verifyToken = token => {
    return jwt.verify(token, JWT_SECRET_KEY);
};
