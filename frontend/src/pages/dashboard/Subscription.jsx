import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, AlertCircle, Loader2, Award, Zap, Building } from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import api from '../../services/api.js';

export const Subscription = () => {
  const [subDetails, setSubDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch subscription details and usage logs on mount
  const fetchSubscriptionDetails = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.get('/payments/subscription-details');
      setSubDetails(res.data.data);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to fetch subscription records. Using simulated basic view.');
      // Fallback offline data
      setSubDetails({
        subscription: { plan: 'free', status: 'active', startDate: new Date().toISOString(), endDate: null },
        usage: {
          resumes: { current: 0, limit: 1 },
          interviews: { current: 0, limit: 2 }
        },
        invoices: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionDetails();
  }, []);

  // Handle plan upgrade action
  const handleUpgradePlan = async (planType) => {
    setCheckoutLoading(true);
    setErrorMsg('');
    try {
      const res = await api.post('/payments/checkout', { planType });
      alert(`Subscription successfully upgraded to ${planType.toUpperCase()} plan!`);
      // Reload updated limits
      await fetchSubscriptionDetails();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Transaction failed. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-xs text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <span>Compiling billing and quotas metrics...</span>
      </div>
    );
  }

  const { subscription, usage, invoices } = subDetails;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Subscription & Billing</h1>
        <p className="text-xs text-slate-400 mt-1">Upgrade subscription plans, audit invoices ledger, and monitor usage limits quota.</p>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-xs flex items-center gap-2 font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Usage and Current Plan details */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-white/5 h-fit">
            <span className="text-[9px] text-indigo-400 font-extrabold uppercase tracking-wider">Active Plan</span>
            <h2 className="text-xl font-bold text-slate-200 mt-1 capitalize">{subscription.plan} Plan</h2>
            <p className="text-2xl font-extrabold text-white mt-3">
              {subscription.plan === 'free' ? '$0' : subscription.plan === 'pro' ? '$29' : '$99'}
              <span className="text-xs text-slate-500 font-semibold">/mo</span>
            </p>

            {subscription.endDate && (
              <p className="text-[10px] text-slate-500 mt-2 font-semibold">
                Renews on: {new Date(subscription.endDate).toLocaleDateString()}
              </p>
            )}

            {/* Quota Indicators */}
            <div className="border-t border-white/5 mt-6 pt-5 space-y-5">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-500">Resumes Analyzed</span>
                  <span className="text-slate-300 font-bold">
                    {usage.resumes.current} / {usage.resumes.limit === Infinity ? 'Unlimited' : usage.resumes.limit}
                  </span>
                </div>
                <div className="w-full bg-slate-950/60 h-1.5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${usage.resumes.limit === Infinity ? 100 : (usage.resumes.current / usage.resumes.limit) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-500">Mocks Completed</span>
                  <span className="text-slate-300 font-bold">
                    {usage.interviews.current} / {usage.interviews.limit === Infinity ? 'Unlimited' : usage.interviews.limit}
                  </span>
                </div>
                <div className="w-full bg-slate-950/60 h-1.5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="bg-purple-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${usage.interviews.limit === Infinity ? 100 : (usage.interviews.current / usage.interviews.limit) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Features check card */}
          <Card className="border-white/5 text-xs text-slate-400 space-y-3">
            <h3 className="font-bold text-slate-300">Features Checklist</h3>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Real-Time WebSockets Alerts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Speech-To-Text Audio Graders</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Google Gemini AI Analytics</span>
            </div>
          </Card>
        </div>

        {/* Right Side: Plans Selection Matrix & Invoice Ledger */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Plans Selection Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Pro Plan Card */}
            <Card className={`border-white/5 flex flex-col justify-between relative overflow-hidden
              ${subscription.plan === 'pro' ? 'ring-1 ring-indigo-500 bg-indigo-500/5' : ''}`}>
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] text-indigo-400 font-extrabold uppercase tracking-wider">Most Popular</span>
                    <h3 className="text-base font-bold text-slate-200 mt-1 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-indigo-400" /> Pro Tier
                    </h3>
                  </div>
                  <span className="text-lg font-extrabold text-white">$29<span className="text-[10px] text-slate-500 font-normal">/mo</span></span>
                </div>
                
                <p className="text-[10px] text-slate-400 mt-3 leading-relaxed">
                  Tailored for active developers and engineers looking to optimize job outcomes.
                </p>

                <ul className="text-[10px] text-slate-300 mt-5 space-y-2.5 font-semibold">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                    <span>Unlimited Resume Review Audits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                    <span>Unlimited Mock Interviews</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                    <span>Premium Gemini AI Analysis</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <Button
                  onClick={() => handleUpgradePlan('pro')}
                  disabled={checkoutLoading || subscription.plan === 'pro' || subscription.plan === 'enterprise'}
                  variant={subscription.plan === 'pro' ? 'glass' : 'primary'}
                  className="w-full text-[11px] font-bold py-2.5 cursor-pointer"
                >
                  {checkoutLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" />
                  ) : subscription.plan === 'pro' ? (
                    'Active Pro Plan'
                  ) : subscription.plan === 'enterprise' ? (
                    'Upgraded Tier Active'
                  ) : (
                    'Upgrade to Pro'
                  )}
                </Button>
              </div>
            </Card>

            {/* Enterprise Plan Card */}
            <Card className={`border-white/5 flex flex-col justify-between relative overflow-hidden
              ${subscription.plan === 'enterprise' ? 'ring-1 ring-indigo-500 bg-indigo-500/5' : ''}`}>
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] text-indigo-400 font-extrabold uppercase tracking-wider">Corporate</span>
                    <h3 className="text-base font-bold text-slate-200 mt-1 flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-indigo-400" /> Enterprise Tier
                    </h3>
                  </div>
                  <span className="text-lg font-extrabold text-white">$99<span className="text-[10px] text-slate-500 font-normal">/mo</span></span>
                </div>
                
                <p className="text-[10px] text-slate-400 mt-3 leading-relaxed">
                  Tailored for recruitment agencies, teams, and collaborative corporate environments.
                </p>

                <ul className="text-[10px] text-slate-300 mt-5 space-y-2.5 font-semibold">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                    <span>Everything inside Pro plan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                    <span>Custom corporate roles parameters</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                    <span>Dedicated accounts dashboard slots</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <Button
                  onClick={() => handleUpgradePlan('enterprise')}
                  disabled={checkoutLoading || subscription.plan === 'enterprise'}
                  variant={subscription.plan === 'enterprise' ? 'glass' : 'primary'}
                  className="w-full text-[11px] font-bold py-2.5 cursor-pointer"
                >
                  {checkoutLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" />
                  ) : subscription.plan === 'enterprise' ? (
                    'Active Enterprise Plan'
                  ) : (
                    'Upgrade to Enterprise'
                  )}
                </Button>
              </div>
            </Card>

          </div>

          {/* Invoice Ledger Card */}
          <Card className="border-white/5">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-400" /> Invoice Ledger
            </h3>
            
            <div className="overflow-x-auto text-[11px] leading-relaxed">
              {invoices && invoices.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="pb-3 pr-4">Invoice ID</th>
                      <th className="pb-3 pr-4">Payment Date</th>
                      <th className="pb-3 pr-4">Amount Paid</th>
                      <th className="pb-3 pr-4">Payment Method</th>
                      <th className="pb-3 pr-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-semibold text-slate-300">
                    {invoices.map((inv) => (
                      <tr key={inv._id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 pr-4 font-mono text-[10px] text-slate-400">{inv.transactionId}</td>
                        <td className="py-3 pr-4 text-slate-400">{new Date(inv.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 pr-4">${inv.amount}</td>
                        <td className="py-3 pr-4 capitalize">{inv.paymentMethod}</td>
                        <td className="py-3 pr-4 text-right">
                          <span className="text-[8px] font-extrabold bg-green-500/10 border border-green-500/20 text-green-400 px-1.5 py-0.5 rounded uppercase">
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-xs text-slate-500 text-center py-6">No payment invoices logged.</p>
              )}
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
};

export default Subscription;
