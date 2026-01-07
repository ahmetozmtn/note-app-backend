import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

// User Get
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: 'User not found' });
        }
        res.status(200).json({
            success: true,
            message: 'User fetched',
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// User Update
export const updateUser = async (req, res, next) => {
    try {
        const { email } = req.body;
        const { id } = req.params;
        const userEmailCheck = await User.findOne({ email: email });
        if (userEmailCheck && userEmailCheck._id.toString() !== id) {
            return res
                .status(409)
                .json({ success: false, message: 'Email already exists' });
        }

        const user = await User.findByIdAndUpdate(id, req.body, {
            new: true,
        }).select('-password');

        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: 'User updated',
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// User Password Change

export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            user.password
        );
        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ success: false, message: 'Old password is incorrect' });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'New password and confirm password do not match',
            });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(
            id,
            { password: hashedPassword },
            { new: true }
        );
        return res
            .status(200)
            .json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        next(error);
    }
};
