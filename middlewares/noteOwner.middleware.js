import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config/env.js';
import Note from '../models/note.model.js';

export const noteOwner = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: 'Note not found' });

        if (note.userId.toString() !== decoded.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        next();
    } catch (error) {
        next(error);
    }
};
