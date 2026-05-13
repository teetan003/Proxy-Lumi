import express from 'express';
import { createPayment, getPaymentStatus, handleWebhook } from '../controllers/paymentController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', auth, createPayment);
router.get('/:id', auth, getPaymentStatus);
router.post('/webhook', handleWebhook); // Public for provider

export default router;
