import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import creatorsRouter from './routes/creators.js';
import videosRouter from './routes/videos.js';
import categoriesRouter from './routes/categories.js';
import uploadRouter from './routes/upload.js';

const id = uuidv4();
const app = express();

// mongoose.set('debug', true);  

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/creators', creatorsRouter);
app.use('/api/videos', videosRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/upload', uploadRouter);
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;

// Correct mongoose.connect usage (no deprecated options, returns a promise)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
