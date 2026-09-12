import React from 'react';

export const Input = ({
  label,
  error,
  type = 'text',
  className = '',
  id,
  ...props
}) => {
  const inputId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wider text-[#78665B]"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={`w-full px-4 py-2.5 bg-[#FAF3E8] text-[#3A2E27] placeholder-[#78665B]/60 rounded-xl border border-[#E4D3BE] focus:border-[#E3A08A] focus:ring-2 focus:ring-[#E3A08A]/30 transition-colors duration-200 outline-none text-sm ${
          error ? 'border-red-400 focus:ring-red-200' : ''
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-600 mt-0.5">{error}</span>}
    </div>
  );
};

export const Textarea = ({
  label,
  error,
  className = '',
  id,
  rows = 3,
  ...props
}) => {
  const inputId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wider text-[#78665B]"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={`w-full px-4 py-2.5 bg-[#FAF3E8] text-[#3A2E27] placeholder-[#78665B]/60 rounded-xl border border-[#E4D3BE] focus:border-[#E3A08A] focus:ring-2 focus:ring-[#E3A08A]/30 transition-colors duration-200 outline-none text-sm resize-none ${
          error ? 'border-red-400 focus:ring-red-200' : ''
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-600 mt-0.5">{error}</span>}
    </div>
  );
};
