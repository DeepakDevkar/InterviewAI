import { Subscription } from '../models/Subscription.js';
import { Resume } from '../models/Resume.js';
import { Interview } from '../models/Interview.js';
import { AppError } from '../utils/appError.js';

// Enforce limit of 1 Resume Review for Free tier
export const checkResumeLimit = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const subscription = await Subscription.findOne({ user: userId, status: 'active' });

    // If no active subscription, default to free tier limits
    if (!subscription || subscription.plan === 'free') {
      const resumeCount = await Resume.countDocuments({ user: userId });
      if (resumeCount >= 1) {
        return next(
          new AppError(
            'Quota Limit Reached: The Free tier is limited to 1 Resume Review. Upgrade to Pro for unlimited resume parsing optimizations!',
            403
          )
        );
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

// Enforce limit of 2 Mock Interviews for Free tier
export const checkInterviewLimit = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const subscription = await Subscription.findOne({ user: userId, status: 'active' });

    if (!subscription || subscription.plan === 'free') {
      const interviewCount = await Interview.countDocuments({ user: userId });
      if (interviewCount >= 2) {
        return next(
          new AppError(
            'Quota Limit Reached: The Free tier is limited to 2 Mock Interviews. Upgrade to Pro for unlimited mock interview sessions!',
            403
          )
        );
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
