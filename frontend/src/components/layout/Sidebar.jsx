import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  UserSquare2, 
  Video, 
  Code, 
  User, 
  CreditCard, 
  Settings as SettingsIcon, 
  ShieldCheck, 
  LogOut,
  BrainCircuit,
  Award
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../features/auth/authSlice.js';
import api from '../../services/api.js';

export const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error on backend:', err);
    }
    dispatch(logOut());
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume Analyzer', path: '/dashboard/resume', icon: FileText },
    { name: 'Interview Generator', path: '/dashboard/generator', icon: UserSquare2 },
    { name: 'Mock Interview', path: '/dashboard/mock', icon: Video },
    { name: 'Coding Practice', path: '/dashboard/code', icon: Code },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
    { name: 'Subscription', path: '/dashboard/subscription', icon: CreditCard },
    { name: 'Settings', path: '/dashboard/settings', icon: SettingsIcon },
    { name: 'About Developer', path: '/dashboard/developer', icon: Award }
  ];

  // Add Admin Dashboard if user is admin or if we just want it visible in mock state
  if (user?.role === 'admin' || !user) {
    navItems.push({ name: 'Admin Dashboard', path: '/dashboard/admin', icon: ShieldCheck });
  }

  return (
    <aside className="w-64 min-h-screen bg-slate-950/40 border-r border-white/5 backdrop-blur-xl flex flex-col justify-between p-6">
      <div className="flex flex-col gap-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              InterviewAI
            </h2>
            <span className="text-xs text-slate-500 font-medium">SaaS Platform</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) => `
                flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-lg shadow-indigo-950/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Actions / Logout */}
      <div className="border-t border-white/5 pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-red-300 hover:bg-red-500/5 transition-all duration-300 group border border-transparent"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
