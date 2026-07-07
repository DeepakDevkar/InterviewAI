import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { BrainCircuit, Lock, Mail, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { setCredentials, setLoading } from '../features/auth/authSlice.js';
import api from '../services/api.js';
import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';
import Input from '../components/common/Input.jsx';

export const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState('');
  const [registered, setRegistered] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleGoogleLoginResponse = async (response) => {
    dispatch(setLoading(true));
    setErrorMsg('');
    try {
      const res = await api.post('/auth/google', { idToken: response.credential });
      dispatch(setCredentials({ user: res.data.data.user, token: res.data.accessToken }));
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Google signup failed. Please try again.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    const initGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '1074092147775-mockgoogleclientid.apps.googleusercontent.com',
          callback: handleGoogleLoginResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-signup-btn'),
          { theme: 'dark', size: 'large', width: '100%', shape: 'pill' }
        );
      }
    };

    initGoogle();
    const timer = setTimeout(initGoogle, 1000);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (data) => {
    dispatch(setLoading(true));
    setErrorMsg('');
    try {
      await api.post('/auth/register', data);
      setRegistered(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 relative">
      {/* Background gradients */}
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
          <h2 className="text-xl font-bold text-slate-200">Create Account</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">Register to begin optimization assessments</p>
        </div>

        <Card className="border-white/5 shadow-2xl">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-xs flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          {!registered ? (
            <>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="relative">
                  <User className="absolute right-4 top-10.5 w-4 h-4 text-slate-500" />
                  <Input
                    label="Full Name"
                    type="text"
                    placeholder="John Doe"
                    error={errors.name?.message}
                    {...register('name', { required: 'Name is required' })}
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute right-4 top-10.5 w-4 h-4 text-slate-500" />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    error={errors.email?.message}
                    {...register('email', { 
                      required: 'Email address is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute right-4 top-10.5 w-4 h-4 text-slate-500" />
                  <Input
                    label="Password"
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

                <div className="flex items-start text-xs font-semibold mt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer text-slate-400 hover:text-slate-300">
                    <input 
                      type="checkbox" 
                      className="rounded mt-0.5 bg-slate-900 border-white/10 text-indigo-600 focus:ring-0" 
                      required
                    />
                    <span>I agree to the Terms of Service and Privacy Policy</span>
                  </label>
                </div>

                <Button type="submit" variant="primary" className="w-full py-3 mt-4">
                  Create Free Account
                </Button>
              </form>

              {/* divider */}
              <div className="flex items-center justify-center gap-4 my-5">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold">Or Sign Up With</span>
                <div className="h-px bg-white/10 flex-1" />
              </div>

              {/* Google signup button wrapper */}
              <div className="w-full flex justify-center">
                <div id="google-signup-btn" className="w-full min-h-[40px] flex justify-center" />
              </div>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 flex flex-col items-center"
            >
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-200 mb-2">Check Your Inbox</h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                We have sent an email verification link. Please verify your address to log in.
              </p>
            </motion.div>
          )}
        </Card>

        <p className="text-center text-xs text-slate-500 mt-6 font-semibold">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
