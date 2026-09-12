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
    'inline-flex items-center justify-center font-heading font-bold uppercase tracking-wider transition-all duration-75 active:duration-0 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border-2 border-[#141414] select-none text-center';

  const variants = {
    primary:
      'bg-[#E8402C] hover:bg-[#D43420] text-[#F5F3EF] shadow-brutal hover:shadow-brutal-sm',
    secondary:
      'bg-[#F5F3EF] hover:bg-[#EBE7DF] text-[#141414] shadow-brutal hover:shadow-brutal-sm',
    blue:
      'bg-[#2B4AE8] hover:bg-[#1E39D0] text-[#F5F3EF] shadow-brutal hover:shadow-brutal-sm',
    yellow:
      'bg-[#F2B705] hover:bg-[#DDA500] text-[#141414] shadow-brutal hover:shadow-brutal-sm',
    ink:
      'bg-[#141414] hover:bg-[#2A2A2A] text-[#F5F3EF] shadow-brutal-red',
    outline:
      'bg-transparent hover:bg-[#141414] hover:text-[#F5F3EF] text-[#141414]',
    ghost:
      'border-transparent shadow-none hover:bg-[#141414]/10 text-[#141414]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
    icon: 'p-2',
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
