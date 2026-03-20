import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import authRouter from './routes/auth.js';
import youtubeRouter from './routes/youtube.js';
import planRouter from './routes/plan.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});

const planLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { error: 'Plan generation limit reached. Try again in an hour.' },
});

app.use(generalLimiter);
app.use('/api/plan', planLimiter);

app.use('/api/auth', authRouter);
app.use('/api/youtube', youtubeRouter);
app.use('/api/plan', planRouter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`🚀 WKND server running on http://localhost:${PORT}`);
});