import express from 'express';
import { 
  register, 
  verifyEmail, 
  login, 
  refresh, 
  forgotPassword, 
  resetPassword, 
  googleLogin, 
  logout 
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/google', googleLogin);
router.post('/logout', protect, logout);

export default router;
