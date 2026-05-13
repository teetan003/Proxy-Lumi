import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import proxyRoutes from './routes/proxyRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { scheduleExpirationCheck } from './jobs/expireJob.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/proxies', proxyRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Start server
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    
    // Schedule jobs
    try {
        await scheduleExpirationCheck();
        console.log('Expiration check job scheduled.');
    } catch (error) {
        console.error('Failed to schedule jobs:', error);
    }
});
