import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts & Guards
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import AppLayout from './components/layout/AppLayout.jsx';

// Inline premium page loader fallback
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-500 font-semibold text-xs gap-3">
    <div className="w-8 h-8 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
    <span>Loading InterviewAI portal...</span>
  </div>
);

// Public Pages (Lazy Loaded / Code Splitted)
const Landing = lazy(() => import('./pages/Landing.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Signup = lazy(() => import('./pages/Signup.jsx'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.jsx'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail.jsx'));
const ResetPassword = lazy(() => import('./pages/ResetPassword.jsx'));

// Protected Dashboard Pages (Lazy Loaded / Code Splitted)
const DashboardHome = lazy(() => import('./pages/dashboard/DashboardHome.jsx'));
const ResumeAnalyzer = lazy(() => import('./pages/dashboard/ResumeAnalyzer.jsx'));
const InterviewGenerator = lazy(() => import('./pages/dashboard/InterviewGenerator.jsx'));
const MockInterview = lazy(() => import('./pages/dashboard/MockInterview.jsx'));
const CodingPractice = lazy(() => import('./pages/dashboard/CodingPractice.jsx'));
const Profile = lazy(() => import('./pages/dashboard/Profile.jsx'));
const Subscription = lazy(() => import('./pages/dashboard/Subscription.jsx'));
const Settings = lazy(() => import('./pages/dashboard/Settings.jsx'));
const AdminDashboard = lazy(() => import('./pages/dashboard/AdminDashboard.jsx'));
const AboutDeveloper = lazy(() => import('./pages/dashboard/AboutDeveloper.jsx'));

function App() {
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="resume" element={<ResumeAnalyzer />} />
              <Route path="generator" element={<InterviewGenerator />} />
              <Route path="mock" element={<MockInterview />} />
              <Route path="code" element={<CodingPractice />} />
              <Route path="profile" element={<Profile />} />
              <Route path="subscription" element={<Subscription />} />
              <Route path="settings" element={<Settings />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="developer" element={<AboutDeveloper />} />
            </Route>
          </Route>

          {/* Fallback Catch-All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default App;
