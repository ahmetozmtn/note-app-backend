import { describe, it, expect, vi } from 'vitest';

// Mock env variables before importing token utils
vi.mock('../../config/env.js', () => ({
    JWT_SECRET_KEY: 'test-jwt-secret',
    JWT_EXPIRES_IN: '15m',
    EMAIL_TOKEN_SECRET_KEY: 'test-email-secret',
    EMAIL_TOKEN_EXPIRES_IN: '1h',
    REFRESH_TOKEN_SECRET_KEY: 'test-refresh-secret',
    REFRESH_TOKEN_EXPIRES_IN: '7d',
}));

import {
    generateToken,
    verifyToken,
    generateEmailToken,
    verifyEmailToken,
    generateRefreshToken,
    verifyRefreshToken,
    hashToken,
    getRefreshTokenExpiry,
} from '../../utils/token.js';

describe('Token Utils', () => {
    const testUserId = '507f1f77bcf86cd799439011';

    describe('generateToken & verifyToken', () => {
        it('should generate and verify a valid JWT token', () => {
            const token = generateToken({ id: testUserId });

            expect(token).toBeDefined();
            expect(typeof token).toBe('string');

            const decoded = verifyToken(token);
            expect(decoded.id).toBe(testUserId);
        });

        it('should throw error for invalid token', () => {
            expect(() => verifyToken('invalid-token')).toThrow();
        });
    });

    describe('generateEmailToken & verifyEmailToken', () => {
        it('should generate and verify a valid email token', () => {
            const token = generateEmailToken({ id: testUserId });

            expect(token).toBeDefined();
            expect(typeof token).toBe('string');

            const decoded = verifyEmailToken(token);
            expect(decoded.id).toBe(testUserId);
        });

        it('should throw error for invalid email token', () => {
            expect(() => verifyEmailToken('invalid-token')).toThrow();
        });
    });

    describe('generateRefreshToken & verifyRefreshToken', () => {
        it('should generate and verify a valid refresh token', () => {
            const token = generateRefreshToken({ id: testUserId });

            expect(token).toBeDefined();
            expect(typeof token).toBe('string');

            const decoded = verifyRefreshToken(token);
            expect(decoded.id).toBe(testUserId);
        });

        it('should throw error for invalid refresh token', () => {
            expect(() => verifyRefreshToken('invalid-token')).toThrow();
        });
    });

    describe('hashToken', () => {
        it('should hash a token consistently', () => {
            const token = 'test-token-123';
            const hash1 = hashToken(token);
            const hash2 = hashToken(token);

            expect(hash1).toBe(hash2);
            expect(hash1).not.toBe(token);
            expect(hash1.length).toBe(64); // SHA-256 hex length
        });

        it('should produce different hashes for different tokens', () => {
            const hash1 = hashToken('token1');
            const hash2 = hashToken('token2');

            expect(hash1).not.toBe(hash2);
        });
    });

    describe('getRefreshTokenExpiry', () => {
        it('should return a future date', () => {
            const expiry = getRefreshTokenExpiry();

            expect(expiry).toBeInstanceOf(Date);
            expect(expiry.getTime()).toBeGreaterThan(Date.now());
        });
    });
});
