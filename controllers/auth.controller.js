import bcrypt from 'bcrypt';

import User from '../models/user.model.js';
import RefreshToken from '../models/refreshToken.model.js';
import {
    generateToken,
    generateEmailToken,
    verifyEmailToken,
    generateRefreshToken,
    verifyRefreshToken,
    hashToken,
    getRefreshTokenExpiry,
} from '../utils/token.js';
import {
    sendVerificationEmail,
    sendPasswordResetEmail,
} from '../utils/email.service.js';
import {
    REFRESH_TOKEN_COOKIE_MAX_AGE,
    COOKIE_SECURE,
    COOKIE_SAME_SITE,
} from '../config/env.js';

// Cookie settings
const cookieOptions = {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAME_SITE,
    maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
    path: '/',
};

// Refresh token create and save to DB
const createAndSaveRefreshToken = async userId => {
    const refreshToken = generateRefreshToken({ id: userId });
    const tokenHash = hashToken(refreshToken);
    const expiresAt = getRefreshTokenExpiry();

    await RefreshToken.create({
        userId,
        tokenHash,
        expiresAt,
    });

    return refreshToken;
};

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

        const accessToken = generateToken({ id: user._id });

        const refreshToken = await createAndSaveRefreshToken(user._id);

        const emailToken = generateEmailToken({ id: user._id });
        await sendVerificationEmail(email, emailToken);

        res.cookie('refreshToken', refreshToken, cookieOptions);

        res.status(201).json({
            message: 'User registered',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                accessToken,
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

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ message: 'Invalid email or password' });
        }

        const accessToken = generateToken({ id: user._id });

        const refreshToken = await createAndSaveRefreshToken(user._id);

        res.cookie('refreshToken', refreshToken, cookieOptions);

        return res.status(200).json({
            message: 'Login successful',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                accessToken,
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

export const refreshAccessToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token not found' });
        }

        let decoded;
        try {
            decoded = verifyRefreshToken(refreshToken);
        } catch {
            return res
                .status(401)
                .json({ message: 'Invalid or expired refresh token' });
        }

        const tokenHash = hashToken(refreshToken);
        const storedToken = await RefreshToken.findOne({
            userId: decoded.id,
            tokenHash,
        });

        if (!storedToken) {
            return res.status(401).json({ message: 'Refresh token not found' });
        }

        if (storedToken.isExpired()) {
            await storedToken.deleteOne();
            return res.status(401).json({ message: 'Refresh token expired' });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await storedToken.deleteOne();

        const newAccessToken = generateToken({ id: user._id });
        const newRefreshToken = await createAndSaveRefreshToken(user._id);

        res.cookie('refreshToken', newRefreshToken, cookieOptions);

        return res.status(200).json({
            message: 'Token refreshed successfully',
            data: {
                accessToken: newAccessToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Logout
export const logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            const tokenHash = hashToken(refreshToken);
            await RefreshToken.findOneAndDelete({ tokenHash });
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: COOKIE_SECURE,
            sameSite: COOKIE_SAME_SITE,
            path: '/',
        });

        return res.status(200).json({
            message: 'Logged out successfully',
        });
    } catch (error) {
        next(error);
    }
};

export const logoutAll = async (req, res, next) => {
    try {
        const userId = req.user.id;
        // Revoke all user tokens
        await RefreshToken.revokeAllUserTokens(userId);

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: COOKIE_SECURE,
            sameSite: COOKIE_SAME_SITE,
            path: '/',
        });

        return res.status(200).json({
            message: 'Logged out from all devices successfully',
        });
    } catch (error) {
        next(error);
    }
};
