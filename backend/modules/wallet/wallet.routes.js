import express from 'express';
import { WalletController } from './wallet.controller.js';

const router = express.Router();

// Get balance
router.get('/api/wallet/balance', WalletController.getBalance);

// Request withdrawal
router.post('/api/wallet/withdraw', WalletController.withdraw);

export default router;
