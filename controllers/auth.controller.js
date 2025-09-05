import User from '../models/user.model.js';

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    res.status(201).json({ message: 'User registered', data: user });
};
