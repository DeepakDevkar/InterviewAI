import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { sendEmail } from '../config/nodemailer.js';
import { sendSocketNotification } from '../config/socket.js';
import { logger } from './logger.js';

export const sendNotification = async ({ userId, title, message, type = 'info' }) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      logger.warn(`Notification recipient user not found for ID: ${userId}`);
      return null;
    }

    // 1. Create Notification record in MongoDB (In-App notifications history)
    const newNotification = await Notification.create({
      recipient: userId,
      title,
      message,
      type,
      status: 'unread'
    });

    // 2. Trigger real-time Socket.io notification push
    sendSocketNotification(userId, newNotification);

    // 3. Trigger email notification via SMTP Nodemailer
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
        <div style="padding-bottom: 20px; border-bottom: 1px solid #e2e8f0; text-align: center;">
          <h2 style="color: #4f46e5; margin: 0;">InterviewAI Alert</h2>
        </div>
        <div style="padding: 20px 0;">
          <h3 style="color: #0f172a; margin-top: 0;">${title}</h3>
          <p style="line-height: 1.6; font-size: 14px;">${message}</p>
        </div>
        <div style="padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; text-align: center;">
          <p>You received this automated notification because you are a registered user of InterviewAI.</p>
          <p>&copy; 2026 InterviewAI Inc. All rights reserved.</p>
        </div>
      </div>
    `;

    // Fire email asynchronously, catch failure silently to prevent controller lockups
    sendEmail({
      to: user.email,
      subject: `[InterviewAI] ${title}`,
      html: emailHtml
    }).catch((err) => {
      logger.error(`Nodemailer email dispatch failed for user ${user.email}:`, err);
    });

    return newNotification;
  } catch (error) {
    logger.error('Failed to create and dispatch notification:', error);
    return null;
  }
};
