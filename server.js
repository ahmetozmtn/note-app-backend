import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

// Variables
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
