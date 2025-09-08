import express from 'express';

import {
    createNote,
    getNotes,
    getNoteById,
} from '../controllers/note.controller.js';
import {
    validationMiddleware,
    validationMiddlewareParams,
} from '../middlewares/validation.middleware.js';
import {
    createNoteSchema,
    getNoteByIdSchema,
} from '../validation/validation.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

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
export default router;
