import React, { useState } from 'react';
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
  Calendar,
  LogOut,
  Package,
  Check,
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUserData, logout } = useAuth();
  const queryClient = useQueryClient();

  const [message, setMessage] = useState(null);

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
      name: 'Intellect',
      score: user?.skills?.intellect || 0,
      icon: BookOpen,
      color: 'bg-[#B9A6D9]',
      text: 'text-[#6B568E]',
      border: 'border-[#B9A6D9]',
      desc: 'Study, coding, deep focus & reading',
    },
    {
      id: 'vitality',
      name: 'Vitality',
      score: user?.skills?.vitality || 0,
      icon: Heart,
      color: 'bg-[#9CAF88]',
      text: 'text-[#4D6339]',
      border: 'border-[#9CAF88]',
      desc: 'Workouts, healthy meals, walk & rest',
    },
    {
      id: 'discipline',
      name: 'Discipline',
      score: user?.skills?.discipline || 0,
      icon: Shield,
      color: 'bg-[#E3A08A]',
      text: 'text-[#8F4E38]',
      border: 'border-[#E3A08A]',
      desc: 'Daily habits, morning routines & streaks',
    },
    {
      id: 'creativity',
      name: 'Creativity',
      score: user?.skills?.creativity || 0,
      icon: Sparkles,
      color: 'bg-[#F4C572]',
      text: 'text-[#855D16]',
      border: 'border-[#F4C572]',
      desc: 'Writing, artwork, designing & crafts',
    },
  ];

  const inventory = user?.inventory || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Profile Banner */}
      <div className="bg-[#F0E4D3] border border-[#E4D3BE] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-18 h-18 rounded-3xl bg-[#FAF3E8] border-2 border-[#E3A08A] flex items-center justify-center text-3xl shadow-sm">
            ☕
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3A2E27] tracking-tight">
                {user?.username || 'Scholar'}
              </h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-extrabold bg-[#E3A08A]/30 text-[#3A2E27]">
                Level {user?.level || 1}
              </span>
            </div>
            <p className="text-xs text-[#78665B] mt-0.5">{user?.email}</p>
            <div className="flex items-center gap-4 text-xs text-[#78665B] mt-2">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#E3A08A]" />
                Streak: {user?.streak?.count || 0} Days
              </span>
              <span className="flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-[#F4C572]" />
                Balance: {user?.cozyCoins || 0} Coins
              </span>
            </div>
          </div>
        </div>

        <Button
          onClick={logout}
          variant="secondary"
          size="sm"
          className="text-xs font-semibold self-stretch md:self-auto justify-center"
        >
          <LogOut className="w-4 h-4 mr-1.5" /> Log Out
        </Button>
      </div>

      {/* 4 RPG Skill Meters */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-[#3A2E27]">Character Skills</h2>
          <p className="text-xs text-[#78665B]">
            Completing quests in different categories naturally increases your core RPG stats
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skills.map((skill) => {
            const Icon = skill.icon;
            // Map skill points into progress bar percentage
            const progress = Math.min(100, Math.max(10, (skill.score / 150) * 100));

            return (
              <div
                key={skill.id}
                className="bg-[#F0E4D3] border border-[#E4D3BE] rounded-2xl p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl bg-[#FAF3E8] ${skill.text}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-sm text-[#3A2E27]">{skill.name}</span>
                    </div>
                    <span className={`text-base font-extrabold ${skill.text}`}>
                      {skill.score}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#78665B] mb-4 line-clamp-2">{skill.desc}</p>
                </div>

                <div className="w-full bg-[#FAF3E8] h-2.5 rounded-full overflow-hidden border border-[#E4D3BE]">
                  <div
                    className={`h-full ${skill.color} rounded-full transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Room Inventory Manager */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#E3A08A]" />
              <h2 className="text-xl font-bold text-[#3A2E27]">Room Inventory</h2>
            </div>
            <p className="text-xs text-[#78665B]">
              Decorations you own. Equip or unequip them to style your study room!
            </p>
          </div>
          <span className="text-xs font-semibold text-[#78665B]">
            {inventory.length} items owned
          </span>
        </div>

        {inventory.length === 0 ? (
          <div className="bg-[#FFF9E6] border border-[#EFE2B8] rounded-3xl p-8 text-center">
            <span className="text-3xl mb-2">📦</span>
            <h3 className="text-sm font-bold text-[#3A2E27]">No decorations yet</h3>
            <p className="text-xs text-[#78665B] mt-1 mb-3">
              Visit The Cozy Corner Shop to adopt plants, desk lamps, and posters for your room!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {inventory.map((inv) => {
              const item = inv.itemId;
              if (!item) return null;

              return (
                <div
                  key={item._id}
                  className="bg-[#F0E4D3] border border-[#E4D3BE] rounded-2xl p-4 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs font-bold text-[#3A2E27] block">{item.name}</span>
                      <span className="text-[10px] text-[#78665B] capitalize">{item.category}</span>
                    </div>
                    {inv.equipped && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#9CAF88]/20 text-[#4D6339] border border-[#9CAF88]/40 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Placed
                      </span>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#E4D3BE] mt-3">
                    {inv.equipped ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => equipMutation.mutate({ unequipItemId: item._id })}
                        disabled={equipMutation.isPending}
                        className="w-full text-xs"
                      >
                        Unequip to Inventory
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => equipMutation.mutate({ equipItemId: item._id })}
                        disabled={equipMutation.isPending}
                        className="w-full text-xs font-semibold"
                      >
                        Equip in Room ✨
                      </Button>
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
