import express from 'express';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler.js';
import ApiError from './utils/ApiError.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'TransitOps API is running' });
});

// Handle undefined routes
app.use((req, res, next) => {
  next(new ApiError(404, `Can't find ${req.originalUrl} on this server!`));
});

// Global error handler
app.use(errorHandler);

export default app;
