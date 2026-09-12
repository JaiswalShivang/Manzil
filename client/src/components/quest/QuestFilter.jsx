import React from 'react';
import { BookOpen, Heart, Shield, Sparkles, CheckCircle2, Clock } from 'lucide-react';

export const QuestFilter = ({
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  totalPending = 0,
  totalCompleted = 0,
}) => {
  const categories = [
    { id: '', label: 'All Skills' },
    { id: 'intellect', label: 'Intellect', icon: BookOpen },
    { id: 'vitality', label: 'Vitality', icon: Heart },
    { id: 'discipline', label: 'Discipline', icon: Shield },
    { id: 'creativity', label: 'Creativity', icon: Sparkles },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F0E4D3] p-3 rounded-2xl border border-[#E4D3BE]">
      {/* Status Segmented Buttons */}
      <div className="flex items-center gap-1 bg-[#FAF3E8] p-1 rounded-xl border border-[#E4D3BE]">
        <button
          onClick={() => setStatusFilter('')}
          className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            statusFilter === ''
              ? 'bg-[#E3A08A] text-[#3A2E27] shadow-sm'
              : 'text-[#78665B] hover:text-[#3A2E27]'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            statusFilter === 'pending'
              ? 'bg-[#E3A08A] text-[#3A2E27] shadow-sm'
              : 'text-[#78665B] hover:text-[#3A2E27]'
          }`}
        >
          <Clock className="w-3 h-3" />
          <span>Active ({totalPending})</span>
        </button>
        <button
          onClick={() => setStatusFilter('completed')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            statusFilter === 'completed'
              ? 'bg-[#E3A08A] text-[#3A2E27] shadow-sm'
              : 'text-[#78665B] hover:text-[#3A2E27]'
          }`}
        >
          <CheckCircle2 className="w-3 h-3" />
          <span>Done ({totalCompleted})</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
        {categories.map((cat) => {
          const isSelected = categoryFilter === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#3A2E27] text-[#FAF3E8] shadow-sm font-semibold'
                  : 'text-[#78665B] hover:text-[#3A2E27] hover:bg-[#FAF3E8]'
              }`}
            >
              {Icon && <Icon className="w-3 h-3" />}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
