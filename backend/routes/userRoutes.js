import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/profile')
  .get(getProfile)
  .patch(updateProfile);

export default router;
