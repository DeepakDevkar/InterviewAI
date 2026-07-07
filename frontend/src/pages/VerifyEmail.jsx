import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { BrainCircuit, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { setCredentials } from '../features/auth/authSlice.js';
import api from '../services/api.js';
import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [errorMsg, setErrorMsg] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    const performVerification = async () => {
      if (!token) {
        setStatus('error');
        setErrorMsg('Invalid verification token. No token provided in the URL.');
        return;
      }

      try {
        const res = await api.post('/auth/verify-email', { token });
        dispatch(setCredentials({ 
          user: res.data.data.user, 
          token: res.data.accessToken 
        }));
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setErrorMsg(err.response?.data?.message || 'Verification link is invalid or has expired.');
      }
    };

    performVerification();
  }, [token, dispatch]);

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
          <div className="flex items-center gap-2 mb-4">
            <BrainCircuit className="w-10 h-10 text-indigo-400" />
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              InterviewAI
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-200">Email Verification</h2>
        </div>

        <Card className="border-white/5 shadow-2xl text-center py-8">
          {status === 'verifying' && (
            <div className="flex flex-col items-center py-6">
              <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-4" />
              <p className="text-xs text-slate-300 font-semibold">Validating security credentials...</p>
              <p className="text-[10px] text-slate-500 mt-1 font-medium">Please wait while we verify your address</p>
            </div>
          )}

          {status === 'success' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-6"
            >
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-200 mb-2">Verification Successful!</h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-6">
                Your email has been verified. You can now access your InterviewAI dashboard.
              </p>
              <Button onClick={() => navigate('/dashboard')} variant="primary" className="w-full">
                Go to Dashboard
              </Button>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-6"
            >
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 mb-4">
                <XCircle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-200 mb-2">Verification Failed</h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-6">
                {errorMsg}
              </p>
              <Link to="/login" className="w-full">
                <Button variant="secondary" className="w-full">
                  Return to Login
                </Button>
              </Link>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
