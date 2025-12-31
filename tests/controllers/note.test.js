import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';

// Mock env
vi.mock('../../config/env.js', () => ({
    JWT_SECRET_KEY: 'test-jwt-secret',
    JWT_EXPIRES_IN: '15m',
}));

import Note from '../../models/note.model.js';
import { generateToken } from '../../utils/token.js';
import {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote,
    searchNotes,
    queryNotes,
    favoriteNotes,
    addFavoritesNotes,
    removeFavoritesNotes,
} from '../../controllers/note.controller.js';

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

    app.post('/notes', authMiddleware, createNote);
    app.get('/notes', authMiddleware, getNotes);
    app.get('/notes/search', authMiddleware, searchNotes);
    app.get('/notes/query', authMiddleware, queryNotes);
    app.get('/notes/favorites', authMiddleware, favoriteNotes);
    app.get('/notes/:id', authMiddleware, getNoteById);
    app.put('/notes/:id', authMiddleware, updateNote);
    app.delete('/notes/:id', authMiddleware, deleteNote);
    app.post('/notes/favorites/:id', authMiddleware, addFavoritesNotes);
    app.delete('/notes/favorites/:id', authMiddleware, removeFavoritesNotes);

    return app;
};

describe('Note Controller', () => {
    let app;
    let authToken;
    const testUserId = new mongoose.Types.ObjectId();

    beforeEach(() => {
        app = createTestApp();
        authToken = generateToken({ id: testUserId.toString() });
    });

    describe('POST /notes', () => {
        it('should create a new note', async () => {
            const noteData = {
                title: 'Test Note',
                content: 'This is test content for the note',
                tags: ['test', 'vitest'],
                color: '#FF5733',
            };

            const res = await request(app)
                .post('/notes')
                .set('Authorization', `Bearer ${authToken}`)
                .send(noteData);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Note created');
            expect(res.body.data.title).toBe(noteData.title);
            expect(res.body.data.content).toBe(noteData.content);
        });

        it('should return 401 without auth token', async () => {
            const res = await request(app).post('/notes').send({
                title: 'Test',
                content: 'Content',
            });

            expect(res.status).toBe(401);
        });
    });

    describe('GET /notes', () => {
        beforeEach(async () => {
            await Note.create({
                title: 'Note 1',
                content: 'Content 1',
                userId: testUserId,
            });
            await Note.create({
                title: 'Note 2',
                content: 'Content 2',
                userId: testUserId,
            });
        });

        it('should get all notes for user', async () => {
            const res = await request(app)
                .get('/notes')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(2);
        });
    });

    describe('GET /notes/:id', () => {
        let noteId;

        beforeEach(async () => {
            const note = await Note.create({
                title: 'Single Note',
                content: 'Single content',
                userId: testUserId,
            });
            noteId = note._id.toString();
        });

        it('should get a note by id', async () => {
            const res = await request(app)
                .get(`/notes/${noteId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.title).toBe('Single Note');
        });

        it('should return 404 for non-existent note', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .get(`/notes/${fakeId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    describe('PUT /notes/:id', () => {
        let noteId;

        beforeEach(async () => {
            const note = await Note.create({
                title: 'Update Note',
                content: 'Original content',
                userId: testUserId,
            });
            noteId = note._id.toString();
        });

        it('should update a note', async () => {
            const res = await request(app)
                .put(`/notes/${noteId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Updated Title',
                    content: 'Updated content',
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.title).toBe('Updated Title');
        });
    });

    describe('DELETE /notes/:id', () => {
        let noteId;

        beforeEach(async () => {
            const note = await Note.create({
                title: 'Delete Note',
                content: 'To be deleted',
                userId: testUserId,
            });
            noteId = note._id.toString();
        });

        it('should delete a note', async () => {
            const res = await request(app)
                .delete(`/notes/${noteId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Note deleted');

            // Verify note is deleted
            const deletedNote = await Note.findById(noteId);
            expect(deletedNote).toBeNull();
        });
    });

    describe('GET /notes/search', () => {
        beforeEach(async () => {
            await Note.create({
                title: 'JavaScript Tutorial',
                content: 'Learn JavaScript basics',
                userId: testUserId,
            });
            await Note.create({
                title: 'Python Guide',
                content: 'Python programming',
                userId: testUserId,
            });
        });

        it('should search notes by query', async () => {
            const res = await request(app)
                .get('/notes/search?query=JavaScript')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
        });

        it('should return 400 without query parameter', async () => {
            const res = await request(app)
                .get('/notes/search')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('Favorites', () => {
        let noteId;

        beforeEach(async () => {
            const note = await Note.create({
                title: 'Favorite Note',
                content: 'Content for favorite',
                userId: testUserId,
                isFavorites: false,
            });
            noteId = note._id.toString();
        });

        it('should add note to favorites', async () => {
            const res = await request(app)
                .post(`/notes/favorites/${noteId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);

            const note = await Note.findById(noteId);
            expect(note.isFavorites).toBe(true);
        });

        it('should remove note from favorites', async () => {
            await Note.findByIdAndUpdate(noteId, { isFavorites: true });

            const res = await request(app)
                .delete(`/notes/favorites/${noteId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);

            const note = await Note.findById(noteId);
            expect(note.isFavorites).toBe(false);
        });

        it('should get favorite notes', async () => {
            await Note.findByIdAndUpdate(noteId, { isFavorites: true });

            const res = await request(app)
                .get('/notes/favorites')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });
});

