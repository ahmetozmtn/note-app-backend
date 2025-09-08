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

// Note Get By Id

export const getNoteById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json({
            message: 'Note fetched',
            data: note,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};
