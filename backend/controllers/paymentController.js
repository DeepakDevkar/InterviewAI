import { Subscription } from '../models/Subscription.js';
import { Payment } from '../models/Payment.js';
import { Resume } from '../models/Resume.js';
import { Interview } from '../models/Interview.js';
import { sendNotification } from '../utils/notification.js';
import { AppError } from '../utils/appError.js';
import { logger } from '../utils/logger.js';

export const getSubscriptionDetails = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Fetch active subscription
    let subscription = await Subscription.findOne({ user: userId, status: 'active' });
    if (!subscription) {
      // Setup a default free subscription model if not found
      subscription = {
        plan: 'free',
        status: 'active',
        startDate: req.user.createdAt,
        endDate: null
      };
    }

    // 2. Compute current usages
    const resumesCount = await Resume.countDocuments({ user: userId });
    const interviewsCount = await Interview.countDocuments({ user: userId });

    // 3. Fetch past invoices billing transactions
    const invoices = await Payment.find({ user: userId }).sort('-createdAt');

    res.status(200).json({
      status: 'success',
      data: {
        subscription: {
          plan: subscription.plan,
          status: subscription.status,
          startDate: subscription.startDate,
          endDate: subscription.endDate
        },
        usage: {
          resumes: {
            current: resumesCount,
            limit: subscription.plan === 'free' ? 1 : Infinity
          },
          interviews: {
            current: interviewsCount,
            limit: subscription.plan === 'free' ? 2 : Infinity
          }
        },
        invoices
      }
    });
  } catch (error) {
    next(error);
  }
};

export const processCheckout = async (req, res, next) => {
  try {
    const { planType } = req.body;
    const userId = req.user._id;

    if (!planType || !['pro', 'enterprise'].includes(planType)) {
      return next(new AppError('Please provide a valid target subscription plan (pro or enterprise)', 400));
    }

    const amount = planType === 'pro' ? 29 : 99;
    const transactionId = `ch_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // 1. Create invoice in Payment collection
    const payment = await Payment.create({
      user: userId,
      amount,
      status: 'succeeded',
      transactionId,
      paymentMethod: 'card'
    });

    // 2. Set Start/End limits timeline
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(startDate.getMonth() + 1);

    // 3. Upsert active Subscription status in DB
    const subscription = await Subscription.findOneAndUpdate(
      { user: userId },
      {
        plan: planType,
        status: 'active',
        startDate,
        endDate
      },
      { upsert: true, new: true }
    );

    // 4. Dispatch Email, In-App and Websocket notification pushes
    await sendNotification({
      userId,
      title: 'Subscription Upgraded Successfully',
      message: `Thank you! Your account has been upgraded to the ${planType.toUpperCase()} Tier. You now have unlimited mock simulations and resume parser access!`,
      type: 'success'
    });

    res.status(200).json({
      status: 'success',
      message: `Successfully upgraded to the ${planType} subscription plan.`,
      data: {
        subscription,
        payment
      }
    });
  } catch (error) {
    logger.error('Failed to process checkout transaction:', error);
    next(error);
  }
};
