import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config/env.js';
import User from '../models/user.model.js';

export const userMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        if (user.id.toString() !== decoded.id.toString()) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};
