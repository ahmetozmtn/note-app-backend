import bcrypt from 'bcrypt';

import User from '../models/user.model.js';
import { generateToken } from '../utils/token.js';

export const register = async (req, res) => {
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
        delete user.password;
        const token = generateToken({ id: user._id });
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
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const token = generateToken({ id: user._id });
        if (!user) {
            return res
                .status(401)
                .json({ message: 'Invalid email or password' });
        }
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
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};
