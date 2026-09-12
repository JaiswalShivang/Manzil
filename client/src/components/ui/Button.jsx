import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[#E3A08A] active:scale-[0.98] shadow-sm';

  const variants = {
    primary:
      'bg-[#E3A08A] hover:bg-[#D9907A] text-[#3A2E27] shadow-[0_4px_12px_rgba(227,160,138,0.25)] font-semibold',
    secondary:
      'bg-[#F0E4D3] hover:bg-[#E5D5C2] text-[#3A2E27] border border-[#E4D3BE]',
    sage:
      'bg-[#9CAF88] hover:bg-[#8A9E76] text-white shadow-[0_4px_12px_rgba(156,175,136,0.3)] font-semibold',
    lavender:
      'bg-[#B9A6D9] hover:bg-[#A995CB] text-[#3A2E27] shadow-[0_4px_12px_rgba(185,166,217,0.3)] font-semibold',
    amber:
      'bg-[#F4C572] hover:bg-[#EAB85A] text-[#3A2E27] shadow-[0_4px_12px_rgba(244,197,114,0.3)] font-semibold',
    ghost:
      'bg-transparent hover:bg-[#F0E4D3]/60 text-[#3A2E27] shadow-none',
    danger:
      'bg-red-100 hover:bg-red-200 text-red-800 border border-red-200',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
    icon: 'p-2 rounded-xl',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
