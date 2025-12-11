import bcrypt from 'bcrypt';

import User from '../models/user.model.js';
import {
    generateToken,
    generateEmailToken,
    verifyEmailToken,
} from '../utils/token.js';
import {
    sendVerificationEmail,
    sendPasswordResetEmail,
} from '../utils/email.service.js';

export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const userMailCheck = await User.findOne({ email });
        if (userMailCheck) {
            return res.status(409).json({ message: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        const token = generateToken({ id: user._id });
        const emailToken = generateEmailToken({ id: user._id });
        await sendVerificationEmail(email, emailToken);
        res.status(201).json({
            message: 'User registered',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                token: token,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(401)
                .json({ message: 'Invalid email or password' });
        }
        const token = generateToken({ id: user._id });
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ message: 'Invalid email or password' });
        }
        return res.status(200).json({
            message: 'Login successful',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                token: token,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.query;
        const decoded = verifyEmailToken(token);
        const user = await User.findByIdAndUpdate(
            decoded.id,
            { isVerified: true },
            { new: true }
        ).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            message: 'Email verified',
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const passwordResetEmailSend = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const emailToken = generateEmailToken({ id: user._id });
        await sendPasswordResetEmail(email, emailToken);
        return res.status(200).json({
            message: 'Password reset email sent',
        });
    } catch (error) {
        next(error);
    }
};

export const passwordResetConfirmation = async (req, res, next) => {
    try {
        const { token } = req.query;
        const { password } = req.body;
        const decoded = verifyEmailToken(token);
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.findByIdAndUpdate(
            decoded.id,
            { password: hashedPassword },
            { new: true }
        ).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({
            message: 'Password reset successful',
        });
    } catch (error) {
        next(error);
    }
};
