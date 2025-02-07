import express from 'express';
import cors from 'cors';
import db from './Config/db.js';
import router from './routes/roomroutes.js';

const app = express();

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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Handle Vercel serverless function
export default async (req, res) => {
  await app(req, res);
};

