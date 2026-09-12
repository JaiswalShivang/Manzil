import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/avatar/Avatar';
import { Skeleton, ProfileSkillBarSkeleton, ProfileInventorySkeleton } from '../components/ui/Skeleton';
import {
  BookOpen,
  Heart,
  Shield,
  Sparkles,
  Flame,
  Coins,
  LogOut,
} from 'lucide-react';

const formatRelativeTime = (date) => {
  if (!date || isNaN(date.getTime())) return 'RECORDED';
  const now = new Date();
  const diffInSeconds = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));
  if (diffInSeconds < 60) return 'JUST NOW';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const ProfilePage = () => {
  const { user, isLoading, logout } = useAuth();

  // Fetch completed quests for Activity Ledger
  const { data: completedQuestsData, isLoading: isQuestsLoading } = useQuery({
    queryKey: ['quests', 'completed'],
    queryFn: async () => {
      const res = await api.get('/quests?status=completed');
      return res.data;
    },
  });

  const skills = [
    {
      id: 'intellect',
      name: 'INTELLECT',
      code: '01',
      score: user?.skills?.intellect || 0,
      icon: BookOpen,
      accentColor: 'bg-[#2B4AE8]',
      textColor: 'text-[#2B4AE8]',
      borderColor: 'border-[#2B4AE8]',
      desc: 'Engineering, algorithmic logic, reading, and deep cognitive focus.',
    },
    {
      id: 'vitality',
      name: 'VITALITY',
      code: '02',
      score: user?.skills?.vitality || 0,
      icon: Heart,
      accentColor: 'bg-[#E8402C]',
      textColor: 'text-[#E8402C]',
      borderColor: 'border-[#E8402C]',
      desc: 'Physical endurance, conditioning, nutrition, sleep cycles.',
    },
    {
      id: 'discipline',
      name: 'DISCIPLINE',
      code: '03',
      score: user?.skills?.discipline || 0,
      icon: Shield,
      accentColor: 'bg-[#141414]',
      textColor: 'text-[#141414]',
      borderColor: 'border-[#141414]',
      desc: 'Routine execution, zero-drift habits, strict protocol compliance.',
    },
    {
      id: 'creativity',
      name: 'CREATIVITY',
      code: '04',
      score: user?.skills?.creativity || 0,
      icon: Sparkles,
      accentColor: 'bg-[#F2B705]',
      textColor: 'text-[#141414]',
      borderColor: 'border-[#F2B705]',
      desc: 'System architecture, design innovation, creative writing, ideation.',
    },
  ];

  const inventory = user?.inventory || [];
  const completedQuests = completedQuestsData?.quests || [];

  const completedQuestsList = completedQuests.map((q) => ({
    id: `quest-${q._id}`,
    type: 'quest',
    title: q.title,
    category: q.category,
    timestamp: new Date(q.completedAt || q.updatedAt || q.createdAt),
    reward: `+${q.xpReward} XP / +${q.coinReward} G`,
    cost: null,
  }));

  const inventoryPurchasesList = inventory
    .map((inv) => {
      const item = inv?.itemId || inv;
      if (!item || !item.name) return null;
      return {
        id: `purchase-${item._id}-${inv?.purchasedAt || inv?.acquiredAt || 'init'}`,
        type: 'purchase',
        title: item.name,
        category: item.itemType === 'crystal' ? 'aura' : item.itemType || 'gear',
        timestamp: new Date(inv?.purchasedAt || inv?.acquiredAt || user?.createdAt || 0),
        reward: null,
        cost: `-${item.goldCost || item.cost || 0} G`,
      };
    })
    .filter(Boolean);

  const mergedLedger = [...completedQuestsList, ...inventoryPurchasesList]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 30);

  // Generate streak calendar matrix (last 28 days)
  const streakDays = Array.from({ length: 28 }, (_, i) => {
    const currentStreak = user?.streak?.count || 0;
    // Highlight the most recent consecutive days
    const isCompleted = i >= 28 - currentStreak;
    const isToday = i === 27;
    return { day: i + 1, isCompleted, isToday };
  });

  if (isLoading || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="bg-[#FAF3E8] border-3 border-[#141414] p-6 sm:p-8 shadow-brutal flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-6">
            <div className="w-24 h-24 bg-[#2B4AE8] border-3 border-[#141414] shimmer-bauhaus shrink-0" />
            <div className="space-y-2">
              <Skeleton width="w-28" height="h-4" />
              <Skeleton width="w-48" height="h-8" />
              <div className="flex gap-3 pt-2">
                <Skeleton width="w-32" height="h-6" />
                <Skeleton width="w-28" height="h-6" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-4 border-b-3 border-[#141414] pb-2">
            <div>
              <Skeleton width="w-24" height="h-3" className="mb-1" />
              <Skeleton width="w-48" height="h-6" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProfileSkillBarSkeleton />
            <ProfileSkillBarSkeleton />
            <ProfileSkillBarSkeleton />
            <ProfileSkillBarSkeleton />
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-4 border-b-3 border-[#141414] pb-2">
            <div>
              <Skeleton width="w-24" height="h-3" className="mb-1" />
              <Skeleton width="w-48" height="h-6" />
            </div>
          </div>
          <ProfileInventorySkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Profile Dossier Banner */}
      <div className="bg-[#FAF3E8] border-3 border-[#141414] p-4 sm:p-6 lg:p-8 shadow-brutal flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left w-full sm:w-auto">
          <div className="w-24 h-24 bg-[#2B4AE8] border-3 border-[#141414] flex items-center justify-center relative overflow-hidden shadow-brutal-sm shrink-0">
            <Avatar equipped={user?.equipped} scale={2} />
          </div>

          <div>
            <div className="inline-block bg-[#E8402C] text-white text-[10px] font-mono font-black px-2 py-0.5 mb-1.5 uppercase">
              // ACTIVE OPERATIVE RIG
            </div>
            <div className="flex flex-wrap items-baseline justify-center sm:justify-start gap-3">
              <h1 className="text-3xl sm:text-4xl font-black text-[#141414] font-space uppercase tracking-tight">
                {user?.username || 'AGENT-01'}
              </h1>
              <span className="text-xs font-mono font-bold text-[#141414]/60">
                [LV.{user?.level || 1} • {user?.email}]
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-xs font-mono font-bold text-[#141414] mt-3 pt-3 border-t border-[#141414]/20">
              <span className="flex items-center gap-1.5 bg-[#F5F3EF] px-2.5 py-1 border border-[#141414]">
                <Flame className="w-4 h-4 text-[#E8402C]" />
                STREAK: {user?.streak?.count || 0} DAYS
              </span>
              <span className="flex items-center gap-1.5 bg-[#F2B705] px-2.5 py-1 border border-[#141414] text-[#141414]">
                <Coins className="w-4 h-4" />
                BALANCE: {user?.cozyCoins || 0} GOLD
              </span>
            </div>
          </div>
        </div>

        <Button
          onClick={logout}
          variant="outline"
          size="md"
          className="w-full md:w-auto justify-center uppercase font-mono text-xs font-bold"
        >
          <LogOut className="w-4 h-4 mr-2" /> TERMINATE SESSION
        </Button>
      </div>

      {/* 4 RPG Skill Vectors */}
      <div>
        <div className="flex items-baseline justify-between mb-4 border-b-3 border-[#141414] pb-2">
          <div>
            <span className="text-xs font-mono font-bold text-[#E8402C] block">// VECTOR CAPACITIES</span>
            <h2 className="text-2xl font-black font-space text-[#141414] uppercase">
              CORE RPG ATTRIBUTES
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-[#141414]/60">
            TOTAL SCORE: {(user?.skills?.intellect || 0) + (user?.skills?.vitality || 0) + (user?.skills?.discipline || 0) + (user?.skills?.creativity || 0)} PTS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill) => {
            const Icon = skill.icon;
            const progress = Math.min(100, Math.max(8, (skill.score / 150) * 100));

            return (
              <div
                key={skill.id}
                className="bg-[#FAF3E8] border-3 border-[#141414] p-5 shadow-brutal flex flex-col justify-between relative"
              >
                {/* Colored Corner Tag Block */}
                <div className={`absolute top-0 right-0 w-6 h-6 ${skill.accentColor} border-l-2 border-b-2 border-[#141414]`} />

                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-[#141414]/50">{skill.code} //</span>
                    <span className="text-3xl font-black font-space text-[#141414] pr-4">
                      {skill.score}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-[#141414]" />
                    <h3 className="font-black text-sm font-space text-[#141414] uppercase tracking-wide">
                      {skill.name}
                    </h3>
                  </div>

                  <p className="text-xs font-mono text-[#141414]/70 mb-6 leading-relaxed">
                    {skill.desc}
                  </p>
                </div>

                {/* Bauhaus Stat Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-[#F5F3EF] h-4 border-2 border-[#141414] overflow-hidden">
                    <div
                      className={`h-full ${skill.accentColor} transition-all duration-300`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono font-bold text-[#141414]/60">
                    <span>0</span>
                    <span>150 CAP</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Streak Protocol Matrix */}
      <div className="bg-[#FAF3E8] border-3 border-[#141414] p-6 sm:p-8 shadow-brutal">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b-2 border-[#141414]/20 pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-[#2B4AE8] block">// VERIFICATION MATRIX</span>
            <h2 className="text-xl font-black font-space text-[#141414] uppercase">
              28-DAY DISCIPLINE CADENCE
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono font-bold">
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-[#E8402C] border border-[#141414] inline-block" /> VERIFIED DAY
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-[#F5F3EF] border border-[#141414] inline-block" /> UNVERIFIED
            </span>
          </div>
        </div>

        {/* Sharp Square Contribution Grid */}
        <div className="grid grid-cols-7 sm:grid-cols-14 gap-2">
          {streakDays.map((d) => (
            <div
              key={d.day}
              className={`aspect-square border-2 border-[#141414] flex flex-col items-center justify-center text-[10px] font-mono font-bold transition-none ${d.isCompleted
                ? 'bg-[#E8402C] text-white'
                : 'bg-[#F5F3EF] text-[#141414]/50'
                } ${d.isToday ? 'ring-2 ring-[#141414] ring-offset-2' : ''}`}
            >
              <span>{d.day}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] font-mono text-[#141414]/70 mt-4 uppercase">
          * PROTOCOL RULE: COMPLETE AT LEAST ONE ACTIVE QUEST BEFORE MIDNIGHT TO EXTEND CADENCE.
        </p>
      </div>

      {/* Read-Only Activity Ledger Timeline */}
      <div>
        <div className="flex items-baseline justify-between mb-4 border-b-3 border-[#141414] pb-2">
          <div>
            <span className="text-xs font-mono font-bold text-[#2B4AE8] block">// TELEMETRY & TRANSACTION AUDIT</span>
            <h2 className="text-2xl font-black font-space text-[#141414] uppercase">
              ACTIVITY LEDGER
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-[#141414]/60">
            {mergedLedger.length} RECENT AUDIT RECORDS
          </span>
        </div>

        {isQuestsLoading ? (
          <div className="space-y-3">
            <Skeleton width="w-full" height="h-16" />
            <Skeleton width="w-full" height="h-16" />
            <Skeleton width="w-full" height="h-16" />
          </div>
        ) : mergedLedger.length === 0 ? (
          <div className="bg-[#FAF3E8] border-3 border-[#141414] p-10 text-center shadow-brutal font-mono">
            <div className="text-xs font-bold text-[#141414]/50 uppercase mb-1">// ZERO TELEMETRY LOGGED</div>
            <p className="text-xs text-[#141414]/70 uppercase">
              Execute active directives or requisition equipment from The Vault to generate chronological ledger entries.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {mergedLedger.map((entry) => (
              <div
                key={entry.id}
                className="bg-[#FAF3E8] border-2 border-[#141414] p-3.5 shadow-brutal-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono transition-none"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {entry.type === 'quest' ? (
                    <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-[#2B4AE8] text-white border border-[#141414] shrink-0">
                      DIRECTIVE
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-[#F2B705] text-[#141414] border border-[#141414] shrink-0">
                      VAULT
                    </span>
                  )}
                  <div className="truncate">
                    <div className="text-xs sm:text-sm font-black font-space uppercase text-[#141414] truncate">
                      {entry.title}
                    </div>
                    <div className="text-[10px] font-bold text-[#141414]/60 uppercase flex items-center gap-2 mt-0.5">
                      <span>VECTOR: [{entry.category}]</span>
                      <span>•</span>
                      <span>{formatRelativeTime(entry.timestamp)}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center justify-end">
                  {entry.reward ? (
                    <span className="px-2.5 py-1 text-xs font-black uppercase bg-white text-[#2B4AE8] border-2 border-[#141414] shadow-brutal-sm">
                      {entry.reward}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 text-xs font-black uppercase bg-white text-[#E8402C] border-2 border-[#141414] shadow-brutal-sm">
                      {entry.cost}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
