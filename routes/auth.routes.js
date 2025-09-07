import express from 'express';
import { registerSchema, loginSchema } from '../validation/validation.js';
import { validationMiddleware } from '../middlewares/validation.middleware.js';
import { register, login } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', validationMiddleware(registerSchema), register);
router.post('/login', validationMiddleware(loginSchema), login);

export default router;
