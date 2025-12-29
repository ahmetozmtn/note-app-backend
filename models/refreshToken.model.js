import mongoose from 'mongoose';

const RefreshTokenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        tokenHash: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Token süresinin dolup dolmadığını kontrol eden method
RefreshTokenSchema.methods.isExpired = function () {
    return Date.now() >= this.expiresAt;
};

// Kullanıcının tüm refresh token'larını silen static method
RefreshTokenSchema.statics.revokeAllUserTokens = async function (userId) {
    return this.deleteMany({ userId });
};

// Süresi dolmuş token'ları temizleyen static method
RefreshTokenSchema.statics.cleanExpiredTokens = async function () {
    return this.deleteMany({ expiresAt: { $lt: new Date() } });
};

// Index: userId ve expiresAt için
RefreshTokenSchema.index({ userId: 1 });
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema);

export default RefreshToken;
