import User from '../models/user.model.js';

export const userMiddleware = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.id.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        req.targetUser = user;
        next();
    } catch (error) {
        next(error);
    }
};
