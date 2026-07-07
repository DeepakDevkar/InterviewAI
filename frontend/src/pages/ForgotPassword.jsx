import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api.js';
import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';
import Input from '../components/common/Input.jsx';

export const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    try {
      await api.post('/auth/forgot-password', data);
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
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
          <h2 className="text-xl font-bold text-slate-200">Reset Password</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">We will send a security recovery token link</p>
        </div>

        <Card className="border-white/5 shadow-2xl">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-xs flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          {!submitted ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

              <Button type="submit" disabled={loading} variant="primary" className="w-full py-3">
                {loading ? 'Sending Request...' : 'Send Recovery Link'}
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
              <h3 className="text-base font-bold text-slate-200 mb-2">Check Your Email</h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                If an account exists for that email address, we have sent password reset instructions.
              </p>
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

export default ForgotPassword;
