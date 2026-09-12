import React from 'react';

export const Card = ({
  children,
  className = '',
  variant = 'default',
  ...props
}) => {
  const variants = {
    default:
      'bg-[#F0E4D3] border border-[#E4D3BE]/80 rounded-2xl p-5 shadow-[0_4px_16px_rgba(58,46,39,0.07)]',
    sticky:
      'bg-[#FFF9E6] border border-[#EFE2B8] rounded-xl p-5 shadow-[0_6px_18px_rgba(58,46,39,0.08)] relative',
    panel:
      'bg-[#FAF3E8] border border-[#E4D3BE] rounded-3xl p-6 shadow-sm',
    accent:
      'bg-gradient-to-br from-[#F0E4D3] to-[#E8D9C5] border border-[#E3A08A]/30 rounded-2xl p-5 shadow-[0_6px_20px_rgba(58,46,39,0.09)]',
  };

  return (
    <div
      className={`${variants[variant] || variants.default} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
