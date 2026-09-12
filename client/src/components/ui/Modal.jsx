import { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141414]/70 backdrop-none transition-opacity duration-150"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} bg-[#F5F3EF] border-3 border-[#141414] p-6 shadow-brutal-lg relative transform scale-100`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between pb-3 border-b-2 border-[#141414]">
          <div>
            {title && (
              <h3 className="text-xl font-heading font-extrabold uppercase text-[#141414] tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-[#141414]/70 font-sans mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#141414] hover:bg-[#E8402C] hover:text-[#F5F3EF] border-2 border-[#141414] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
};
