import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { StudyRoomScene } from '../components/room/StudyRoomScene';
import { QuestCard } from '../components/quest/QuestCard';
import { QuestFormModal } from '../components/quest/QuestFormModal';
import { LevelUpModal } from '../components/levelup/LevelUpModal';
import { triggerCozyCelebration } from '../components/levelup/CelebrationBurst';
import { Button } from '../components/ui/Button';
import { QuestCardSkeleton } from '../components/ui/Skeleton';
import {
  Sparkles,
  Flame,
  Coins,
  Plus,
  ArrowRight,
  BookOpen,
  Award,
  ScrollText,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, updateUserData } = useAuth();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [levelUpData, setLevelUpData] = useState({ isOpen: false, newLevel: 1 });
  const [actionError, setActionError] = useState(null);

  // Fetch pending quests for the study desk quick-view
  const { data: questsData, isLoading: questsLoading } = useQuery({
    queryKey: ['quests', 'pending'],
    queryFn: async () => {
      const res = await api.get('/quests?status=pending');
      return res.data;
    },
  });

  const pendingQuests = questsData?.quests || [];

  // Create Quest Mutation
  const createQuestMutation = useMutation({
    mutationFn: async (newQuest) => {
      const res = await api.post('/quests', newQuest);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      setIsModalOpen(false);
    },
    onError: (err) => {
      setActionError(err.response?.data?.message || 'Could not save quest');
    },
  });

  // Complete Quest Mutation (with optimistic UI and rollback)
  const completeQuestMutation = useMutation({
    mutationFn: async (quest) => {
      const res = await api.post(`/quests/${quest._id}/complete`);
      return res.data;
    },
    onMutate: async (quest) => {
      await queryClient.cancelQueries({ queryKey: ['quests'] });
      const previousQuests = queryClient.getQueryData(['quests', 'pending']);

      // Optimistically remove completed quest from pending list
      queryClient.setQueryData(['quests', 'pending'], (old) => {
        if (!old) return old;
        return {
          ...old,
          quests: old.quests.filter((q) => q._id !== quest._id),
        };
      });

      return { previousQuests };
    },
    onSuccess: (data) => {
      // Trigger celebration sparks
      triggerCozyCelebration();

      // Update auth user state with server calculated progression
      if (data.user) {
        updateUserData(data.user);
      }

      // Check if leveled up!
      if (data.progression?.leveledUp) {
        setLevelUpData({
          isOpen: true,
          newLevel: data.progression.newLevel,
        });
      }

      queryClient.invalidateQueries({ queryKey: ['quests'] });
    },
    onError: (err, variables, context) => {
      if (context?.previousQuests) {
        queryClient.setQueryData(['quests', 'pending'], context.previousQuests);
      }
      setActionError('Could not mark quest as completed. Reverting changes...');
    },
  });

  // Delete Quest Mutation
  const deleteQuestMutation = useMutation({
    mutationFn: async (questId) => {
      const res = await api.delete(`/quests/${questId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
    },
  });

  // Calculate XP percentage
  const currentXP = user?.currentXP || 0;
  const xpToNext = user?.xpToNextLevel || 100;
  const xpPercentage = Math.min(100, Math.round((currentXP / xpToNext) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Top Welcome & Progression Overview Card */}
      <div className="bg-[#F0E4D3] border border-[#E4D3BE] rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3A2E27] tracking-tight">
                Good day, {user?.username || 'Scholar'} ☕
              </h1>
              <span className="font-handwritten text-lg text-[#E3A08A] font-semibold">
                ready to study?
              </span>
            </div>
            <p className="text-xs text-[#78665B] mt-0.5">
              Welcome back to your nook. Complete quests below to furnish your room!
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Streak Counter Card */}
            <div className="flex items-center gap-2 bg-[#FAF3E8] px-4 py-2 rounded-2xl border border-[#E4D3BE] shadow-xs">
              <Flame className="w-5 h-5 text-[#E3A08A] fill-[#E3A08A]" />
              <div>
                <div className="text-[10px] uppercase font-bold text-[#78665B] leading-none">
                  Streak
                </div>
                <div className="text-sm font-extrabold text-[#3A2E27]">
                  {user?.streak?.count || 0} Days
                </div>
              </div>
            </div>

            {/* Cozy Coins Balance Card */}
            <div className="flex items-center gap-2 bg-[#FAF3E8] px-4 py-2 rounded-2xl border border-[#E4D3BE] shadow-xs">
              <Coins className="w-5 h-5 text-[#F4C572]" />
              <div>
                <div className="text-[10px] uppercase font-bold text-[#78665B] leading-none">
                  Coins
                </div>
                <div className="text-sm font-extrabold text-[#855D16]">
                  {user?.cozyCoins || 0}
                </div>
              </div>
            </div>

            {/* Quick Add Quest Button */}
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="primary"
              size="md"
              className="font-bold shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>New Quest</span>
            </Button>
          </div>
        </div>

        {/* Focus Points (XP) Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-[#3A2E27]">
              <Sparkles className="w-4 h-4 text-[#E3A08A]" />
              <span>Level {user?.level || 1} Progress</span>
            </div>
            <span className="text-[#78665B]">
              {currentXP} / {xpToNext} FP ({xpPercentage}%)
            </span>
          </div>

          {/* Glowing XP Track */}
          <div className="w-full h-3.5 bg-[#FAF3E8] rounded-full overflow-hidden border border-[#E4D3BE] p-0.5 relative">
            <div
              className="h-full bg-gradient-to-r from-[#F4C572] via-[#E3A08A] to-[#F4C572] rounded-full transition-all duration-500 relative"
              style={{ width: `${xpPercentage}%` }}
            >
              {/* Glow tip at leading edge */}
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/70 rounded-full blur-[1px]" />
            </div>
          </div>
        </div>
      </div>

      {actionError && (
        <div className="p-3 bg-red-100 border border-red-200 text-red-800 rounded-2xl text-xs flex items-center justify-between">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* Interactive Study Room Scene */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="text-xl font-bold text-[#3A2E27]">My Study Room</h2>
            <p className="text-xs text-[#78665B]">
              Furnishings unlock as you level up and purchase decorations in the shop
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-[#E3A08A] hover:text-[#3A2E27] flex items-center gap-1 transition-colors"
          >
            Visit Cozy Shop <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <StudyRoomScene user={user} />
      </div>

      {/* Active Quests Section */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-[#E3A08A]" />
            <h2 className="text-xl font-bold text-[#3A2E27]">Active Quest Board</h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#E3A08A]/20 text-[#3A2E27]">
              {pendingQuests.length} pending
            </span>
          </div>

          <Link
            to="/quests"
            className="text-xs font-bold text-[#78665B] hover:text-[#3A2E27] flex items-center gap-1 transition-colors"
          >
            View All in Quest Log <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {questsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuestCardSkeleton />
            <QuestCardSkeleton />
            <QuestCardSkeleton />
          </div>
        ) : pendingQuests.length === 0 ? (
          <div className="bg-[#FFF9E6] border border-[#EFE2B8] rounded-3xl p-8 text-center flex flex-col items-center">
            <span className="text-3xl mb-2">✨</span>
            <h3 className="text-base font-bold text-[#3A2E27]">Your desk is clear for today!</h3>
            <p className="text-xs text-[#78665B] max-w-sm mt-1 mb-4">
              You've completed all active quests. Add a new study goal, reading target, or habit to keep your streak going!
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="primary"
              size="sm"
              className="font-bold"
            >
              <Plus className="w-4 h-4" /> Add Quest ✍️
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingQuests.map((quest) => (
              <QuestCard
                key={quest._id}
                quest={quest}
                onComplete={(q) => completeQuestMutation.mutate(q)}
                onDelete={(id) => deleteQuestMutation.mutate(id)}
                isCompleting={completeQuestMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>

      {/* New Quest Modal */}
      <QuestFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(newQuest) => createQuestMutation.mutate(newQuest)}
        isSubmitting={createQuestMutation.isPending}
      />

      {/* Level Up Celebration Modal */}
      <LevelUpModal
        isOpen={levelUpData.isOpen}
        onClose={() => setLevelUpData({ isOpen: false, newLevel: levelUpData.newLevel })}
        newLevel={levelUpData.newLevel}
      />
    </div>
  );
};
