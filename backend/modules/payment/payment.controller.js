import { PaymentService } from './payment.service.js';
import dotenv from 'dotenv';
dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export class PaymentController {
  
  /**
   * Handle Checkout from React
   */
  static async checkout(req, res) {
    try {
      const { items, total, customerDetails } = req.body;
      const result = await PaymentService.createCheckoutSession(items, total, customerDetails);
      res.json(result);
    } catch (error) {
      console.error("Checkout Error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Handle Midtrans Payment Notification Webhook
   */
  static async handleWebhook(req, res) {
    try {
      const notification = req.body;
      await PaymentService.processWebhookNotification(notification);
      res.status(200).json({ status: 'ok' });
    } catch (error) {
      console.error("Webhook Error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Fetch Orders by Email
   */
  static async getOrders(req, res) {
    try {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({ error: "Email query parameter is required" });
      }
      const orders = await PaymentService.getOrdersByEmail(email);
      res.json(orders);
    } catch (error) {
      console.error("Fetch Orders Error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Cancel Order
   */
  static async cancelOrder(req, res) {
    try {
      const { orderId } = req.params;
      if (!orderId) {
        return res.status(400).json({ error: "Order ID is required" });
      }
      await PaymentService.cancelOrder(orderId);
      res.json({ status: 'ok', message: 'Order cancelled successfully' });
    } catch (error) {
      console.error("Cancel Order Error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Handle Recurring / Pay Account Notifications
   */
  static handleNotification(req, res) {
    console.log("Received Recurring/Pay Account Notification:", req.body);
    res.status(200).json({ status: 'ok' });
  }

  /**
   * Redirect to Frontend on Success
   */
  static redirectSuccess(req, res) {
    res.redirect(`${FRONTEND_URL}/?payment=success`);
  }

  /**
   * Redirect to Frontend on Pending
   */
  static redirectPending(req, res) {
    res.redirect(`${FRONTEND_URL}/?payment=pending`);
  }

  /**
   * Redirect to Frontend on Error
   */
  static redirectError(req, res) {
    res.redirect(`${FRONTEND_URL}/?payment=error`);
  }
}
