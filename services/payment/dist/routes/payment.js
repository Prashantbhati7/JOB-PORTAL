import express from 'express';
import { isAuth } from '../middleware/auth.js';
import { checkOut, paymentVerification } from '../controller/payment.js';
const router = express.Router();
router.route('/').get((req, res) => res.send('payment service is working'));
router.route('/checkout').post(isAuth, checkOut);
router.route('/verify').post(isAuth, paymentVerification);
export default router;
