import express from 'express';

import { getUser, updateUser } from '../controllers/user.controller.js';
import { userMiddleware } from '../middlewares/user.middleware.js';
import {
    validationMiddleware,
    validationMiddlewareParams,
} from '../middlewares/validation.middleware.js';
import { updateUserSchema, paramsIdSchema } from '../validation/validation.js';
const router = express.Router();

router.get(
    '/:id',
    validationMiddlewareParams(paramsIdSchema),
    userMiddleware,
    getUser
);
router.put(
    '/:id',
    validationMiddlewareParams(paramsIdSchema),
    userMiddleware,
    validationMiddleware(updateUserSchema),
    updateUser
);
export default router;
