import express from 'express';
import { PaymentController } from './payment.controller.js';

const router = express.Router();

// Checkout API
router.post('/api/checkout', PaymentController.checkout);

// Orders API
router.get('/api/orders', PaymentController.getOrders);
router.post('/api/orders/:orderId/cancel', PaymentController.cancelOrder);

// Webhook & Notification APIs
router.post('/api/midtrans-callback', PaymentController.handleWebhook);
router.post('/notification/handling', PaymentController.handleNotification);

// Redirect APIs
router.get('/payment/success', PaymentController.redirectSuccess);
router.get('/payment/pending', PaymentController.redirectPending);
router.get('/payment/error', PaymentController.redirectError);

export default router;
