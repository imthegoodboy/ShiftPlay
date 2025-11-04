import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import sideshiftRouter from './routes/sideshift';
import usersRouter from './routes/users';
import rewardsRouter from './routes/rewards';
import aiRouter from './routes/ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(helmet());
app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'shiftplay-server' });
});

app.use('/api/sideshift', sideshiftRouter);
app.use('/api/users', usersRouter);
app.use('/api/rewards', rewardsRouter);
app.use('/api/ai', aiRouter);

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/shiftplay';

mongoose
  .connect(mongoUri)
  .then(() => {
    app.listen(port, () => {
      console.log(`ShiftPlay server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });


