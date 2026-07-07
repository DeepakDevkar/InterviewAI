import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Settings, Brain, Sparkles, Loader2, Info } from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import api from '../../services/api.js';

export const InterviewGenerator = () => {
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      questionsCount: 5,
      difficulty: 'medium',
      type: 'technical'
    }
  });

  // Fetch candidate resumes list for selection
  useEffect(() => {
    const fetchResumes = async () => {
      setLoadingResumes(true);
      try {
        // In a full implementation, we fetch resumes. For now, try to load if DB matches
        const res = await api.get('/users/profile'); // Just to see if API works
        // Try fetching a mock resume list or handle fallback
        setResumes([]); 
      } catch (err) {
        console.warn('Failed to fetch resumes:', err);
      } finally {
        setLoadingResumes(false);
      }
    };
    fetchResumes();
  }, []);

  const onSubmit = async (data) => {
    setGenerating(true);
    try {
      const payload = {
        title: data.title || `${data.role} Preparation`,
        roleType: data.role,
        difficulty: data.difficulty,
        company: data.company || '',
        technology: data.technology || '',
        questionsCount: data.questionsCount,
        resumeId: data.resumeId || undefined
      };

      const res = await api.post('/interviews', payload);
      const generatedInterview = res.data.data.interview;

      // Redirect into Mock Room passing active interview
      navigate('/dashboard/mock', { 
        state: { 
          interview: generatedInterview 
        } 
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate interview. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Interview Generator</h1>
        <p className="text-xs text-slate-400 mt-1">Configure parameters to spin up a tailored mock interview environment powered by Gemini AI.</p>
      </div>

      <Card className="border-white/5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">Session Parameters</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Customize your simulation criteria</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Session Title"
              type="text"
              placeholder="e.g. Google Front End Mock Prep"
              error={errors.title?.message}
              {...register('title', { required: 'Session title is required' })}
            />

            <Input
              label="Target Job Position"
              type="text"
              placeholder="e.g. Senior Frontend Developer"
              error={errors.role?.message}
              {...register('role', { required: 'Job position is required' })}
            />

            <Input
              label="Target Company (Optional)"
              type="text"
              placeholder="e.g. Google, Stripe, Meta"
              error={errors.company?.message}
              {...register('company')}
            />

            <Input
              label="Core Technologies / Keywords"
              type="text"
              placeholder="e.g. React, Typescript, AWS"
              error={errors.technology?.message}
              {...register('technology')}
            />

            <div>
              <label className="text-sm font-medium text-slate-300 ml-1 block mb-1.5">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['easy', 'medium', 'hard'].map((level) => (
                  <label 
                    key={level} 
                    className="flex items-center justify-center p-3 rounded-xl border border-white/10 bg-slate-950/20 text-xs font-semibold text-slate-400 capitalize cursor-pointer hover:border-indigo-500/50 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-500/10 has-[:checked]:text-indigo-300 transition-all"
                  >
                    <input
                      type="radio"
                      value={level}
                      className="sr-only"
                      {...register('difficulty')}
                    />
                    {level}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 ml-1 block mb-1.5">
                Number of Questions
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-slate-300 text-sm outline-none transition-all duration-300 focus:border-indigo-500"
                {...register('questionsCount')}
              >
                <option value="3">3 Questions (Speed Run)</option>
                <option value="5">5 Questions (Standard)</option>
                <option value="10">10 Questions (Complete Test)</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10 flex gap-3 text-xs text-blue-300 leading-relaxed">
            <Info className="w-5 h-5 text-blue-400 shrink-0" />
            <p>
              Once generated, your session initiates in the active mock interview workspace. Gemini will create theoretical, behavioral, coding, MCQ, and scenario questions.
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={generating} 
            variant="primary" 
            className="w-full py-3.5"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Compiling AI Questions...
              </>
            ) : (
              <>
                Initialize Mock Interview <Sparkles className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default InterviewGenerator;
