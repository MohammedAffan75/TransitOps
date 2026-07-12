import dotenv from 'dotenv';
import app from './app.js';

// Handles uncaught exceptions (e.g. syntax errors, undefined variables outside express)
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`TransitOps Server is running on port ${PORT}`);
});

// Handles unhandled promise rejections (e.g. failed database connections)
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
