import express from 'express';
import cors from 'cors';
import db from './Config/db.js';
import router from './routes/roomroutes.js';

const app = express();
const PORT =  3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", router);

// Database connection
db.connection.once('open', () => {
    console.log('Database connected successfully!');
});

db.connection.on('error', (err) => {
    console.error('Database connection error:', err);
});

// Start the server
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;
