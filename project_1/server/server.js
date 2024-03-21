import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './apiRoutes.js';

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}));

mongoose.connect('mongodb://127.0.0.1:27017/employee');

app.use('/backend',router);

app.listen(3001, () =>
{
    console.log('Server is running on PORT 3001');
});