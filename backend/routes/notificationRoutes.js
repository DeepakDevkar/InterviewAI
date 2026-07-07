import express from 'express';
import { sendNotification } from '../utils/notification.js';
import { protect } from '../middlewares/authMiddleware.js';
import { Notification } from '../models/Notification.js';

const router = express.Router();

router.use(protect);

// 1. Fetch user notifications history
router.get('/', async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort('-createdAt')
      .limit(30);

    res.status(200).json({
      status: 'success',
      data: { notifications }
    });
  } catch (error) {
    next(error);
  }
});

// 2. Mark all user notifications as read
router.patch('/mark-read', async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, status: 'unread' },
      { status: 'read' }
    );

    res.status(200).json({
      status: 'success',
      message: 'All notifications marked as read.'
    });
  } catch (error) {
    next(error);
  }
});

// 3. Test endpoint to trigger a warnings email / socket push (e.g. Subscription Expiry)
router.post('/trigger-expiry', async (req, res, next) => {
  try {
    const notify = await sendNotification({
      userId: req.user._id,
      title: 'Subscription Expiring Soon',
      message: 'Your Pro subscription trial is expiring in 3 days. Renew now to avoid losing video mock feeds.',
      type: 'warning'
    });

    res.status(200).json({
      status: 'success',
      message: 'Subscription expiry notification triggered successfully.',
      data: { notification: notify }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
