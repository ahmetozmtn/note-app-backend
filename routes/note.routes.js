import express from 'express';

import {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote,
    queryNotes,
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

const router = express.Router();

router.get('/query', authMiddleware, queryNotes);

router.post(
    '/',
    authMiddleware,
    validationMiddleware(createNoteSchema),
    createNote
);
router.get('/', authMiddleware, getNotes);
router.get(
    '/:id',
    authMiddleware,
    validationMiddlewareParams(getNoteByIdSchema),
    getNoteById
);
router.put(
    '/:id',
    authMiddleware,
    validationMiddleware(updateNoteSchema),
    updateNote
);
router.delete(
    '/:id',
    authMiddleware,
    validationMiddlewareParams(deleteNoteSchema),
    deleteNote
);

export default router;
