export const Card = ({
  children,
  className = '',
  variant = 'default',
  ...props
}) => {
  const variants = {
    default:
      'bg-[#F5F3EF] border-2 border-[#141414] p-5 shadow-brutal',
    panel:
      'bg-[#F5F3EF] border-2 border-[#141414] p-6 shadow-brutal-lg',
    red:
      'bg-[#E8402C] text-[#F5F3EF] border-2 border-[#141414] p-5 shadow-brutal',
    blue:
      'bg-[#2B4AE8] text-[#F5F3EF] border-2 border-[#141414] p-5 shadow-brutal',
    yellow:
      'bg-[#F2B705] text-[#141414] border-2 border-[#141414] p-5 shadow-brutal',
    white:
      'bg-white border-2 border-[#141414] p-5 shadow-brutal',
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
