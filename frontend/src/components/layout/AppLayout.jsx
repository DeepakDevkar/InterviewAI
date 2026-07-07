import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import { 
  Bell, 
  Search, 
  User as UserIcon, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Sparkles, 
  Loader2,
  MessageSquare,
  X,
  Send,
  Users
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import api from '../../services/api.js';
import { motion, AnimatePresence } from 'framer-motion';

export const AppLayout = () => {
  const user = useSelector((state) => state.auth.user);
  
  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [triggeringTest, setTriggeringTest] = useState(false);

  // Socket instance reference
  const socketRef = useRef(null);

  // Socket.io Real-Time parameters
  const [onlineCount, setOnlineCount] = useState(1);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', content: 'Hi there! I am your AI Support Assistant. How can I help you navigate the playground today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Load history & setup WebSockets connection
  useEffect(() => {
    if (!user) return;

    // 1. Fetch initial in-app notifications
    const loadNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        const list = res.data.data.notifications || [];
        setNotifications(list);
        setUnreadCount(list.filter((n) => n.status === 'unread').length);
      } catch (err) {
        console.warn('Failed to load notifications list:', err);
      }
    };
    loadNotifications();

    // 2. Establish live WebSocket connection
    const socketUrl = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:5000';
    const socket = io(socketUrl);
    socketRef.current = socket;

    // Register active user channel
    socket.emit('join', user._id);

    // Bind real-time trigger listeners
    socket.on('notification', (newNotify) => {
      setNotifications((prev) => [newNotify, ...prev]);
      setUnreadCount((c) => c + 1);
    });

    socket.on('onlineCount', (count) => {
      setOnlineCount(count);
    });

    socket.on('chatMessage', (msg) => {
      setChatMessages((prev) => [...prev, { sender: msg.sender, content: msg.content }]);
    });

    socket.on('typing', ({ senderId, isTyping }) => {
      if (senderId === 'ai') {
        setIsAiTyping(isTyping);
      }
    });

    socket.on('interviewStatus', ({ interviewId, status }) => {
      // Broadcast real-time session updates into in-app notifications log dropdown
      const newAlert = {
        _id: `status-${Date.now()}`,
        title: 'Interview Completed Successfully',
        message: `Your mock interview session status has been updated to: ${status.toUpperCase()}. Open Mock Interview page to check AI grades logs.`,
        type: 'success',
        status: 'unread',
        createdAt: new Date().toISOString()
      };
      setNotifications((prev) => [newAlert, ...prev]);
      setUnreadCount((c) => c + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const handleToggleDropdown = async () => {
    setShowDropdown((prev) => !prev);
    
    // Mark notifications as read when opening dropdown
    if (!showDropdown && unreadCount > 0) {
      try {
        await api.patch('/notifications/mark-read');
        setUnreadCount(0);
        setNotifications((prev) => prev.map((n) => ({ ...n, status: 'read' })));
      } catch (err) {
        console.error('Failed to mark notifications read:', err);
      }
    }
  };

  // Trigger test subscription expiry warning
  const handleTriggerTestExpiry = async () => {
    setTriggeringTest(true);
    try {
      await api.post('/notifications/trigger-expiry');
    } catch (err) {
      alert('Failed to trigger mock subscription alert.');
    } finally {
      setTriggeringTest(false);
    }
  };

  // Send support chat message
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !socketRef.current) return;

    const content = inputMessage.trim();
    // Dispatch message socket event
    socketRef.current.emit('chatMessage', {
      senderId: user._id,
      content
    });

    // Append user message locally
    setChatMessages((prev) => [...prev, { sender: 'user', content }]);
    setInputMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
      {/* Sidebar Panel */}
      <Sidebar />

      {/* Main Work Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header Bar */}
        <header className="h-20 bg-slate-950/20 border-b border-white/5 backdrop-blur-md px-8 flex items-center justify-between z-20 shrink-0 relative">
          {/* Search bar placeholder */}
          <div className="relative w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search features, guides..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-900/60 border border-white/5 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          {/* Profile Actions */}
          <div className="flex items-center gap-5">
            {/* Notifications Button */}
            <div className="relative">
              <button 
                onClick={handleToggleDropdown}
                className="relative p-2 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-[9px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-slate-950">
                    {unreadCount}
                  </span>
                )}
                <Bell className="w-4.5 h-4.5" />
              </button>

              {/* Glassmorphic Dropdown notifications feed */}
              {showDropdown && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-slate-950/95 border border-white/10 shadow-2xl backdrop-blur-xl z-50 p-4 max-h-[360px] overflow-y-auto space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-xs font-bold text-slate-200">Alerts & Notifications</span>
                    <button
                      onClick={handleTriggerTestExpiry}
                      disabled={triggeringTest}
                      className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {triggeringTest ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          Expiry Test <Sparkles className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {notifications.length > 0 ? (
                      notifications.map((item) => (
                        <div 
                          key={item._id}
                          className={`p-3 rounded-xl border flex items-start gap-2.5 transition-all
                            ${item.status === 'unread' 
                              ? 'bg-indigo-500/5 border-indigo-500/20' 
                              : 'bg-white/5 border-white/5'
                            }`}
                        >
                          {/* Alert Type Icons */}
                          {item.type === 'success' && <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />}
                          {item.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
                          {item.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                          {item.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />}

                          <div>
                            <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed font-semibold">
                              {item.message}
                            </p>
                            <span className="text-[8px] text-slate-600 block mt-1.5 font-mono">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 text-center py-6">No notifications logged.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar / Indicator */}
            <div className="flex items-center gap-3 pl-2 border-l border-white/5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white border border-indigo-400/20 shadow-md">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-semibold text-slate-200 leading-none">
                  {user?.name || 'Guest User'}
                </p>
                <p className="text-[10px] text-slate-500 mt-1 font-medium capitalize">
                  {user?.role || 'Basic Account'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <main className="flex-grow p-8 bg-gradient-to-b from-slate-950 to-slate-900 overflow-y-auto flex flex-col justify-between">
          <div className="flex-grow">
            <Outlet />
          </div>
          
          {/* Dashboard Page Footer */}
          <footer className="mt-16 pt-6 border-t border-white/5 text-center text-[10px] text-slate-500 font-semibold space-y-2 shrink-0">
            <div className="flex justify-center gap-6 text-indigo-400">
              <a href="https://github.com/placeholder" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-300 transition-colors">GitHub</a>
              <a href="https://www.linkedin.com/in/deepakdevkar" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-300 transition-colors">LinkedIn</a>
              <a href="https://deepakdevkar.netlify.app" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-300 transition-colors">Portfolio</a>
            </div>
            <p>Developed by <span className="text-indigo-400 font-bold">Deepak Devkar</span></p>
            <p>&copy; 2026 Deepak Devkar. All Rights Reserved.</p>
          </footer>
        </main>
      </div>

      {/* Floating Chat Support widget (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="mb-4 w-80 h-[380px] bg-slate-950/95 border border-white/10 rounded-2xl shadow-2xl flex flex-col backdrop-blur-xl overflow-hidden"
            >
              {/* Chat Header */}
              <div className="p-3 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-200">AI Support Agent</h3>
                  <span className="text-[9px] text-slate-500 font-bold flex items-center gap-1 mt-0.5 capitalize">
                    <Users className="w-3 h-3 text-green-400" /> {onlineCount} active online
                  </span>
                </div>
                <button 
                  onClick={() => setShowChat(false)}
                  className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-grow p-4 overflow-y-auto space-y-3 flex flex-col">
                {chatMessages.map((msg, idx) => (
                  <div 
                    key={idx}
                    className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed font-semibold
                      ${msg.sender === 'ai' 
                        ? 'bg-white/5 border border-white/5 text-slate-300 align-self-start mr-auto' 
                        : 'bg-indigo-600 text-white align-self-end ml-auto'
                      }`}
                  >
                    {msg.content}
                  </div>
                ))}

                {/* AI Typing Indicator */}
                {isAiTyping && (
                  <div className="flex items-center gap-1 bg-white/5 border border-white/5 rounded-xl p-3 text-[10px] text-slate-400 font-semibold align-self-start mr-auto">
                    <span>AI is typing</span>
                    <span className="flex gap-0.5 ml-1">
                      <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" />
                      <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </span>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-white/5 bg-slate-950/40 flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type support query..."
                  className="flex-grow px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-white/5 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Chat Button */}
        <button
          onClick={() => setShowChat((prev) => !prev)}
          className="p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105 relative"
        >
          {onlineCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-slate-950 z-20">
              {onlineCount}
            </span>
          )}
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AppLayout;
