import express from 'express';
import { registerSchema } from '../validation/validation.js';
import { validationMiddleware } from '../middlewares/validation.middleware.js';
import { register } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', validationMiddleware(registerSchema), register);

export default router;
