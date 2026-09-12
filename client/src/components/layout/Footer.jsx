import React from 'react';

export const Footer = () => {
  return (
    <footer className="w-full py-8 border-t border-[#E4D3BE]/60 text-center text-xs text-[#78665B] mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span>🌿</span>
          <span className="font-medium text-[#3A2E27]">Life RPG</span>
          <span>— Cozy Lo-Fi Study Room Edition</span>
        </div>
        <p className="font-handwritten text-sm text-[#78665B]">
          "Every small quest completed turns your space into a sanctuary." ✨
        </p>
        <div>
          <span>Crafted with warm tea & lo-fi beats</span>
        </div>
      </div>
    </footer>
  );
};
