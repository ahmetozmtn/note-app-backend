import express from 'express';

import {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote,
    queryNotes,
    searchNotes,
    addFavoritesNotes,
    favoriteNotes,
    removeFavoritesNotes,
} from '../controllers/note.controller.js';
import {
    validationMiddleware,
    validationMiddlewareParams,
} from '../middlewares/validation.middleware.js';
import {
    createNoteSchema,
    getNoteByIdSchema,
    updateNoteSchema,
    deleteNoteSchema,
} from '../validation/validation.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
    noteOwnerById,
    noteOwnerGetAllNotes,
} from '../middlewares/noteOwner.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /notes/query:
 *   get:
 *     tags: [Notes]
 *     summary: Tag'e gore notlari filtrele
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tag
 *         required: true
 *         schema:
 *           type: string
 *         description: Filtrelenecek tag
 *     responses:
 *       200:
 *         description: Notlar listelendi
 *       400:
 *         description: Tag parametresi gerekli
 *       401:
 *         description: Yetkisiz erisim
 */
router.get('/query', authMiddleware, noteOwnerGetAllNotes, queryNotes);

/**
 * @swagger
 * /notes/search:
 *   get:
 *     tags: [Notes]
 *     summary: Notlarda arama yap
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Arama sorgusu (baslik ve icerikte arar)
 *     responses:
 *       200:
 *         description: Arama sonuclari
 *       400:
 *         description: Query parametresi gerekli
 *       401:
 *         description: Yetkisiz erisim
 */
router.get('/search', authMiddleware, noteOwnerGetAllNotes, searchNotes);

/**
 * @swagger
 * /notes/favorites:
 *   get:
 *     tags: [Notes]
 *     summary: Favori notlari listele
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Favori notlar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *       401:
 *         description: Yetkisiz erisim
 */
router.get('/favorites/', authMiddleware, noteOwnerGetAllNotes, favoriteNotes);

/**
 * @swagger
 * /notes/favorites/{id}:
 *   post:
 *     tags: [Notes]
 *     summary: Notu favorilere ekle
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Not ID
 *     responses:
 *       200:
 *         description: Not favorilere eklendi
 *       401:
 *         description: Yetkisiz erisim
 *       404:
 *         description: Not bulunamadi
 */
router.post(
    '/favorites/:id',
    authMiddleware,
    validationMiddlewareParams(getNoteByIdSchema),
    noteOwnerById,
    addFavoritesNotes
);

/**
 * @swagger
 * /notes/favorites/{id}:
 *   delete:
 *     tags: [Notes]
 *     summary: Notu favorilerden cikar
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Not ID
 *     responses:
 *       200:
 *         description: Not favorilerden cikarildi
 *       401:
 *         description: Yetkisiz erisim
 *       404:
 *         description: Not bulunamadi
 */
router.delete(
    '/favorites/:id',
    authMiddleware,
    validationMiddlewareParams(getNoteByIdSchema),
    noteOwnerById,
    removeFavoritesNotes
);

/**
 * @swagger
 * /notes:
 *   post:
 *     tags: [Notes]
 *     summary: Yeni not olustur
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNoteRequest'
 *     responses:
 *       201:
 *         description: Not olusturuldu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Note'
 *       401:
 *         description: Yetkisiz erisim
 */
router.post(
    '/',
    authMiddleware,
    validationMiddleware(createNoteSchema),
    createNote
);

/**
 * @swagger
 * /notes:
 *   get:
 *     tags: [Notes]
 *     summary: Tum notlari listele
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notlar listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *       401:
 *         description: Yetkisiz erisim
 */
router.get('/', authMiddleware, noteOwnerGetAllNotes, getNotes);

/**
 * @swagger
 * /notes/{id}:
 *   get:
 *     tags: [Notes]
 *     summary: Tek not getir
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Not ID
 *     responses:
 *       200:
 *         description: Not bilgileri
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Note'
 *       401:
 *         description: Yetkisiz erisim
 *       404:
 *         description: Not bulunamadi
 */
router.get(
    '/:id',
    authMiddleware,
    validationMiddlewareParams(getNoteByIdSchema),
    noteOwnerById,
    getNoteById
);

/**
 * @swagger
 * /notes/{id}:
 *   put:
 *     tags: [Notes]
 *     summary: Not guncelle
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Not ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNoteRequest'
 *     responses:
 *       200:
 *         description: Not guncellendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Note'
 *       401:
 *         description: Yetkisiz erisim
 *       404:
 *         description: Not bulunamadi
 */
router.put(
    '/:id',
    authMiddleware,
    validationMiddlewareParams(getNoteByIdSchema),
    validationMiddleware(updateNoteSchema),
    noteOwnerById,
    updateNote
);

/**
 * @swagger
 * /notes/{id}:
 *   delete:
 *     tags: [Notes]
 *     summary: Not sil
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Not ID
 *     responses:
 *       200:
 *         description: Not silindi
 *       401:
 *         description: Yetkisiz erisim
 *       404:
 *         description: Not bulunamadi
 */
router.delete(
    '/:id',
    authMiddleware,
    validationMiddlewareParams(deleteNoteSchema),
    noteOwnerById,
    deleteNote
);

export default router;
