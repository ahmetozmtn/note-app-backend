import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config/env.js';
import Note from '../models/note.model.js';

export const noteOwnerById = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: 'Note not found' });

        if (note.userId.toString() !== decoded.id.toString()) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        next();
    } catch (error) {
        next(error);
    }
};

export const noteOwnerGetAllNotes = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        const notes = await Note.find({ userId: decoded.id });
        if (notes.length === 0) {
            return res.status(404).json({ message: 'No notes found' });
        }
        next();
    } catch (error) {
        next(error);
    }
};
