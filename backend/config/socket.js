import { Server } from 'socket.io';
import { logger } from '../utils/logger.js';
import { Chat } from '../models/Chat.js';

let io = null;
const userSockets = new Map();

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket client connected: ${socket.id}`);

    // Join room
    socket.on('join', (userId) => {
      userSockets.set(userId, socket.id);
      logger.info(`User ID ${userId} registered socket channel: ${socket.id}`);
      
      // Broadcast updated online count to all clients
      io.emit('onlineCount', userSockets.size);
    });

    // Handle incoming chat support message
    socket.on('chatMessage', async ({ senderId, content }) => {
      try {
        logger.info(`Received support chat from user ${senderId}`);

        // 1. Save user message inside MongoDB Chat model
        let chat = await Chat.findOne({ user: senderId, status: 'active' });
        if (!chat) {
          chat = await Chat.create({ user: senderId, messages: [], status: 'active' });
        }
        chat.messages.push({ sender: 'user', content, timestamp: new Date() });
        await chat.save();

        // 2. Trigger real-time Typing Indicator from AI Support
        setTimeout(() => {
          socket.emit('typing', { sender: 'ai', isTyping: true });
        }, 800);

        // 3. Trigger mock AI response message via socket after 2s
        setTimeout(async () => {
          socket.emit('typing', { sender: 'ai', isTyping: false });
          
          const replyText = `Hello! I am your InterviewAI support assistant. How can I help you today? You can practice coding challenges, analyze your resume, or schedule a mock session.`;
          
          // Save AI message inside DB
          chat.messages.push({ sender: 'ai', content: replyText, timestamp: new Date() });
          await chat.save();

          // Push message to client
          socket.emit('chatMessage', { sender: 'ai', content: replyText });
        }, 2200);

      } catch (error) {
        logger.error('Failed to process incoming chatMessage socket event:', error);
      }
    });

    // Handle typing indicator from client
    socket.on('typing', ({ senderId, isTyping }) => {
      // Forward typing indicator (e.g. if peer chat existed, but for support log it)
      logger.debug(`User ${senderId} typing status: ${isTyping}`);
    });

    socket.on('disconnect', () => {
      for (const [uid, sid] of userSockets.entries()) {
        if (sid === socket.id) {
          userSockets.delete(uid);
          logger.info(`Cleaned socket map for user ${uid}`);
          break;
        }
      }
      
      // Broadcast updated online count to all clients
      io.emit('onlineCount', userSockets.size);
      
      logger.info(`Socket client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

export const sendSocketNotification = (userId, notification) => {
  try {
    const socketId = userSockets.get(userId.toString());
    if (socketId && io) {
      io.to(socketId).emit('notification', notification);
      logger.info(`Real-time socket alert pushed to User ${userId}`);
      return true;
    }
    return false;
  } catch (error) {
    logger.error('Failed to send socket notification:', error);
    return false;
  }
};

export const sendInterviewStatusUpdate = (userId, interviewId, status) => {
  try {
    const socketId = userSockets.get(userId.toString());
    if (socketId && io) {
      io.to(socketId).emit('interviewStatus', { interviewId, status });
      logger.info(`Real-time status update (${status}) pushed for interview ${interviewId}`);
      return true;
    }
    return false;
  } catch (error) {
    logger.error('Failed to send interview status update via socket:', error);
    return false;
  }
};
