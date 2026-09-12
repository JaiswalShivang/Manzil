import { useAuth } from '../context/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { Button } from '../components/ui/Button';
import {
  BookOpen,
  Heart,
  Shield,
  Sparkles,
  Flame,
  Coins,
  LogOut,
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUserData, logout } = useAuth();
  const queryClient = useQueryClient();

  // Equip/Unequip Mutation
  const equipMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.patch('/users/me', payload);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.user) {
        updateUserData(data.user);
      }
      queryClient.invalidateQueries({ queryKey: ['shop'] });
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

  // Generate streak calendar matrix (last 28 days)
  const streakDays = Array.from({ length: 28 }, (_, i) => {
    const currentStreak = user?.streak?.count || 0;
    // Highlight the most recent consecutive days
    const isCompleted = i >= 28 - currentStreak;
    const isToday = i === 27;
    return { day: i + 1, isCompleted, isToday };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Profile Dossier Banner */}
      <div className="bg-[#FAF3E8] border-3 border-[#141414] p-6 sm:p-8 shadow-brutal flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-6">
          <div className="w-20 h-20 bg-[#141414] border-3 border-[#141414] flex flex-col items-center justify-center text-white shrink-0">
            <span className="text-[10px] font-mono text-[#F2B705] tracking-widest font-black">RANK</span>
            <span className="text-2xl font-black font-space leading-none mt-1">LV.{user?.level || 1}</span>
          </div>

          <div>
            <div className="inline-block bg-[#E8402C] text-white text-[10px] font-mono font-black px-2 py-0.5 mb-1.5 uppercase">
              // ACTIVE AGENT DOSSIER
            </div>
            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-3xl sm:text-4xl font-black text-[#141414] font-space uppercase tracking-tight">
                {user?.username || 'AGENT-01'}
              </h1>
              <span className="text-xs font-mono font-bold text-[#141414]/60">
                [{user?.email}]
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-bold text-[#141414] mt-3 pt-3 border-t border-[#141414]/20">
              <span className="flex items-center gap-1.5 bg-[#F5F3EF] px-2.5 py-1 border border-[#141414]">
                <Flame className="w-4 h-4 text-[#E8402C]" />
                STREAK: {user?.streak?.count || 0} CONSECUTIVE DAYS
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
              className={`aspect-square border-2 border-[#141414] flex flex-col items-center justify-center text-[10px] font-mono font-bold transition-none ${
                d.isCompleted
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

      {/* Tactical Asset Inventory */}
      <div>
        <div className="flex items-baseline justify-between mb-4 border-b-3 border-[#141414] pb-2">
          <div>
            <span className="text-xs font-mono font-bold text-[#F2B705] block">// HARDWARE REQUISITIONS</span>
            <h2 className="text-2xl font-black font-space text-[#141414] uppercase">
              TACTICAL INVENTORY
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-[#141414]/60">
            {inventory.length} TOTAL ASSETS ACQUIRED
          </span>
        </div>

        {inventory.length === 0 ? (
          <div className="bg-[#FAF3E8] border-3 border-[#141414] p-12 text-center shadow-brutal">
            <div className="text-4xl font-space font-extrabold text-[#141414] mb-2">[ 00 ]</div>
            <h3 className="text-base font-extrabold font-space text-[#141414] uppercase">
              NO ACQUIRED ASSETS IN STORAGE
            </h3>
            <p className="text-xs font-mono text-[#141414]/70 mt-1 uppercase">
              COMMENCE QUESTS TO GENERATE SURPLUS GOLD, THEN ACCESS THE VAULT.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {inventory.map((inv) => {
              const item = inv.itemId;
              if (!item) return null;

              return (
                <div
                  key={item._id}
                  className="bg-[#FAF3E8] border-3 border-[#141414] p-5 shadow-brutal flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#141414]/60 uppercase block">
                        [{item.category}]
                      </span>
                      <span className="text-sm font-black font-space text-[#141414] uppercase block mt-1">
                        {item.name}
                      </span>
                    </div>
                    {inv.equipped ? (
                      <span className="px-2 py-0.5 text-[10px] font-mono font-black bg-[#2B4AE8] text-white border border-[#141414] uppercase">
                        MOUNTED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#F5F3EF] text-[#141414]/70 border border-[#141414] uppercase">
                        STANDBY
                      </span>
                    )}
                  </div>

                  <div className="pt-3 border-t-2 border-[#141414]/20 mt-3">
                    {inv.equipped ? (
                      <button
                        onClick={() => equipMutation.mutate({ unequipItemId: item._id })}
                        disabled={equipMutation.isPending}
                        className="w-full py-2 bg-[#F5F3EF] hover:bg-[#141414] text-[#141414] hover:text-white border-2 border-[#141414] text-xs font-mono font-bold uppercase transition-none cursor-pointer"
                      >
                        DEMOUNT ASSET
                      </button>
                    ) : (
                      <button
                        onClick={() => equipMutation.mutate({ equipItemId: item._id })}
                        disabled={equipMutation.isPending}
                        className="w-full py-2 bg-[#E8402C] hover:bg-[#141414] text-white border-2 border-[#141414] text-xs font-mono font-bold uppercase transition-none cursor-pointer"
                      >
                        MOUNT IN HQ →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
