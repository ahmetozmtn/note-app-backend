import app from './app.js';
import { PORT } from './config/env.js';

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received');
    server.close(() => {
        console.log('Server is shutting down');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received');
    server.close(() => {
        console.log('Server is shutting down');
        process.exit(0);
    });
});
