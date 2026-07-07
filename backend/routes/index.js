import express from 'express';
import authRoutes from './authRoutes.js';
import interviewRoutes from './interviewRoutes.js';
import userRoutes from './userRoutes.js';
import resumeRoutes from './resumeRoutes.js';
import challengeRoutes from './challengeRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import adminRoutes from './adminRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import paymentRoutes from './paymentRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/interviews', interviewRoutes);
router.use('/users', userRoutes);
router.use('/resumes', resumeRoutes);
router.use('/challenges', challengeRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/admin', adminRoutes);
router.use('/notifications', notificationRoutes);
router.use('/payments', paymentRoutes);

export default router;
