import express from 'express';

import { getUser, updateUser } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { userMiddleware } from '../middlewares/user.middleware.js';
import {
    validationMiddleware,
    validationMiddlewareParams,
} from '../middlewares/validation.middleware.js';
import { updateUserSchema, paramsIdSchema } from '../validation/validation.js';

const router = express.Router();

router.get(
    '/:id',
    authMiddleware,
    validationMiddlewareParams(paramsIdSchema),
    userMiddleware,
    getUser
);

router.put(
    '/:id',
    authMiddleware,
    validationMiddlewareParams(paramsIdSchema),
    userMiddleware,
    validationMiddleware(updateUserSchema),
    updateUser
);

export default router;
