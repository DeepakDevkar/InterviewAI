import express from 'express';
import { getSubscriptionDetails, processCheckout } from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/subscription-details', getSubscriptionDetails);
router.post('/checkout', processCheckout);

export default router;
