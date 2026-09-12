import { useId } from 'react';

export const Input = ({
  label,
  error,
  type = 'text',
  className = '',
  id,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || props.name || generatedId;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-heading font-extrabold uppercase tracking-wider text-[#141414]"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={`w-full px-4 py-2.5 bg-[#F5F3EF] text-[#141414] placeholder-[#141414]/40 border-2 border-[#141414] focus:bg-white focus:outline-none focus:ring-0 focus:shadow-brutal-sm text-sm font-sans ${error ? 'border-[#E8402C] bg-red-50' : ''
          } ${className}`}
        {...props}
      />
      {error && <span className="text-xs font-bold text-[#E8402C] uppercase mt-0.5">{error}</span>}
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
  const generatedId = useId();
  const inputId = id || props.name || generatedId;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-heading font-extrabold uppercase tracking-wider text-[#141414]"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={`w-full px-4 py-2.5 bg-[#F5F3EF] text-[#141414] placeholder-[#141414]/40 border-2 border-[#141414] focus:bg-white focus:outline-none focus:ring-0 focus:shadow-brutal-sm text-sm font-sans resize-none ${error ? 'border-[#E8402C] bg-red-50' : ''
          } ${className}`}
        {...props}
      />
      {error && <span className="text-xs font-bold text-[#E8402C] uppercase mt-0.5">{error}</span>}
    </div>
  );
};
