import Note from '../models/note.model.js';

export const noteOwnerById = async (req, res, next) => {
    try {
        // req.user is set by authMiddleware
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        if (note.userId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        req.note = note;
        next();
    } catch (error) {
        next(error);
    }
};

export const noteOwnerGetAllNotes = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const notes = await Note.find({ userId: req.user.id });
        if (notes.length === 0) {
            return res.status(404).json({ message: 'No notes found' });
        }

        req.notes = notes;
        next();
    } catch (error) {
        next(error);
    }
};
