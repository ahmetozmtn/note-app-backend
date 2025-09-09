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

// Note Update

export const updateNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        const { title, content, tags, color } = req.body;
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            {
                title,
                content,
                tags,
                color,
            },
            { new: true }
        );
        res.status(200).json({
            message: 'Note updated',
            data: updatedNote,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Note Delete

export const deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        await Note.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Note deleted' });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Note Query

export const queryNotes = async (req, res) => {
    try {
        const { tag } = req.query;
        if (!tag) {
            return res.status(400).json({ message: 'Tags are required' });
        }
        const notes = await Note.find({ tags: { $in: tag } });
        if (notes.length === 0) {
            return res.status(404).json({ message: 'No notes found' });
        }
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
