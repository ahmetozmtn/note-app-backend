import express from 'express';

import {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote,
    queryNotes,
    searchNotes,
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
import { noteOwner } from '../middlewares/noteOwner.middleware.js';

const router = express.Router();

router.get('/query', authMiddleware, queryNotes);
router.get('/search', authMiddleware, searchNotes);

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
    noteOwner,
    getNoteById
);
router.put(
    '/:id',
    authMiddleware,
    validationMiddleware(updateNoteSchema),
    noteOwner,
    updateNote
);
router.delete(
    '/:id',
    authMiddleware,
    validationMiddlewareParams(deleteNoteSchema),
    noteOwner,
    deleteNote
);

export default router;
