import express from 'express';
import { createNote, getNotes } from '../controllers/note.controller.js';
import { validationMiddleware } from '../middlewares/validation.middleware.js';
import { createNoteSchema } from '../validation/validation.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post(
    '/',
    authMiddleware,
    validationMiddleware(createNoteSchema),
    createNote
);
router.get('/', authMiddleware, getNotes);

export default router;
