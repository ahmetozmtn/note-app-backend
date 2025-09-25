import app from './app.js';
import { PORT } from './config/env.js';
import { disconnectDB } from './config/db.js';

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received');
    server.close(async () => {
        console.log('Server is shutting down');
        await disconnectDB();
        process.exit(0);
    });
});

process.on('SIGINT', async () => {
    console.log('SIGINT signal received');
    server.close(async () => {
        await disconnectDB();
        console.log('Server is shutting down');
        process.exit(0);
    });
});
