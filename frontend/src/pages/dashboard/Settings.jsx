import React from 'react';
import { useForm } from 'react-hook-form';
import { Settings as SettingsIcon, Bell, Sparkles, Key, Eye, EyeOff } from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';

export const Settings = () => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      defaultModel: 'gemini-1.5-pro',
      speechCapture: true,
      emailReports: false
    }
  });

  const onSaveSettings = (data) => {
    alert('Settings successfully updated! (Mock API)');
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">System Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Configure diagnostic engines, default models, and user notifications preferences.</p>
      </div>

      <Card className="border-white/5">
        <form onSubmit={handleSubmit(onSaveSettings)} className="space-y-6">
          {/* AI Settings Group */}
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
              <Sparkles className="w-4.5 h-4.5 text-indigo-400" /> Evaluation Configuration
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 ml-1 block mb-1.5">
                  Default AI Evaluator Model
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-slate-300 text-xs outline-none focus:border-indigo-500"
                  {...register('defaultModel')}
                >
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Analytical)</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Instantaneous)</option>
                  <option value="gpt-4o">GPT-4o (Standard Technical)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 ml-1 block mb-1.5">
                  Speech Evaluation Engine
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-slate-300 text-xs outline-none focus:border-indigo-500"
                  {...register('speechEngine')}
                >
                  <option value="whisper-1">OpenAI Whisper v1</option>
                  <option value="native-browser">Native Browser API (Low latency)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Integration Keys */}
          <div className="pt-2">
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
              <Key className="w-4.5 h-4.5 text-indigo-400" /> Developer Integrations
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-300 ml-1 block mb-1.5">
                Personal API Key
              </label>
              <div className="flex gap-3">
                <input
                  type="password"
                  value="sk_interviewai_test_key_abc123xyz789"
                  disabled
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-slate-500 text-xs font-mono select-all outline-none"
                />
                <Button variant="secondary" onClick={() => alert('API Key copied to clipboard!')}>
                  Copy Key
                </Button>
              </div>
            </div>
          </div>

          {/* Notification toggles */}
          <div className="pt-2">
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
              <Bell className="w-4.5 h-4.5 text-indigo-400" /> Alert Subscriptions
            </h3>

            <div className="space-y-3.5">
              <label className="flex items-center gap-3.5 text-xs font-semibold cursor-pointer text-slate-300 hover:text-slate-200">
                <input
                  type="checkbox"
                  className="rounded bg-slate-900 border-white/10 text-indigo-600 focus:ring-0"
                  {...register('speechCapture')}
                />
                Enable local microphone input validation alerts before mocks
              </label>

              <label className="flex items-center gap-3.5 text-xs font-semibold cursor-pointer text-slate-300 hover:text-slate-200">
                <input
                  type="checkbox"
                  className="rounded bg-slate-900 border-white/10 text-indigo-600 focus:ring-0"
                  {...register('emailReports')}
                />
                Receive automatic PDF feedback metrics via email on completion
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/5">
            <Button type="submit" variant="primary" className="px-6 py-2.5">
              Apply Configurations
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Settings;
