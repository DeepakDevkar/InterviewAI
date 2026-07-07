import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  BrainCircuit, 
  Terminal, 
  CheckCircle2, 
  ChevronRight, 
  FileCheck,
  Star,
  Users,
  Trophy
} from 'lucide-react';
import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';

export const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staleChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const features = [
    {
      title: 'AI Resume Analyzer',
      description: 'Upload your CV and get instant optimization metrics, keyword suggestions, and custom interview questions mapped directly to your skills.',
      icon: FileCheck,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Dynamic Interview Generator',
      description: 'Choose any job title, seniority level, and core technologies to generate a tailored sequence of coding and behavioral questions.',
      icon: BrainCircuit,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      title: 'Real-time Mock Environments',
      description: 'Engage in a live simulated audio/video interview setting complete with custom response timers, transcripts, and AI scoring.',
      icon: Users,
      color: 'from-indigo-500 to-blue-500'
    },
    {
      title: 'Interactive Coding Practice',
      description: 'Test your algorithmic execution inside our integrated web editor with sandbox output verification panels.',
      icon: Terminal,
      color: 'from-cyan-500 to-purple-500'
    }
  ];

  const pricingPlans = [
    {
      name: 'Free Trial',
      price: '$0',
      description: 'Get started and test your skills with basic mock modules.',
      features: [
        '3 Resume Analyzes per month',
        '2 Generated Interview Sessions',
        'Standard text-based mock rooms',
        'Basic technical dashboards'
      ],
      cta: 'Start Free',
      popular: false
    },
    {
      name: 'Professional',
      price: '$29',
      period: '/mo',
      description: 'Everything you need to successfully ace your upcoming tech interviews.',
      features: [
        'Unlimited Resume Analyzes',
        'Unlimited Mock Interview Rooms',
        'Real-time Audio & Video simulations',
        'Complete coding playground sandbox',
        'Priority AI model feedback speeds'
      ],
      cta: 'Upgrade to Pro',
      popular: true
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-slate-950/40 border-b border-white/5 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BrainCircuit className="w-7 h-7 text-indigo-400" />
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              InterviewAI
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-slate-200 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-slate-200 transition-colors">Pricing</a>
            <a href="#about" className="hover:text-slate-200 transition-colors">About</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-36 pb-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Tag */}
          <div className="mb-6 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase">
            🚀 The Complete AI Interview Suite
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none mb-8">
            Ace Your Tech Interviews With{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Real-time AI
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-slate-400 mb-10 max-w-2xl leading-relaxed">
            Generate tailored mock interviews, optimize your CV, test algorithmic codes, and receive advanced diagnostic metrics to land your dream tech role.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link to="/signup">
              <Button variant="primary" className="text-base px-8 py-3.5">
                Practice Free Now <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="secondary" className="text-base px-8 py-3.5">
                Explore Features
              </Button>
            </a>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-white/5 bg-slate-900/20 backdrop-blur-sm py-16 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div className="flex flex-col items-center">
              <Users className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="text-3xl font-extrabold">120K+</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">Active Job Seekers</p>
            </div>
            <div className="flex flex-col items-center">
              <Trophy className="w-8 h-8 text-indigo-400 mb-3" />
              <h3 className="text-3xl font-extrabold">95.8%</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">Offer Placement Rate</p>
            </div>
            <div className="flex flex-col items-center">
              <Star className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="text-3xl font-extrabold">4.9 / 5</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">User Satisfaction Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-6 py-28 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything You Need to Prepare</h2>
          <p className="text-sm sm:text-base text-slate-400">
            Ditch generic preparation. Train in hyper-realistic interview modules driven by next-generation models.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {features.map((feature, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="h-full group hover:border-indigo-500/30 transition-all duration-300">
                <div className="flex gap-4 items-start">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-md`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-indigo-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-6 py-24 border-t border-white/5 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-sm sm:text-base text-slate-400">
            Accelerate your job hunt. Choose the plan that works best for your schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingPlans.map((plan, i) => (
            <Card 
              key={i} 
              className={`flex flex-col justify-between h-full relative ${
                plan.popular ? 'border-indigo-500/40 ring-1 ring-indigo-500/20' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-4 right-4 bg-indigo-500 text-white text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-md">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-slate-200">{plan.name}</h3>
                <div className="flex items-baseline mt-4 mb-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white">{plan.price}</span>
                  {plan.period && <span className="text-slate-400 text-sm ml-1">{plan.period}</span>}
                </div>
                <p className="text-xs text-slate-500 font-medium mb-6">{plan.description}</p>
                
                <ul className="space-y-3.5 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Link to="/signup" className="w-full">
                <Button 
                  variant={plan.popular ? 'primary' : 'secondary'} 
                  className="w-full py-3"
                >
                  {plan.cta}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-950 py-12 relative z-10 text-center text-sm text-slate-500">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-slate-300">InterviewAI</span>
          </div>
          <div className="text-center md:text-left">
            <p className="text-xs text-slate-400">Developed by <span className="text-indigo-400 font-bold">Deepak Devkar</span></p>
            <p className="text-[10px] text-slate-500 mt-1">&copy; 2026 Deepak Devkar. All Rights Reserved.</p>
          </div>
          <div className="flex gap-6 text-xs font-semibold text-slate-400">
            <a href="https://github.com/placeholder" target="_blank" rel="noopener noreferrer" className="hover:text-slate-200">GitHub</a>
            <a href="https://www.linkedin.com/in/deepakdevkar" target="_blank" rel="noopener noreferrer" className="hover:text-slate-200">LinkedIn</a>
            <a href="https://deepakdevkar.netlify.app" target="_blank" rel="noopener noreferrer" className="hover:text-slate-200">Portfolio</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
