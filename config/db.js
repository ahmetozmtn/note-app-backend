import mongoose from 'mongoose';
import { MONGO_URI } from './env.js';

if (!MONGO_URI) {
    throw new Error('MONGO_URI is not defined');
}

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected...');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export const disconnectDB = async () => {
    await mongoose.disconnect();
    console.log('MongoDB disconnected...');
};
