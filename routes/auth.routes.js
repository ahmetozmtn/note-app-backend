import express from 'express';
import { registerSchema, loginSchema } from '../validation/validation.js';
import { validationMiddleware } from '../middlewares/validation.middleware.js';
import {
    register,
    login,
    verifyEmail,
    passwordResetEmailSend,
    passwordResetConfirmation,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', validationMiddleware(registerSchema), register);
router.post('/login', validationMiddleware(loginSchema), login);
router.post('/reset-password-email', passwordResetEmailSend);
router.post('/reset-password-confirmation', passwordResetConfirmation);
router.get('/verify', verifyEmail);
export default router;
