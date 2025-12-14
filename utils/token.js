import jwt from 'jsonwebtoken';
import {
    JWT_SECRET_KEY,
    JWT_EXPIRES_IN,
    EMAIL_TOKEN_SECRET_KEY,
    EMAIL_TOKEN_EXPIRES_IN,
} from '../config/env.js';

export const generateToken = ({ id }) => {
    try {
        return jwt.sign({ id }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
    } catch (error) {
        throw new Error(error);
    }
};

export const verifyToken = token => {
    try {
        return jwt.verify(token, JWT_SECRET_KEY);
    } catch (error) {
        throw new Error(error);
    }
};

export const generateEmailToken = ({ id }) => {
    try {
        return jwt.sign({ id }, EMAIL_TOKEN_SECRET_KEY, {
            expiresIn: EMAIL_TOKEN_EXPIRES_IN,
        });
    } catch (error) {
        throw new Error(error);
    }
};

export const verifyEmailToken = token => {
    try {
        return jwt.verify(token, EMAIL_TOKEN_SECRET_KEY);
    } catch (error) {
        throw new Error(error);
    }
};
