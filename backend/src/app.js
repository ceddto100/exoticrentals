import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import configurePassport from './config/passport.js';
import authRoutes from './routes/authRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import rentalHistoryRoutes from './routes/rentalHistoryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

// Initialize and configure passport
configurePassport(passport);

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000,http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(passport.initialize());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/rental-history', rentalHistoryRoutes);
app.use('/api/admin', adminRoutes);

// Legacy paths kept for backward compatibility
app.use('/auth', authRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/schedules', scheduleRoutes);
app.use('/customers', customerRoutes);
app.use('/rental-history', rentalHistoryRoutes);
app.use('/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
