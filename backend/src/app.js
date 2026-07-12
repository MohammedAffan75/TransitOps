import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

import errorHandler from './middlewares/errorHandler.js';
import ApiError from './utils/ApiError.js';
import apiRoutes from './routes/index.js';

const app = express();

// 1. Set Security HTTP headers
app.use(helmet());

// 2. Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 3. Limit requests from same API (prevent brute-force/DDoS)
const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per 15 mins
  windowMs: 15 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in 15 minutes!'
});
app.use('/api', limiter); // apply to all API routes

// 4. Body parser & CORS
app.use(cors());
app.use(express.json({ limit: '10kb' })); // limit body payload size

// 5. API Routes
app.use('/api', apiRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'TransitOps API is running securely' });
});

// Handle undefined routes
app.use((req, res, next) => {
  next(new ApiError(404, `Can't find ${req.originalUrl} on this server!`));
});

// Global error handler
app.use(errorHandler);

export default app;
