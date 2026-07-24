import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import paymentRoutes from './modules/payment/payment.routes.js';
import walletRoutes from './modules/wallet/wallet.routes.js';

dotenv.config();

const app = express();

// 1. HTTP Security Headers
app.use(helmet());

// 2. CORS Configuration
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',') 
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// 3. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true, 
  legacyHeaders: false, 
});
app.use(limiter);

app.use(express.json());

// Load Routes
app.use('/', paymentRoutes);
app.use('/', walletRoutes);

// Proxy endpoints for Indonesia administrative regions (wilayah.id) to bypass browser CORS
app.get('/api/location/provinces', async (req, res) => {
  try {
    const response = await fetch('https://wilayah.id/api/provinces.json');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/location/regencies/:provinceId', async (req, res) => {
  try {
    const response = await fetch(`https://wilayah.id/api/regencies/${req.params.provinceId}.json`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/location/districts/:regencyId', async (req, res) => {
  try {
    const response = await fetch(`https://wilayah.id/api/districts/${req.params.regencyId}.json`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/location/villages/:districtId', async (req, res) => {
  try {
    const response = await fetch(`https://wilayah.id/api/villages/${req.params.districtId}.json`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend Server running on port ${PORT} (Modular Architecture)`);
});
