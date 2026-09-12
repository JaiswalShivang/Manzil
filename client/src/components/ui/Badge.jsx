import { BookOpen, Heart, Shield, Sparkles } from 'lucide-react';

export const CategoryBadge = ({ category, className = '' }) => {
  const meta = {
    intellect: {
      label: 'INTELLECT',
      icon: BookOpen,
      bg: 'bg-[#2B4AE8] text-[#F5F3EF] border-2 border-[#141414]',
    },
    vitality: {
      label: 'VITALITY',
      icon: Heart,
      bg: 'bg-[#E8402C] text-[#F5F3EF] border-2 border-[#141414]',
    },
    discipline: {
      label: 'DISCIPLINE',
      icon: Shield,
      bg: 'bg-[#141414] text-[#F5F3EF] border-2 border-[#141414]',
    },
    creativity: {
      label: 'CREATIVITY',
      icon: Sparkles,
      bg: 'bg-[#F2B705] text-[#141414] border-2 border-[#141414]',
    },
  };

  const current = meta[category] || meta.intellect;
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-heading font-extrabold uppercase tracking-wider ${current.bg} ${className}`}
    >
      <Icon className="w-3 h-3 stroke-[2.5]" />
      {current.label}
    </span>
  );
};
