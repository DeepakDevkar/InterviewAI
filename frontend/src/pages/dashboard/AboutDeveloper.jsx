import React from 'react';
import { Mail, Globe, Linkedin, Github, Award, Code2, HeartHandshake, PhoneCall } from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';

export const AboutDeveloper = () => {
  const credentials = [
    { icon: Code2, title: 'Stack Expertise', desc: 'MongoDB, Express, React, Node.js, Socket.io, Gemini AI Studio' },
    { icon: Award, title: 'Professional Role', desc: 'Full Stack MERN Developer' },
    { icon: HeartHandshake, title: 'Client Dedication', desc: 'Crafting premium interactive SaaS dashboards and real-time alerts' }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">About the Developer</h1>
        <p className="text-xs text-slate-400 mt-1">Get to know the MERN Stack engineer behind InterviewAI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card */}
        <Card className="md:col-span-1 border-white/5 flex flex-col items-center text-center p-6 bg-slate-950/40">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold border-2 border-indigo-400/20 shadow-xl">
            DD
          </div>
          
          <h2 className="text-lg font-bold text-white mt-4">Deepak Devkar</h2>
          <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mt-1">MERN Stack Developer</p>
          
          <p className="text-xs text-slate-400 mt-4 leading-relaxed font-semibold">
            Passionate software engineer focused on building highly optimized web applications, interactive AI interfaces, and secure containerized stacks.
          </p>

          <div className="w-full border-t border-white/5 mt-6 pt-5 space-y-3">
            <a 
              href="https://deepakdevkar.netlify.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 py-2 w-full text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all duration-300 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-indigo-400" /> Visit Portfolio
            </a>
            <a 
              href="https://www.linkedin.com/in/deepakdevkar" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 py-2 w-full text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all duration-300 cursor-pointer"
            >
              <Linkedin className="w-4 h-4" /> Connection LinkedIn
            </a>
          </div>
        </Card>

        {/* Right Column: Details & Contact Section */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Stack credentials */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {credentials.map((cred, idx) => (
              <Card key={idx} className="border-white/5 p-4 flex flex-col justify-between">
                <cred.icon className="w-5 h-5 text-indigo-400" />
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-slate-200">{cred.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-1 font-semibold leading-relaxed">{cred.desc}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Contact Section */}
          <Card className="border-white/5">
            <h3 className="text-sm font-bold text-slate-200 mb-6 flex items-center gap-2">
              <PhoneCall className="w-4.5 h-4.5 text-indigo-400" /> Contact Developer
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs leading-relaxed">
              
              <div className="p-4 bg-slate-950/40 rounded-2xl border border-white/5 flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Email Inbox</span>
                  <a href="mailto:placeholder@example.com" className="text-slate-200 hover:underline font-semibold block mt-0.5">
                    placeholder@example.com
                  </a>
                </div>
              </div>

              <div className="p-4 bg-slate-950/40 rounded-2xl border border-white/5 flex items-center gap-3">
                <Github className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">GitHub Repository</span>
                  <a href="https://github.com/placeholder" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:underline font-semibold block mt-0.5">
                    github.com/placeholder
                  </a>
                </div>
              </div>

              <div className="p-4 bg-slate-950/40 rounded-2xl border border-white/5 flex items-center gap-3">
                <Linkedin className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">LinkedIn Profile</span>
                  <a href="https://www.linkedin.com/in/deepakdevkar" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:underline font-semibold block mt-0.5">
                    linkedin.com/in/deepakdevkar
                  </a>
                </div>
              </div>

              <div className="p-4 bg-slate-950/40 rounded-2xl border border-white/5 flex items-center gap-3">
                <Globe className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Portfolio Link</span>
                  <a href="https://deepakdevkar.netlify.app" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:underline font-semibold block mt-0.5">
                    deepakdevkar.netlify.app
                  </a>
                </div>
              </div>

            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default AboutDeveloper;
