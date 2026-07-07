import { User } from '../models/User.js';
import { AppError } from '../utils/appError.js';

export const getProfile = async (req, res, next) => {
  try {
    // req.user is populated by the protect middleware
    res.status(200).json({
      status: 'success',
      data: { user: req.user }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    
    // Prevent updating password in profile route
    if (req.body.password) {
      return next(new AppError('This route is not for password updates. Please use updatePassword.', 400));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: { user: updatedUser }
    });
  } catch (error) {
    next(error);
  }
};
