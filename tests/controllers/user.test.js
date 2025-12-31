import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';

// Mock env
vi.mock('../../config/env.js', () => ({
    JWT_SECRET_KEY: 'test-jwt-secret',
    JWT_EXPIRES_IN: '15m',
}));

import User from '../../models/user.model.js';
import { generateToken } from '../../utils/token.js';
import { getUser, updateUser } from '../../controllers/user.controller.js';

// Auth middleware mock
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, 'test-jwt-secret');
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Create test app
const createTestApp = () => {
    const app = express();
    app.use(express.json());

    app.get('/users/:id', authMiddleware, getUser);
    app.put('/users/:id', authMiddleware, updateUser);

    return app;
};

describe('User Controller', () => {
    let app;
    let testUser;
    let authToken;

    beforeEach(async () => {
        app = createTestApp();

        testUser = await User.create({
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'hashedpassword123',
            isVerified: false,
        });

        authToken = generateToken({ id: testUser._id.toString() });
    });

    describe('GET /users/:id', () => {
        it('should get user by id', async () => {
            const res = await request(app)
                .get(`/users/${testUser._id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.email).toBe(testUser.email);
            expect(res.body.data.name).toBe(testUser.name);
            expect(res.body.data.password).toBeUndefined(); // Password should not be returned
        });

        it('should return 404 for non-existent user', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .get(`/users/${fakeId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('User not found');
        });

        it('should return 401 without auth token', async () => {
            const res = await request(app).get(`/users/${testUser._id}`);

            expect(res.status).toBe(401);
        });
    });

    describe('PUT /users/:id', () => {
        it('should update user successfully', async () => {
            const updateData = {
                name: 'Updated Name',
                email: 'updated@example.com',
            };

            const res = await request(app)
                .put(`/users/${testUser._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.name).toBe(updateData.name);
            expect(res.body.data.email).toBe(updateData.email);
        });

        it('should allow user to keep same email', async () => {
            const updateData = {
                name: 'New Name',
                email: testUser.email, // Same email
            };

            const res = await request(app)
                .put(`/users/${testUser._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should return 409 if email already exists for another user', async () => {
            // Create another user
            const anotherUser = await User.create({
                name: 'Another User',
                email: 'another@example.com',
                password: 'hashedpassword',
            });

            const updateData = {
                name: 'Test',
                email: anotherUser.email, // Try to use another user's email
            };

            const res = await request(app)
                .put(`/users/${testUser._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateData);

            expect(res.status).toBe(409);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Email already exists');
        });

        it('should return 404 for non-existent user', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .put(`/users/${fakeId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ name: 'Test', email: 'newemail@example.com' });

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });
});

