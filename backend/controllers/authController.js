import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { AppError } from '../utils/appError.js';
import { validateFields } from '../utils/validation.js';
import { sendEmail } from '../config/nodemailer.js';

// JWT Helper methods
const signToken = (id, secret, expiry) => {
  return jwt.sign({ id }, secret, { expiresIn: expiry });
};

const sendTokenResponse = async (user, statusCode, res) => {
  const accessToken = signToken(user._id, process.env.JWT_ACCESS_SECRET, process.env.JWT_ACCESS_EXPIRY || '15m');
  const refreshToken = signToken(user._id, process.env.JWT_REFRESH_SECRET, process.env.JWT_REFRESH_EXPIRY || '7d');

  // Update refresh token in DB
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Set HTTP-only cookie for refresh token
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  // Hide password and tokens from response JSON
  user.password = undefined;
  user.refreshToken = undefined;

  res.status(statusCode).json({
    status: 'success',
    accessToken,
    data: { user }
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    validateFields(req.body, ['name', 'email', 'password']);

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already in use', 400));
    }

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const newUser = await User.create({
      name,
      email,
      password,
      verificationToken,
      verificationTokenExpires,
      isVerified: false
    });

    // Send Verification Email
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #4f46e5; text-align: center;">Verify Your Email - InterviewAI</h2>
        <p>Hi ${name},</p>
        <p>Thank you for signing up for InterviewAI. Please click the button below to verify your email address and activate your account:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Email Address</a>
        </div>
        <p>This verification link is valid for 24 hours. If the button above doesn't work, copy and paste the link below into your web browser:</p>
        <p style="word-break: break-all; color: #64748b;">${verificationUrl}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">If you didn't create an account, you can safely ignore this email.</p>
      </div>
    `;

    try {
      await sendEmail({
        to: email,
        subject: 'Verify your email address - InterviewAI',
        html: emailHtml
      });
    } catch (err) {
      // Clean up token if email fails
      newUser.verificationToken = undefined;
      newUser.verificationTokenExpires = undefined;
      await newUser.save({ validateBeforeSave: false });
      return next(new AppError('Failed to send verification email. Please try again.', 500));
    }

    res.status(201).json({
      status: 'success',
      message: 'Account created! Please check your email to verify your account.'
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    validateFields(req.body, ['token']);

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    }).select('+verificationToken +verificationTokenExpires');

    if (!user) {
      return next(new AppError('Verification token is invalid or has expired', 400));
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // Automatically log the user in
    await sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    validateFields(req.body, ['email', 'password']);

    // Find user & include password
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // Check if verified
    if (!user.isVerified) {
      return next(new AppError('Your email address has not been verified yet. Please check your inbox.', 401));
    }

    await sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    // Read from secure cookies first, fallback to request body
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (!token) {
      return next(new AppError('No refresh token provided', 400));
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== token) {
      return next(new AppError('Invalid refresh token', 401));
    }

    // Issue rotated access & refresh tokens
    await sendTokenResponse(user, 200, res);
  } catch (error) {
    next(new AppError('Invalid or expired refresh token', 401));
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    validateFields(req.body, ['email']);

    const user = await User.findOne({ email });
    if (!user) {
      // Don't leak details but return generic success to avoid email enum attacks
      return res.status(200).json({
        status: 'success',
        message: 'If an account exists for that email address, a password reset link has been sent.'
      });
    }

    // Generate password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });

    // Send reset email
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #4f46e5; text-align: center;">Reset Your Password - InterviewAI</h2>
        <p>Hi ${user.name},</p>
        <p>You requested to reset your password. Please click the button below to update your credentials:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>This reset link is valid for 1 hour. If the button above doesn't work, copy and paste the link below into your web browser:</p>
        <p style="word-break: break-all; color: #64748b;">${resetUrl}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">If you didn't request a password reset, you can safely ignore this email.</p>
      </div>
    `;

    try {
      await sendEmail({
        to: email,
        subject: 'Reset your password - InterviewAI',
        html: emailHtml
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new AppError('Failed to send reset email. Please try again.', 500));
    }

    res.status(200).json({
      status: 'success',
      message: 'If an account exists for that email address, a password reset link has been sent.'
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    validateFields(req.body, ['token', 'password']);

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      return next(new AppError('Reset token is invalid or has expired', 400));
    }

    // Set new password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    
    await user.save(); // pre-save hook will hash password automatically

    // Automatically log the user in
    await sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    validateFields(req.body, ['idToken']);

    // Fetch token details from Google Verification endpoint
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    if (!response.ok) {
      return next(new AppError('Invalid Google credential token', 400));
    }

    const payload = await response.json();
    const { sub: googleId, email, name } = payload;

    if (!email) {
      return next(new AppError('Failed to retrieve user email from Google', 400));
    }

    // Find or create User
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // Connect googleId to existing email account if not tied yet
      if (!user.googleId) {
        user.googleId = googleId;
        user.isVerified = true; // Mark verified since Google authenticated
        await user.save({ validateBeforeSave: false });
      }
    } else {
      // Create new social account
      user = await User.create({
        name,
        email,
        googleId,
        isVerified: true
      });
    }

    await sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      const user = await User.findOne({ refreshToken: token });
      if (user) {
        user.refreshToken = undefined;
        await user.save({ validateBeforeSave: false });
      }
    }

    // Clear client-side cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};
