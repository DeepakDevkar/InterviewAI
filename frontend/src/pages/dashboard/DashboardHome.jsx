import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  FileText, 
  Video, 
  Code, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight,
  ChevronRight,
  Loader2,
  Clock,
  CheckCircle,
  FileCheck2,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import api from '../../services/api.js';

export const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch real-time dashboard statistics from backend API
  const fetchStats = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data.data.stats);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
      setErrorMsg('Failed to refresh real-time metrics logs. Using offline simulation data.');
      
      // Fallback mock stats if backend is not running/accessible
      setStats({
        totalInterviews: 12,
        avgScore: 78,
        resumeScore: 85,
        codingScore: 400,
        weeklyProgress: [
          { day: 'Mon', solved: 1 },
          { day: 'Tue', solved: 0 },
          { day: 'Wed', solved: 2 },
          { day: 'Thu', solved: 0 },
          { day: 'Fri', solved: 1 },
          { day: 'Sat', solved: 0 },
          { day: 'Sun', solved: 0 }
        ],
        monthlyProgress: [
          { name: 'Test 1', score: 65 },
          { name: 'Test 2', score: 72 },
          { name: 'Test 3', score: 78 },
          { name: 'Test 4', score: 85 }
        ],
        upcomingInterviews: [
          { _id: '1', title: 'Stripe Frontend Mock', roleType: 'Senior React Engineer', difficulty: 'hard' },
          { _id: '2', title: 'General System Design', roleType: 'Solutions Architect', difficulty: 'medium' }
        ],
        activityTimeline: [
          { type: 'resume', message: 'Analyzed Resume: "Deepak_CV_2026.pdf"', date: new Date().toISOString() },
          { type: 'coding', message: 'Solved Challenge: "Two Sum"', status: 'accepted', date: new Date().toISOString() },
          { type: 'interview', message: 'Mock Session: "React Developer Prep"', status: 'completed', date: new Date().toISOString() }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-xs text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <span>Compiling real-time dashboard analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard Home</h1>
          <p className="text-xs text-slate-400 mt-1">Monitor mock interview scores, code challenge milestones, and resumes metrics logs.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/dashboard/generator">
            <Button variant="primary" className="py-2.5">
              Start Mock Interview <ArrowUpRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl text-xs flex items-center gap-2 font-semibold">
          <Info className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Grid of Widgets (4 Metrics Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Widget 1: Resume Score */}
        <Card hoverEffect={true} className="border-white/5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Latest Resume Score</p>
              <h3 className="text-2xl font-extrabold mt-1 text-white">
                {stats.resumeScore > 0 ? `${stats.resumeScore}/100` : 'Not Rated'}
              </h3>
              <span className="text-[10px] text-indigo-400 font-semibold flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3" /> Optimize inside uploader
              </span>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* Widget 2: Total Interviews */}
        <Card hoverEffect={true} className="border-white/5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Interviews</p>
              <h3 className="text-2xl font-extrabold mt-1 text-white">
                {stats.totalInterviews} {stats.totalInterviews === 1 ? 'Session' : 'Sessions'}
              </h3>
              <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 mt-2">
                Initiate in mock rooms
              </span>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
              <Video className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* Widget 3: Average Mock Score */}
        <Card hoverEffect={true} className="border-white/5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Mock Score</p>
              <h3 className="text-2xl font-extrabold mt-1 text-white">
                {stats.avgScore > 0 ? `${stats.avgScore}%` : 'No score yet'}
              </h3>
              <span className="text-[10px] text-green-400 font-semibold flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3" /> Target standard benchmarks
              </span>
            </div>
            <div className="p-3 bg-green-500/10 rounded-xl text-green-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* Widget 4: Coding Score */}
        <Card hoverEffect={true} className="border-white/5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Coding Points</p>
              <h3 className="text-2xl font-extrabold mt-1 text-white">
                {stats.codingScore} Pts
              </h3>
              <span className="text-[10px] text-slate-500 font-semibold mt-2 block">
                Solved {stats.codingScore / 100} algorithms challenges
              </span>
            </div>
            <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
              <Code className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Monthly Progress Chart (Col-span 2) */}
        <Card className="lg:col-span-2 border-white/5">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-sm font-bold text-slate-200">Monthly Progress Timeline</h2>
              <p className="text-[10px] text-slate-500 mt-0.5">Fluctuations in mock interview evaluation grades</p>
            </div>
            <div className="px-2 py-0.5 bg-white/5 rounded border border-white/5 text-[9px] font-bold text-slate-400">
              Overall Score (%)
            </div>
          </div>

          <div className="h-64 w-full text-slate-300 text-[10px] font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyProgress} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMonthly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: 'rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    color: '#f8fafc' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorMonthly)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Right: Weekly Progress Bar chart */}
        <Card className="border-white/5">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-sm font-bold text-slate-200">Weekly Coding Activity</h2>
              <p className="text-[10px] text-slate-500 mt-0.5">Problems solved this week</p>
            </div>
          </div>

          <div className="h-64 w-full text-slate-300 text-[10px] font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyProgress} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: 'rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    color: '#f8fafc' 
                  }} 
                />
                <Bar dataKey="solved" fill="#22d3ee" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Upcoming & Activity Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Activity Timeline (Col-span 2) */}
        <Card className="lg:col-span-2 border-white/5">
          <h2 className="text-sm font-bold text-slate-200 mb-6 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-400" /> Recent Activity Timeline
          </h2>

          <div className="relative border-l border-white/10 pl-6 ml-3 space-y-6">
            {stats.activityTimeline && stats.activityTimeline.length > 0 ? (
              stats.activityTimeline.map((item, idx) => (
                <div key={idx} className="relative">
                  {/* Indicator Dot */}
                  <span className={`absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full border-2 border-slate-900 z-10
                    ${item.type === 'resume' ? 'bg-blue-400' :
                      item.type === 'coding' ? 'bg-cyan-400' :
                      'bg-purple-400'
                    }`}
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-200">{item.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-500 font-semibold">
                        {new Date(item.date).toLocaleDateString(undefined, { 
                          month: 'short', 
                          day: 'numeric', 
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </span>
                      {item.status && (
                        <span className={`text-[8px] font-extrabold border px-1.5 rounded uppercase
                          ${item.status === 'accepted' || item.status === 'completed' 
                            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                            : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                          }`}>
                          {item.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 pl-2">No activity logged yet. Practice codes or analytical mock modules.</p>
            )}
          </div>
        </Card>

        {/* Right: Upcoming Mock Interviews sidebar */}
        <Card className="border-white/5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-200 mb-6 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-400" /> Upcoming Mock sessions
            </h2>

            <div className="space-y-4">
              {stats.upcomingInterviews && stats.upcomingInterviews.length > 0 ? (
                stats.upcomingInterviews.map((session) => (
                  <div 
                    key={session._id} 
                    className="p-3 bg-slate-950/40 border border-white/5 rounded-xl hover:border-indigo-500/20 transition-all duration-300 flex justify-between items-center"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-300">{session.title}</h4>
                      <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">{session.roleType}</span>
                    </div>
                    <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded border uppercase shrink-0
                      ${session.difficulty === 'easy' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                        session.difficulty === 'medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                        'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}>
                      {session.difficulty}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-xs text-slate-500 flex flex-col items-center">
                  <span>No upcoming mock runs booked.</span>
                  <Link to="/dashboard/generator" className="text-indigo-400 hover:underline mt-2 block font-semibold">
                    Schedule session now
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-4 border-t border-white/5 text-center mt-6">
            <p className="text-[10px] text-slate-500 font-bold">
              Tip: Prepare with Resume Analyzer before mock sessions.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
