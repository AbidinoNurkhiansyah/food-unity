import express from 'express';
import { WalletController } from './wallet.controller.js';
import { verifyToken } from '../auth/auth.middleware.js';

const router = express.Router();

// Get balance
router.get('/api/wallet/balance', verifyToken, WalletController.getBalance);

// Get history
router.get('/api/wallet/history', verifyToken, WalletController.getHistory);

// Request withdrawal
router.post('/api/wallet/withdraw', verifyToken, WalletController.withdraw);

export default router;
