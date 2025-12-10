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

router.get('/query', authMiddleware, noteOwnerGetAllNotes, queryNotes);
router.get('/search', authMiddleware, noteOwnerGetAllNotes, searchNotes);

router.get('/favorites/', authMiddleware, noteOwnerGetAllNotes, favoriteNotes);
router.post(
    '/favorites/:id',
    authMiddleware,
    validationMiddlewareParams(getNoteByIdSchema),
    noteOwnerById,
    addFavoritesNotes
);

router.delete(
    '/favorites/:id',
    authMiddleware,
    validationMiddlewareParams(getNoteByIdSchema),
    noteOwnerById,
    removeFavoritesNotes
);

router.post(
    '/',
    authMiddleware,
    validationMiddleware(createNoteSchema),
    createNote
);
router.get('/', authMiddleware, noteOwnerGetAllNotes, getNotes);
router.get(
    '/:id',
    authMiddleware,
    validationMiddlewareParams(getNoteByIdSchema),
    noteOwnerById,
    getNoteById
);
router.put(
    '/:id',
    authMiddleware,
    validationMiddlewareParams(getNoteByIdSchema),
    validationMiddleware(updateNoteSchema),
    noteOwnerById,
    updateNote
);
router.delete(
    '/:id',
    authMiddleware,
    validationMiddlewareParams(deleteNoteSchema),
    noteOwnerById,
    deleteNote
);

export default router;
