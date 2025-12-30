import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        tags: { type: [String], default: [] },
        color: { type: String, default: '#000000' },
        isFavorites: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Note = mongoose.model('Note', NoteSchema);
export default Note;
