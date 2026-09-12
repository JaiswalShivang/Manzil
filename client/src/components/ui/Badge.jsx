import React from 'react';
import { BookOpen, Heart, Shield, Sparkles } from 'lucide-react';

export const CategoryBadge = ({ category, className = '' }) => {
  const meta = {
    intellect: {
      label: 'Intellect',
      icon: BookOpen,
      bg: 'bg-[#B9A6D9]/20 text-[#6B568E] border-[#B9A6D9]/50',
    },
    vitality: {
      label: 'Vitality',
      icon: Heart,
      bg: 'bg-[#9CAF88]/20 text-[#4D6339] border-[#9CAF88]/50',
    },
    discipline: {
      label: 'Discipline',
      icon: Shield,
      bg: 'bg-[#E3A08A]/20 text-[#8F4E38] border-[#E3A08A]/50',
    },
    creativity: {
      label: 'Creativity',
      icon: Sparkles,
      bg: 'bg-[#F4C572]/25 text-[#855D16] border-[#F4C572]/60',
    },
  };

  const current = meta[category] || meta.intellect;
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${current.bg} ${className}`}
    >
      <Icon className="w-3 h-3" />
      {current.label}
    </span>
  );
};
