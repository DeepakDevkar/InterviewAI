import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm focus:outline-none';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/20 border border-indigo-500/30',
    secondary: 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 backdrop-blur-md',
    danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30',
    ghost: 'bg-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200',
    glass: 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 text-indigo-300 border border-indigo-500/20 backdrop-blur-lg shadow-xl shadow-indigo-950/20'
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
