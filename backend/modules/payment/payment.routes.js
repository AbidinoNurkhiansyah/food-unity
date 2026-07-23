import express from 'express';
import { PaymentController } from './payment.controller.js';
import { verifyToken } from '../auth/auth.middleware.js';

const router = express.Router();

// Checkout API
router.post('/api/checkout', verifyToken, PaymentController.checkout);

// Orders API
router.get('/api/orders', verifyToken, PaymentController.getOrders);
router.post('/api/orders/:orderId/cancel', verifyToken, PaymentController.cancelOrder);
router.post('/api/orders/:orderId/confirm-payment', verifyToken, PaymentController.confirmPayment);

// Webhook & Notification APIs
router.post('/api/midtrans-callback', PaymentController.handleWebhook);
router.post('/notification/handling', PaymentController.handleNotification);

// Redirect APIs
router.get('/payment/success', PaymentController.redirectSuccess);
router.get('/payment/pending', PaymentController.redirectPending);
router.get('/payment/error', PaymentController.redirectError);

export default router;
