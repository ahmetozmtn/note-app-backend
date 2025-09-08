import Note from '../models/note.model.js';

// Note Create
export const createNote = async (req, res) => {
    try {
        const { title, content, tags, color } = req.body;
        const note = await Note.create({
            title,
            content,
            tags,
            color,
            userId: req.user.id,
        });
        res.status(201).json({
            message: 'Note created',
            data: note,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Note Get
export const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.id });
        res.status(200).json({
            message: 'Notes fetched',
            data: notes,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};
