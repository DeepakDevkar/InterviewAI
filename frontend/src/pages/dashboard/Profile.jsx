import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, ShieldCheck, Mail, Lock, Sparkles, Key } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials } from '../../features/auth/authSlice.js';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';

export const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const { register: profileRegister, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = useForm({
    defaultValues: {
      name: user?.name || 'John Doe',
      email: user?.email || 'johndoe@example.com'
    }
  });

  const { register: passwordRegister, handleSubmit: handlePasswordSubmit, reset: resetPassword, formState: { errors: passwordErrors } } = useForm();

  const onUpdateProfile = (data) => {
    // Simulate API Response delay
    setTimeout(() => {
      const updatedUser = {
        ...user,
        name: data.name,
        email: data.email
      };
      dispatch(setCredentials({ user: updatedUser, token: 'mock-access-token-12345' }));
      alert('Profile updated successfully! (Mock API)');
    }, 500);
  };

  const onUpdatePassword = (data) => {
    // Simulate API Response delay
    setTimeout(() => {
      resetPassword();
      alert('Password updated successfully! (Mock API)');
    }, 500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Account Profile</h1>
        <p className="text-xs text-slate-400 mt-1">Manage credentials, view account status, and modify details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card Summary */}
        <Card className="md:col-span-1 border-white/5 h-fit text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white border border-indigo-400/20 shadow-lg text-2xl font-bold mb-4">
            {user?.name?.[0] || 'U'}
          </div>
          <h3 className="text-sm font-bold text-slate-200">{user?.name || 'Guest User'}</h3>
          <p className="text-[10px] text-slate-500 font-semibold mt-1">{user?.email || 'guest@example.com'}</p>

          <div className="w-full border-t border-white/5 mt-6 pt-4 space-y-3.5 text-left">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-500">Access Level</span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 capitalize">
                {user?.role || 'Basic User'}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-500">Account Type</span>
              <span className="text-slate-300">Free Tier</span>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-500">Member Since</span>
              <span className="text-slate-300">Jul 2026</span>
            </div>
          </div>
        </Card>

        {/* Update Forms */}
        <div className="md:col-span-2 space-y-8">
          {/* Profile details form */}
          <Card className="border-white/5">
            <h3 className="text-sm font-bold text-slate-200 mb-5 flex items-center gap-2">
              <User className="w-4.5 h-4.5 text-indigo-400" /> Account Metadata
            </h3>

            <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  type="text"
                  error={profileErrors.name?.message}
                  {...profileRegister('name', { required: 'Name is required' })}
                />
                <Input
                  label="Email Address"
                  type="email"
                  error={profileErrors.email?.message}
                  {...profileRegister('email', { 
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" className="px-6 py-2.5">
                  Save Settings
                </Button>
              </div>
            </form>
          </Card>

          {/* Change password form */}
          <Card className="border-white/5">
            <h3 className="text-sm font-bold text-slate-200 mb-5 flex items-center gap-2">
              <Key className="w-4.5 h-4.5 text-indigo-400" /> Security Credentials
            </h3>

            <form onSubmit={handlePasswordSubmit(onUpdatePassword)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Current Password"
                  type="password"
                  placeholder="••••••••"
                  error={passwordErrors.currentPassword?.message}
                  {...passwordRegister('currentPassword', { required: 'Current password is required' })}
                />
                <Input
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  error={passwordErrors.newPassword?.message}
                  {...passwordRegister('newPassword', { 
                    required: 'New password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  })}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="glass" className="px-6 py-2.5">
                  Change Password
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
