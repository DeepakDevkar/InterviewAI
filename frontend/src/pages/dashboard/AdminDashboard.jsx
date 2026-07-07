import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Users as UsersIcon, 
  Video, 
  DollarSign, 
  CreditCard,
  TrendingUp, 
  Terminal, 
  Loader2, 
  UserX, 
  UserCheck, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import api from '../../services/api.js';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'users' | 'interviews' | 'payments'
  
  // Data States
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [payments, setPayments] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Fetch statistics
  const fetchStats = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data.data.stats);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to fetch administrator stats. Showing offline mock data.');
      setStats({
        totalUsers: 142,
        completedMocks: 89,
        activeSubscribers: 28,
        totalRevenue: 1840,
        chartData: [
          { name: 'Jan', revenue: 420 },
          { name: 'Feb', revenue: 650 },
          { name: 'Mar', revenue: 880 },
          { name: 'Apr', revenue: 750 },
          { name: 'May', revenue: 1200 },
          { name: 'Jun', revenue: 1450 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data.users);
    } catch (err) {
      setErrorMsg('Failed to query registered accounts.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Fetch Interviews
  const fetchInterviews = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.get('/admin/interviews');
      setInterviews(res.data.data.interviews);
    } catch (err) {
      setErrorMsg('Failed to query platform interview runs.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Fetch Payments
  const fetchPayments = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.get('/admin/payments');
      setPayments(res.data.data.payments);
    } catch (err) {
      setErrorMsg('Failed to query ledger transactions.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger loading based on tab switch
  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchStats();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'interviews') {
      fetchInterviews();
    } else if (activeTab === 'payments') {
      fetchPayments();
    }
  }, [activeTab]);

  // 5. Account Suspend/Activate toggle action
  const handleToggleUserStatus = async (userId, currentStatus) => {
    setActionLoadingId(userId);
    const targetStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    try {
      await api.patch(`/admin/users/${userId}/status`, { status: targetStatus });
      
      // Update local state directly
      setUsers(prevUsers => prevUsers.map(u => 
        u._id === userId ? { ...u, status: targetStatus } : u
      ));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user account status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/5 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-400" /> Administrative Panel
          </h1>
          <p className="text-[10px] text-slate-500 mt-1">Manage users, audit sessions, check payment transactions, and view platform metrics.</p>
        </div>
      </div>

      {/* Tabs Selector headers */}
      <div className="flex border-b border-white/5 pb-2 shrink-0 gap-4">
        {[
          { id: 'analytics', label: 'Platform Analytics' },
          { id: 'users', label: 'Manage Users' },
          { id: 'interviews', label: 'Audit Sessions' },
          { id: 'payments', label: 'Payments Ledger' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-colors duration-300
              ${activeTab === tab.id 
                ? 'border-indigo-500 text-indigo-400' 
                : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-xs flex items-center gap-2 font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Dynamic Content views */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-xs text-slate-500 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          <span>Compiling administrative registers...</span>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {/* TAB 1: Platform Analytics */}
          {activeTab === 'analytics' && stats && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Analytics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-white/5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Accounts</p>
                      <h3 className="text-2xl font-extrabold mt-1 text-white">{stats.totalUsers}</h3>
                      <span className="text-[9px] text-slate-500 font-semibold mt-2 block">Registered Profiles</span>
                    </div>
                    <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                      <UsersIcon className="w-5 h-5" />
                    </div>
                  </div>
                </Card>

                <Card className="border-white/5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mock Sessions</p>
                      <h3 className="text-2xl font-extrabold mt-1 text-white">{stats.completedMocks}</h3>
                      <span className="text-[9px] text-slate-500 font-semibold mt-2 block">Completed mock tests</span>
                    </div>
                    <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                      <Video className="w-5 h-5" />
                    </div>
                  </div>
                </Card>

                <Card className="border-white/5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pro Members</p>
                      <h3 className="text-2xl font-extrabold mt-1 text-white">{stats.activeSubscribers}</h3>
                      <span className="text-[9px] text-slate-500 font-semibold mt-2 block">Active subscriptions</span>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-xl text-green-400">
                      <CreditCard className="w-5 h-5" />
                    </div>
                  </div>
                </Card>

                <Card className="border-white/5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Gross Cashflow</p>
                      <h3 className="text-2xl font-extrabold mt-1 text-white">${stats.totalRevenue}</h3>
                      <span className="text-[9px] text-slate-500 font-semibold mt-2 block">Stripe accumulated revenue</span>
                    </div>
                    <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Revenue Graph */}
              <Card className="border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-sm font-bold text-slate-200">Revenue Stream Audit</h2>
                    <p className="text-[10px] text-slate-500 mt-0.5">Stripe transaction volumes across monthly buckets</p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                </div>

                <div className="h-64 w-full text-[10px] font-mono text-slate-400">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                      <XAxis dataKey="name" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0f172a', 
                          borderColor: 'rgba(255,255,255,0.08)',
                          borderRadius: '12px',
                          color: '#f8fafc' 
                        }} 
                      />
                      <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
          )}

          {/* TAB 2: Manage Users */}
          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-slate-500 uppercase tracking-wider font-bold">
                        <th className="py-4 px-4">Candidate Details</th>
                        <th className="py-4 px-4">Account Type</th>
                        <th className="py-4 px-4">Login Channel</th>
                        <th className="py-4 px-4">Account Status</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map(u => (
                        <tr key={u._id} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4">
                            <div className="font-bold text-slate-200">{u.name}</div>
                            <div className="text-[10px] text-slate-500 font-semibold">{u.email}</div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`text-[9px] font-extrabold border px-1.5 py-0.5 rounded uppercase
                              ${u.role === 'admin' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-slate-500/10 border-white/5 text-slate-300'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-semibold text-slate-400 capitalize">
                            {u.googleId ? 'Google Account' : 'Credentials'}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`text-[9px] font-extrabold border px-1.5 py-0.5 rounded uppercase
                              ${u.status === 'suspended' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            {u.role !== 'admin' && (
                              <Button
                                onClick={() => handleToggleUserStatus(u._id, u.status)}
                                disabled={actionLoadingId === u._id}
                                variant={u.status === 'suspended' ? 'glass' : 'danger'}
                                className="px-3.5 py-1.5 text-[10px] font-bold"
                              >
                                {actionLoadingId === u._id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : u.status === 'suspended' ? (
                                  <>
                                    <UserCheck className="w-3.5 h-3.5 mr-1 text-green-400" /> Activate
                                  </>
                                ) : (
                                  <>
                                    <UserX className="w-3.5 h-3.5 mr-1" /> Suspend
                                  </>
                                )}
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {/* TAB 3: Audit Sessions */}
          {activeTab === 'interviews' && (
            <motion.div
              key="interviews"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-slate-500 uppercase tracking-wider font-bold">
                        <th className="py-4 px-4">Session Title</th>
                        <th className="py-4 px-4">Candidate profile</th>
                        <th className="py-4 px-4">Target Job</th>
                        <th className="py-4 px-4">Difficulty</th>
                        <th className="py-4 px-4">Mocks Status</th>
                        <th className="py-4 px-4 text-right">Created Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {interviews.map(i => (
                        <tr key={i._id} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 font-bold text-slate-200">{i.title}</td>
                          <td className="py-4 px-4">
                            <div className="font-semibold text-slate-300">{i.user?.name || 'Unknown'}</div>
                            <div className="text-[9px] text-slate-500">{i.user?.email || 'N/A'}</div>
                          </td>
                          <td className="py-4 px-4 text-slate-400 font-semibold">{i.roleType}</td>
                          <td className="py-4 px-4 font-bold text-slate-400 capitalize">{i.difficulty}</td>
                          <td className="py-4 px-4">
                            <span className={`text-[9px] font-extrabold border px-1.5 py-0.5 rounded uppercase
                              ${i.status === 'completed' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                i.status === 'in-progress' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                'bg-slate-500/10 border-white/5 text-slate-400'
                              }`}>
                              {i.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right text-slate-500 font-mono">
                            {new Date(i.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {/* TAB 4: Payments Ledger */}
          {activeTab === 'payments' && (
            <motion.div
              key="payments"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-slate-500 uppercase tracking-wider font-bold">
                        <th className="py-4 px-4">Payee</th>
                        <th className="py-4 px-4">Stripe Transaction ID</th>
                        <th className="py-4 px-4">Amount</th>
                        <th className="py-4 px-4">Payment Method</th>
                        <th className="py-4 px-4">Status</th>
                        <th className="py-4 px-4 text-right">Payment Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {payments.map(p => (
                        <tr key={p._id} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4">
                            <div className="font-semibold text-slate-200">{p.user?.name || 'Unknown'}</div>
                            <div className="text-[9px] text-slate-500">{p.user?.email || 'N/A'}</div>
                          </td>
                          <td className="py-4 px-4 font-mono text-[10px] text-slate-400">{p.transactionId}</td>
                          <td className="py-4 px-4 font-extrabold text-slate-200">${p.amount}</td>
                          <td className="py-4 px-4 font-semibold text-slate-400 capitalize">{p.paymentMethod}</td>
                          <td className="py-4 px-4">
                            <span className={`text-[9px] font-extrabold border px-1.5 py-0.5 rounded uppercase
                              ${p.status === 'succeeded' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right text-slate-500 font-mono">
                            {new Date(p.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default AdminDashboard;
