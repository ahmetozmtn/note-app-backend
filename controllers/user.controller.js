import User from '../models/user.model.js';

// User Get

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            message: 'User fetched',
            data: user,
        });
    } catch (error) {
        next(error);
    }
};
