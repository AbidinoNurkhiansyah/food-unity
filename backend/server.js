import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import paymentRoutes from './modules/payment/payment.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Load Routes
app.use('/', paymentRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend Server running on port ${PORT} (Modular Architecture)`);
});
