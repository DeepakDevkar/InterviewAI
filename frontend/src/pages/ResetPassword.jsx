import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { BrainCircuit, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { setCredentials } from '../features/auth/authSlice.js';
import api from '../services/api.js';
import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';
import Input from '../components/common/Input.jsx';

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  const token = searchParams.get('token');
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const password = watch('password');

  const onSubmit = async (data) => {
    if (!token) {
      setErrorMsg('No reset token found in URL.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.post('/auth/reset-password', {
        token,
        password: data.password
      });
      // Set session & auto log in
      dispatch(setCredentials({ 
        user: res.data.data.user, 
        token: res.data.accessToken 
      }));
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to reset password. Token may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 relative">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <BrainCircuit className="w-10 h-10 text-indigo-400" />
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              InterviewAI
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-200">Update Credentials</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">Please enter your new security password</p>
        </div>

        <Card className="border-white/5 shadow-2xl">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-xs flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          {!submitted ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="relative">
                <Lock className="absolute right-4 top-10.5 w-4 h-4 text-slate-500" />
                <Input
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  })}
                />
              </div>

              <div className="relative">
                <Lock className="absolute right-4 top-10.5 w-4 h-4 text-slate-500" />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••"
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                />
              </div>

              <Button type="submit" disabled={loading || !token} variant="primary" className="w-full py-3 mt-2">
                {loading ? 'Updating Password...' : 'Save New Password'}
              </Button>
            </form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4 flex flex-col items-center"
            >
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-200 mb-2">Password Updated!</h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-6">
                Your new password has been successfully applied to your account.
              </p>
              <Button onClick={() => navigate('/dashboard')} variant="primary" className="w-full">
                Go to Dashboard
              </Button>
            </motion.div>
          )}
        </Card>

        <p className="text-center text-xs text-slate-500 mt-6 font-semibold">
          Back to{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
