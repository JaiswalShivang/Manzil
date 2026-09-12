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
    { id: '', label: 'ALL VECTORS' },
    { id: 'intellect', label: 'INTELLECT', icon: BookOpen },
    { id: 'vitality', label: 'VITALITY', icon: Heart },
    { id: 'discipline', label: 'DISCIPLINE', icon: Shield },
    { id: 'creativity', label: 'CREATIVITY', icon: Sparkles },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 border-2 border-[#141414] shadow-brutal-sm">
      {/* Status Segmented Buttons */}
      <div className="flex items-center gap-0 border-2 border-[#141414] bg-[#F5F3EF]">
        <button
          onClick={() => setStatusFilter('')}
          className={`px-3 py-1 text-xs font-heading font-black uppercase transition-all cursor-pointer border-r-2 border-[#141414] ${
            statusFilter === ''
              ? 'bg-[#141414] text-[#F5F3EF]'
              : 'text-[#141414] hover:bg-[#E8402C] hover:text-[#F5F3EF]'
          }`}
        >
          ALL
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`flex items-center gap-1 px-3 py-1 text-xs font-heading font-black uppercase transition-all cursor-pointer border-r-2 border-[#141414] ${
            statusFilter === 'pending'
              ? 'bg-[#141414] text-[#F5F3EF]'
              : 'text-[#141414] hover:bg-[#E8402C] hover:text-[#F5F3EF]'
          }`}
        >
          <Clock className="w-3 h-3" />
          <span>ACTIVE ({totalPending})</span>
        </button>
        <button
          onClick={() => setStatusFilter('completed')}
          className={`flex items-center gap-1 px-3 py-1 text-xs font-heading font-black uppercase transition-all cursor-pointer ${
            statusFilter === 'completed'
              ? 'bg-[#141414] text-[#F5F3EF]'
              : 'text-[#141414] hover:bg-[#E8402C] hover:text-[#F5F3EF]'
          }`}
        >
          <CheckCircle2 className="w-3 h-3" />
          <span>RESOLVED ({totalCompleted})</span>
        </button>
      </div>

      {/* Category Buttons */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
        {categories.map((cat) => {
          const isSelected = categoryFilter === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-heading font-black uppercase whitespace-nowrap border-2 border-[#141414] transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#141414] text-[#F5F3EF] shadow-brutal-sm'
                  : 'bg-white hover:bg-[#EBE7DF] text-[#141414]'
              }`}
            >
              {Icon && <Icon className="w-3 h-3 stroke-[2.5]" />}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
