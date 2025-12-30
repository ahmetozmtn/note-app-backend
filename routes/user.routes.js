import express from 'express';

import { getUser, updateUser } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { userMiddleware } from '../middlewares/user.middleware.js';
import {
    validationMiddleware,
    validationMiddlewareParams,
} from '../middlewares/validation.middleware.js';
import { updateUserSchema, paramsIdSchema } from '../validation/validation.js';

const router = express.Router();

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Kullanici bilgilerini getir
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Kullanici ID
 *     responses:
 *       200:
 *         description: Kullanici bilgileri
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Yetkisiz erisim
 *       404:
 *         description: Kullanici bulunamadi
 */
router.get(
    '/:id',
    authMiddleware,
    validationMiddlewareParams(paramsIdSchema),
    userMiddleware,
    getUser
);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Kullanici bilgilerini guncelle
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Kullanici ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Kullanici guncellendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Yetkisiz erisim
 *       404:
 *         description: Kullanici bulunamadi
 *       409:
 *         description: Email zaten kayitli
 */
router.put(
    '/:id',
    authMiddleware,
    validationMiddlewareParams(paramsIdSchema),
    userMiddleware,
    validationMiddleware(updateUserSchema),
    updateUser
);

export default router;
