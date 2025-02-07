import express from 'express';
import cors from 'cors';
import db from './Config/db.js';
import router from './routes/roomroutes.js';

db.connection.once('open', () => {
    console.log('Database connected successfully!');
});

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", router);


