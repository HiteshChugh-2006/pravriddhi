import React from 'react';
import { ArrowRight, UserCheck, Briefcase, Compass, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface WelcomeStepProps {
  onNext: () => void;
  authUser?: { displayName?: string | null; email?: string | null } | null;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext, authUser }) => {
  const name = authUser?.displayName ? authUser.displayName : '';
  const titleText = name ? `Welcome, ${name}!` : 'Welcome!';

  const steps = [
    {
      icon: <UserCheck className="w-5 h-5 text-indigo-600" />,
      title: 'You',
      desc: 'Your background, region & work style',
      bg: 'bg-indigo-50'
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-violet-600" />,
      title: 'Skills',
      desc: 'Evidence from projects & resume',
      bg: 'bg-violet-50'
    },
    {
      icon: <Compass className="w-5 h-5 text-emerald-600" />,
      title: 'Career',
      desc: 'Target roles & best-fit directions',
      bg: 'bg-emerald-50'
    },
    {
      icon: <Briefcase className="w-5 h-5 text-blue-600" />,
      title: 'Opportunities',
      desc: 'Matched jobs & bridge roadmap',
      bg: 'bg-blue-50'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 flex flex-col items-center text-center space-y-10 animate-in fade-in duration-300">
      
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          {titleText}
        </h1>

        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800">
          Let's build your <span className="text-indigo-600">career story.</span>
        </h2>

        <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed mt-4">
          You have your account. Now let's understand your experience, skills and career goals so we can give you genuinely personalized insights.
        </p>
      </div>

      {/* Clean Timeline/Steps Visualization */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="w-full max-w-2xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-10 relative overflow-hidden"
      >
        {/* Decorative subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-indigo-50/20 pointer-events-none" />

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative z-10">
          
          {/* Connecting line on desktop */}
          <div className="hidden sm:block absolute top-10 left-12 right-12 h-0.5 bg-slate-100 z-0" />

          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -2 }}
              className="relative z-10 flex flex-col items-center text-center bg-white sm:bg-transparent rounded-2xl p-4 sm:p-0 border sm:border-none border-slate-100 shadow-sm sm:shadow-none"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${step.bg} shadow-sm border border-white`}>
                {step.icon}
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Step {idx + 1}</span>
              <h4 className="text-sm font-bold text-slate-800">{step.title}</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed px-2">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Primary Call to Action Button */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="w-full max-w-sm pt-4"
      >
        <button
          onClick={onNext}
          className="w-full py-4 px-8 rounded-full bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-base shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span>Let's Begin</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>

    </div>
  );
};
