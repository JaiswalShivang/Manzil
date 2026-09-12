import { Link } from 'react-router-dom';
import { Avatar } from './Avatar';
import { AvatarViewportSkeleton } from '../ui/Skeleton';
import {
  Sparkles,
  Zap,
  Shirt,
  Scissors,
  Footprints,
  Sword,
  ArrowRight,
  X,
} from 'lucide-react';
import { PantsIcon } from '../ui/PantsIcon';

const slotIcons = {
  hair: Scissors,
  chest: Shirt,
  pants: PantsIcon,
  shoes: Footprints,
  weapon: Sword,
  aura: Sparkles,
};

const slotColors = {
  hair: '#2B4AE8',
  chest: '#E8402C',
  pants: '#141414',
  shoes: '#555555',
  weapon: '#F2B705',
  aura: '#E8402C',
};

export const CharacterViewport = ({ user, onUnequip, isUnequipping = false, isLoading = false }) => {
  if (isLoading || !user) {
    return <AvatarViewportSkeleton />;
  }
  const equipped = user?.equipped || {};

  const slots = [
    { key: 'hair', label: 'HAIR' },
    { key: 'chest', label: 'SHIRT' },
    { key: 'pants', label: 'PANTS' },
    { key: 'shoes', label: 'SHOES' },
    { key: 'weapon', label: 'WEAPON' },
    { key: 'aura', label: 'AURA' },
  ];

  const equippedCount = slots.filter((s) => Boolean(equipped[s.key])).length;

  return (
    <div className="bg-white border-3 border-[#141414] shadow-brutal-lg p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Viewport Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#141414] pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-black text-[#141414] uppercase tracking-tight">
            ADVENTURER STATUS: {user?.username || 'ADVENTURER'}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="bg-[#FAF3E8] border-2 border-[#141414] px-3 py-1.5 text-xs font-heading font-black uppercase">
            GEAR MOUNTED: <span className="text-[#E8402C]">{equippedCount} / 6</span>
          </div>
          <Link
            to="/shop"
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 bg-[#E8402C] hover:bg-[#141414] text-[#F5F3EF] border-2 border-[#141414] font-heading font-black text-xs uppercase shadow-brutal-sm transition-none cursor-pointer"
          >
            <span>THE VAULT</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Grid: Avatar Viewport Stage + Equipment Slots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left Stage: Bold Bauhaus Bordered Viewport */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative border-4 border-[#141414] p-2 bg-[#141414] shadow-brutal">
            {/* Corner Graphic Accent Tabs */}
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#E8402C] border-2 border-[#141414] z-10" />
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#F2B705] border-2 border-[#141414] z-10" />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#2B4AE8] border-2 border-[#141414] z-10" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#141414] border-2 border-[#FAF3E8] z-10" />

            {/* High-Contrast Backdrop Block */}
            <div className="relative w-56 h-56 xs:w-64 xs:h-64 sm:w-72 sm:h-72 bg-[#2B4AE8] flex items-center justify-center border-2 border-[#141414] overflow-hidden">
              {/* Subtle Bauhaus Graphic Geometry Background */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 right-0 w-36 h-36 bg-[#F2B705] -rotate-12 transform translate-x-8 -translate-y-8" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#E8402C] rotate-45 transform -translate-x-8 translate-y-8" />
                <div className="absolute inset-x-0 bottom-6 h-12 bg-[#141414]/40" />
              </div>

              {/* Center Paperdoll Sprite */}
              <Avatar equipped={equipped} scale={4} className="z-10" />

              {/* Viewport Overlay Stamp */}
              <div className="absolute bottom-2 left-2 bg-[#141414] text-[#F5F3EF] px-2 py-0.5 text-[9px] font-mono font-black uppercase tracking-wider z-20 border border-white/20">
                ACTIVE RIG // 4-FRAME WALK
              </div>
            </div>
          </div>
        </div>

        {/* Right Stage: 6 Equipment Slot Indicators */}
        <div className="lg:col-span-7 space-y-3">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {slots.map(({ key, label }) => {
              const item = equipped[key];
              const Icon = slotIcons[key] || Zap;
              const accent = slotColors[key] || '#141414';

              return (
                <div
                  key={key}
                  className={`border-2 border-[#141414] p-3 flex items-center justify-between shadow-brutal-sm transition-none ${item ? 'bg-white' : 'bg-[#FAF3E8]/70 border-dashed'
                    }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className="w-10 h-10 border-2 border-[#141414] flex items-center justify-center text-white shrink-0 shadow-brutal-sm"
                      style={{ backgroundColor: item ? accent : '#A39B91' }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="overflow-hidden">
                      <div className="text-[9px] font-heading font-black uppercase text-[#141414]/60">
                        {label}
                      </div>
                      <div className="text-xs font-heading font-black text-[#141414] truncate uppercase">
                        {item?.name || 'BASE NONE'}
                      </div>
                    </div>
                  </div>

                  {Boolean(item) && onUnequip && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUnequip(key);
                      }}
                      disabled={isUnequipping}
                      title={`Unequip ${label}`}
                      aria-label={`Unequip ${label}: ${item?.name || 'equipped item'}`}
                      className="px-2.5 py-1 bg-[#FAF3E8] hover:bg-[#E8402C] hover:text-white text-[#141414] border-2 border-[#141414] font-mono text-[11px] font-black uppercase cursor-pointer transition-none shadow-brutal-sm flex items-center gap-1 shrink-0"
                    >
                      <X className="w-3.5 h-3.5 stroke-[3]" />
                      <span>REMOVE</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterViewport;
