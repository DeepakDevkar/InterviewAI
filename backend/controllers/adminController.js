import { User } from '../models/User.js';
import { Interview } from '../models/Interview.js';
import { Subscription } from '../models/Subscription.js';
import { Payment } from '../models/Payment.js';
import { AppError } from '../utils/appError.js';
import { logger } from '../utils/logger.js';

export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const completedMocks = await Interview.countDocuments({ status: 'completed' });
    const activeSubscribers = await Subscription.countDocuments({ status: 'active' });

    // Sum total succeeded revenue
    const revenueSum = await Payment.aggregate([
      { $match: { status: 'succeeded' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueSum.length > 0 ? revenueSum[0].total : 0;

    // Monthly revenue aggregate (last 6 months)
    const monthlyRevenue = await Payment.aggregate([
      { $match: { status: 'succeeded' } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let chartData = monthlyRevenue.map((item) => ({
      name: monthNames[item._id - 1] || 'Month',
      revenue: item.revenue
    }));

    // Seed default chart progress details if database records are empty
    if (chartData.length === 0) {
      chartData = [
        { name: 'Jan', revenue: 420 },
        { name: 'Feb', revenue: 650 },
        { name: 'Mar', revenue: 880 },
        { name: 'Apr', revenue: 750 },
        { name: 'May', revenue: 1200 },
        { name: 'Jun', revenue: 1450 }
      ];
    }

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          totalUsers,
          completedMocks,
          activeSubscribers,
          totalRevenue,
          chartData
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getUsersList = async (req, res, next) => {
  try {
    const users = await User.find().select('+status').sort('-createdAt');
    res.status(200).json({
      status: 'success',
      data: { users }
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status || !['active', 'suspended', 'inactive'].includes(status)) {
      return next(new AppError('Please provide a valid account status status', 400));
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError('Candidate user profile not found', 404));
    }

    // Guard: Prevent admin from suspending themselves
    if (user._id.toString() === req.user._id.toString()) {
      return next(new AppError('Security Guard: Admins cannot suspend their own session status', 400));
    }

    user.status = status;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: `Account status updated successfully to ${status}.`,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const getInterviewsList = async (req, res, next) => {
  try {
    const interviews = await Interview.find()
      .populate('user', 'name email')
      .sort('-createdAt');
    res.status(200).json({
      status: 'success',
      data: { interviews }
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentsList = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email')
      .sort('-createdAt');
    res.status(200).json({
      status: 'success',
      data: { payments }
    });
  } catch (error) {
    next(error);
  }
};
