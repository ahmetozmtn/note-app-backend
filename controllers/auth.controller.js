import bcrypt from 'bcrypt';

import User from '../models/user.model.js';

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
        res.status(201).json({
            message: 'User registered',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
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
