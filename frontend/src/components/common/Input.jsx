import React from 'react';

export const Input = React.forwardRef(({
  label,
  type = 'text',
  placeholder,
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-slate-300 ml-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 
          text-slate-100 placeholder-slate-500 text-sm outline-none transition-all duration-300
          focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 backdrop-blur-md
          ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-400 mt-1 ml-1">{error}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
