import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { API_PREFIX } from './config/constants.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

export const app: Express = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get(`${API_PREFIX}/health`, (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
    },
  });
});

// Centralized error handling
app.use(errorMiddleware);
