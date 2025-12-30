import express from 'express';
import { registerSchema, loginSchema } from '../validation/validation.js';
import { validationMiddleware } from '../middlewares/validation.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
    register,
    login,
    verifyEmail,
    passwordResetEmailSend,
    passwordResetConfirmation,
    refreshAccessToken,
    logout,
    logoutAll,
} from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Yeni kullanici kaydi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Kullanici olusturuldu
 *       409:
 *         description: Email zaten kayitli
 */
router.post('/register', validationMiddleware(registerSchema), register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Kullanici girisi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Giris basarili
 *       401:
 *         description: Gecersiz email veya sifre
 */
router.post('/login', validationMiddleware(loginSchema), login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Access token yenileme
 *     description: Cookie'deki refresh token ile yeni access token al
 *     responses:
 *       200:
 *         description: Token yenilendi
 *       401:
 *         description: Refresh token bulunamadi veya gecersiz
 */
router.post('/refresh', refreshAccessToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Cikis yap
 *     description: Mevcut oturumdaki refresh token'i sil
 *     responses:
 *       200:
 *         description: Cikis basarili
 */
router.post('/logout', logout);

/**
 * @swagger
 * /auth/logout-all:
 *   post:
 *     tags: [Auth]
 *     summary: Tum cihazlardan cikis yap
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tum oturumlar kapatildi
 *       401:
 *         description: Yetkisiz erisim
 */
router.post('/logout-all', authMiddleware, logoutAll);

/**
 * @swagger
 * /auth/reset-password-email:
 *   post:
 *     tags: [Auth]
 *     summary: Sifre sifirlama emaili gonder
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Email gonderildi
 *       404:
 *         description: Kullanici bulunamadi
 */
router.post('/reset-password-email', passwordResetEmailSend);

/**
 * @swagger
 * /auth/reset-password-confirmation:
 *   post:
 *     tags: [Auth]
 *     summary: Sifre sifirlama onayi
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Sifre sifirlandi
 *       404:
 *         description: Kullanici bulunamadi
 */
router.post('/reset-password-confirmation', passwordResetConfirmation);

/**
 * @swagger
 * /auth/verify:
 *   get:
 *     tags: [Auth]
 *     summary: Email dogrulama
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email dogrulandi
 *       404:
 *         description: Kullanici bulunamadi
 */
router.get('/verify', verifyEmail);

export default router;
