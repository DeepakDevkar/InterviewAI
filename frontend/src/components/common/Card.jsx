import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({
  children,
  className = '',
  hoverEffect = true,
  onClick,
  ...props
}) => {
  const isClickable = !!onClick;

  return (
    <motion.div
      whileHover={hoverEffect || isClickable ? { y: -4, boxShadow: '0 20px 25px -5px rgba(99, 102, 241, 0.1), 0 8px 10px -6px rgba(99, 102, 241, 0.1)' } : {}}
      onClick={onClick}
      className={`
        bg-slate-900/40 backdrop-blur-xl border border-white/5 
        rounded-2xl p-6 shadow-2xl relative overflow-hidden
        ${isClickable ? 'cursor-pointer' : ''} 
        ${className}
      `}
      {...props}
    >
      {/* Decorative gradient orb inside card background */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Content wrapper */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default Card;
