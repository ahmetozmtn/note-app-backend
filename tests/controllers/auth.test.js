import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';

// Mock email service
vi.mock('../../utils/email.service.js', () => ({
    sendVerificationEmail: vi.fn().mockResolvedValue(true),
    sendPasswordResetEmail: vi.fn().mockResolvedValue(true),
}));

// Mock env
vi.mock('../../config/env.js', () => ({
    JWT_SECRET_KEY: 'test-jwt-secret',
    JWT_EXPIRES_IN: '15m',
    EMAIL_TOKEN_SECRET_KEY: 'test-email-secret',
    EMAIL_TOKEN_EXPIRES_IN: '1h',
    REFRESH_TOKEN_SECRET_KEY: 'test-refresh-secret',
    REFRESH_TOKEN_EXPIRES_IN: '7d',
    REFRESH_TOKEN_COOKIE_MAX_AGE: 604800000,
    NODE_ENV: 'test',
    COOKIE_SAME_SITE: 'strict',
}));

import {
    register,
    login,
    logout,
    refreshAccessToken,
} from '../../controllers/auth.controller.js';

// Create test app
const createTestApp = () => {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());

    app.post('/register', register);
    app.post('/login', login);
    app.post('/logout', logout);
    app.post('/refresh', refreshAccessToken);

    return app;
};

describe('Auth Controller', () => {
    let app;

    beforeEach(() => {
        app = createTestApp();
        vi.clearAllMocks();
    });

    describe('POST /register', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
            };

            const res = await request(app).post('/register').send(userData);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('User registered');
            expect(res.body.data.email).toBe(userData.email);
            expect(res.body.data.name).toBe(userData.name);
            expect(res.body.data.accessToken).toBeDefined();
            expect(res.headers['set-cookie']).toBeDefined();
        });

        it('should return 409 if email already exists', async () => {
            const userData = {
                name: 'Test User',
                email: 'duplicate@example.com',
                password: 'password123',
            };

            // Create user first
            await request(app).post('/register').send(userData);

            // Try to register again
            const res = await request(app).post('/register').send(userData);

            expect(res.status).toBe(409);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Email already exists');
        });
    });

    describe('POST /login', () => {
        const userData = {
            name: 'Login User',
            email: 'login@example.com',
            password: 'password123',
        };

        beforeEach(async () => {
            await request(app).post('/register').send(userData);
        });

        it('should login successfully with correct credentials', async () => {
            const res = await request(app).post('/login').send({
                email: userData.email,
                password: userData.password,
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Login successful');
            expect(res.body.data.accessToken).toBeDefined();
            expect(res.body.data.email).toBe(userData.email);
        });

        it('should return 401 for invalid email', async () => {
            const res = await request(app).post('/login').send({
                email: 'wrong@example.com',
                password: userData.password,
            });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Invalid email or password');
        });

        it('should return 401 for invalid password', async () => {
            const res = await request(app).post('/login').send({
                email: userData.email,
                password: 'wrongpassword',
            });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Invalid email or password');
        });
    });

    describe('POST /logout', () => {
        it('should logout successfully', async () => {
            // Register and get cookie
            const userData = {
                name: 'Logout User',
                email: 'logout@example.com',
                password: 'password123',
            };

            const registerRes = await request(app)
                .post('/register')
                .send(userData);
            const cookies = registerRes.headers['set-cookie'];

            const res = await request(app)
                .post('/logout')
                .set('Cookie', cookies);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Logged out successfully');
        });

        it('should handle logout without refresh token', async () => {
            const res = await request(app).post('/logout');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe('POST /refresh', () => {
        it('should return 401 if no refresh token provided', async () => {
            const res = await request(app).post('/refresh');

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Refresh token not found');
        });

        it('should refresh token successfully with valid refresh token', async () => {
            // Register to get refresh token
            const userData = {
                name: 'Refresh User',
                email: 'refresh@example.com',
                password: 'password123',
            };

            const registerRes = await request(app)
                .post('/register')
                .send(userData);
            const cookies = registerRes.headers['set-cookie'];

            const res = await request(app)
                .post('/refresh')
                .set('Cookie', cookies);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.accessToken).toBeDefined();
        });
    });
});
