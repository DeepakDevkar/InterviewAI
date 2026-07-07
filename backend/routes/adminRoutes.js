import express from 'express';
import { 
  getAdminStats, 
  getUsersList, 
  updateUserStatus, 
  getInterviewsList, 
  getPaymentsList 
} from '../controllers/adminController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect, restrictTo('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getUsersList);
router.patch('/users/:id/status', updateUserStatus);
router.get('/interviews', getInterviewsList);
router.get('/payments', getPaymentsList);

export default router;
