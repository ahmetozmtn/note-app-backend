import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {
    JWT_SECRET_KEY,
    JWT_EXPIRES_IN,
    EMAIL_TOKEN_SECRET_KEY,
    EMAIL_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_SECRET_KEY,
    REFRESH_TOKEN_EXPIRES_IN,
} from '../config/env.js';

// Token Create
export const generateToken = ({ id }) => {
    try {
        return jwt.sign({ id }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
    } catch (error) {
        throw new Error(error);
    }
};

// Token Verify
export const verifyToken = token => {
    try {
        return jwt.verify(token, JWT_SECRET_KEY);
    } catch (error) {
        throw new Error(error);
    }
};

// Email Token Create
export const generateEmailToken = ({ id }) => {
    try {
        return jwt.sign({ id }, EMAIL_TOKEN_SECRET_KEY, {
            expiresIn: EMAIL_TOKEN_EXPIRES_IN,
        });
    } catch (error) {
        throw new Error(error);
    }
};

// Email Token Verify
export const verifyEmailToken = token => {
    try {
        return jwt.verify(token, EMAIL_TOKEN_SECRET_KEY);
    } catch (error) {
        throw new Error(error);
    }
};

// Refresh Token
export const generateRefreshToken = ({ id }) => {
    try {
        return jwt.sign({ id }, REFRESH_TOKEN_SECRET_KEY, {
            expiresIn: REFRESH_TOKEN_EXPIRES_IN,
        });
    } catch (error) {
        throw new Error(error);
    }
};

export const verifyRefreshToken = token => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET_KEY);
    } catch (error) {
        throw new Error(error);
    }
};

// Token hash create
export const hashToken = token => {
    return crypto.createHash('sha256').update(token).digest('hex');
};

// Refresh token time calc.
export const getRefreshTokenExpiry = () => {
    const expiresIn = REFRESH_TOKEN_EXPIRES_IN || '7d';
    const match = expiresIn.match(/^(\d+)([dhms])$/);

    if (!match) {
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Default 1 week
    }

    const value = parseInt(match[1]);
    const unit = match[2];

    const multipliers = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
    };

    return new Date(Date.now() + value * multipliers[unit]);
};
