import express from 'express';

import { getUser } from '../controllers/user.controller.js';
import { userMiddleware } from '../middlewares/user.middleware.js';

const router = express.Router();

router.get('/:id', userMiddleware, getUser);

export default router;
