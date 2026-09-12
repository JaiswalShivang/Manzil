import React, { useEffect } from 'react';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A2E27]/40 backdrop-blur-sm transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} bg-[#FAF3E8] border border-[#E4D3BE] rounded-3xl p-6 shadow-[0_20px_50px_rgba(58,46,39,0.25)] relative transform transition-all duration-300 scale-100`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between pb-3 border-b border-[#E4D3BE]">
          <div>
            {title && (
              <h3 className="text-xl font-bold text-[#3A2E27] tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-[#78665B] mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#78665B] hover:text-[#3A2E27] hover:bg-[#F0E4D3] rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};
