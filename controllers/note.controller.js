import Note from '../models/note.model.js';

// Note Create
export const createNote = async (req, res, next) => {
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
        next(error);
    }
};

// Note Get
export const getNotes = async (req, res, next) => {
    try {
        const notes = await Note.find({ userId: req.user.id });
        res.status(200).json({
            message: 'Notes fetched',
            data: notes,
        });
    } catch (error) {
        next(error);
    }
};

// Note Get By Id

export const getNoteById = async (req, res, next) => {
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
        next(error);
    }
};

// Note Update

export const updateNote = async (req, res, next) => {
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
        next(error);
    }
};

// Note Delete

export const deleteNote = async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        await Note.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Note deleted' });
    } catch (error) {
        next(error);
    }
};

// Note Query

export const queryNotes = async (req, res, next) => {
    try {
        const { tag } = req.query;
        if (!tag) {
            return res.status(400).json({ message: 'Tags are required' });
        }
        const notes = await Note.find({ tags: { $in: tag } });
        if (notes.length === 0) {
            return res.status(200).json({
                message: 'No notes found',
                data: [],
            });
        }
        res.status(200).json({
            message: 'Notes fetched',
            data: notes,
        });
    } catch (error) {
        next(error);
    }
};

// Search Notes

export const searchNotes = async (req, res, next) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: 'Query is required' });
        }
        const notes = await Note.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },
            ],
            userId: req.user.id,
        });
        if (notes.length === 0) {
            return res.status(200).json({
                message: 'No notes found',
                data: [],
            });
        }
        res.status(200).json({
            message: 'Notes fetched',
            data: notes,
        });
    } catch (error) {
        next(error);
    }
};

// Note Favorite

export const favoriteNotes = async (req, res, next) => {
    try {
        const notes = await Note.find({
            userId: req.user.id,
            isFavorites: true,
        });
        if (notes.length === 0) {
            return res.status(200).json({
                message: 'No favorite notes found',
                data: [],
            });
        }
        return res.status(200).json({
            message: 'Favorite notes fetched',
            data: notes,
        });
    } catch (error) {
        next(error);
    }
};

export const addFavoritesNotes = async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.id);
        console.log(note);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        await note.updateOne({ isFavorites: true });
        return res.status(200).json({ message: 'Note added to favorites' });
    } catch (error) {
        next(error);
    }
};

export const removeFavoritesNotes = async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        await note.updateOne({ isFavorites: false });
        return res.status(200).json({ message: 'Note removed from favorites' });
    } catch (error) {
        next(error);
    }
};
