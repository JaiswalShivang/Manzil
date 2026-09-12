import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { CharacterViewport } from '../components/avatar/CharacterViewport';
import { QuestCard } from '../components/quest/QuestCard';
import { QuestFormModal } from '../components/quest/QuestFormModal';
import { LevelUpModal } from '../components/levelup/LevelUpModal';
import { Button } from '../components/ui/Button';
import { QuestCardSkeleton } from '../components/ui/Skeleton';
import {
  Flame,
  Coins,
  Plus,
  ArrowRight,
  ScrollText,
  Terminal,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, updateUserData } = useAuth();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState(null);
  const [levelUpData, setLevelUpData] = useState({ isOpen: false, newLevel: 1 });
  const [actionError, setActionError] = useState(null);

  // Fetch pending quests
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      setIsModalOpen(false);
      setEditingQuest(null);
    },
    onError: (err) => {
      setActionError(err.response?.data?.message || 'Could not save quest');
    },
  });

  // Update Quest Mutation (Optimistic)
  const updateQuestMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.patch(`/quests/${id}`, data);
      return res.data;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['quests'] });
      const previousQuests = queryClient.getQueryData(['quests', 'pending']);
      queryClient.setQueryData(['quests', 'pending'], (old) => {
        if (!old) return old;
        return {
          ...old,
          quests: (old.quests || []).map((q) => (q._id === id ? { ...q, ...data } : q)),
        };
      });
      return { previousQuests };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      setIsModalOpen(false);
      setEditingQuest(null);
    },
    onError: (err, variables, context) => {
      if (context?.previousQuests) {
        queryClient.setQueryData(['quests', 'pending'], context.previousQuests);
      }
      setActionError(err.response?.data?.message || 'Failed to update quest');
    },
  });

  // Complete Quest Mutation (Optimistic)
  const completeQuestMutation = useMutation({
    mutationFn: async (quest) => {
      const res = await api.post(`/quests/${quest._id}/complete`);
      return res.data;
    },
    onMutate: async (quest) => {
      await queryClient.cancelQueries({ queryKey: ['quests'] });
      const previousQuests = queryClient.getQueryData(['quests', 'pending']);

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
      if (data.user) {
        updateUserData(data.user);
      }
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

  // Delete Quest Mutation (Optimistic)
  const deleteQuestMutation = useMutation({
    mutationFn: async (questId) => {
      const res = await api.delete(`/quests/${questId}`);
      return res.data;
    },
    onMutate: async (questId) => {
      await queryClient.cancelQueries({ queryKey: ['quests'] });
      const previousQuests = queryClient.getQueryData(['quests', 'pending']);
      queryClient.setQueryData(['quests', 'pending'], (old) => {
        if (!old) return old;
        return {
          ...old,
          quests: (old.quests || []).filter((q) => q._id !== questId),
        };
      });
      return { previousQuests };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
    },
    onError: (err, variables, context) => {
      if (context?.previousQuests) {
        queryClient.setQueryData(['quests', 'pending'], context.previousQuests);
      }
      setActionError(err.response?.data?.message || 'Could not delete quest');
    },
  });

  const unequipMutation = useMutation({
    mutationFn: async (payload) => {
      const body = typeof payload === 'string' ? { itemType: payload } : payload;
      const res = await api.patch('/equip/unequip', body);
      return res.data;
    },
    onMutate: async (payload) => {
      const previousUser = user;
      let targetSlot = typeof payload === 'string' ? payload : payload?.itemType;
      if (targetSlot === 'crystal') targetSlot = 'aura';
      if (targetSlot) {
        updateUserData({
          equipped: {
            ...(user?.equipped || {}),
            [targetSlot]: null,
          },
        });
      }
      return { previousUser };
    },
    onSuccess: (data) => {
      if (data.user) {
        updateUserData(data.user);
      }
      queryClient.invalidateQueries({ queryKey: ['shop'] });
    },
    onError: (err, payload, context) => {
      if (context?.previousUser) {
        updateUserData(context.previousUser);
      }
      setActionError(err.response?.data?.message || 'Could not unequip item');
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-white border-3 border-[#141414] p-4 sm:p-6 lg:p-8 shadow-brutal-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-[#141414] tracking-tight">
              {user?.username || 'Scholar'}
            </h1>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
            {/* Level Badge */}
            <div className="bg-[#2B4AE8] text-[#F5F3EF] border-2 border-[#141414] px-3 sm:px-4 py-2 shadow-brutal-sm flex flex-col justify-center">
              <div className="text-[10px] font-heading font-black uppercase">CLEARANCE</div>
              <div className="text-lg sm:text-xl font-heading font-black">LV. {user?.level || 1}</div>
            </div>

            {/* Streak Badge */}
            <div className="bg-[#E8402C] text-[#F5F3EF] border-2 border-[#141414] px-3 sm:px-4 py-2 shadow-brutal-sm flex flex-col justify-center">
              <div className="text-[10px] font-heading font-black uppercase flex items-center gap-1">
                <Flame className="w-3 h-3 fill-current" /> STREAK
              </div>
              <div className="text-lg sm:text-xl font-heading font-black">{user?.streak?.count || 0} DAYS</div>
            </div>

            {/* Gold Badge */}
            <div className="bg-[#F2B705] text-[#141414] border-2 border-[#141414] px-3 sm:px-4 py-2 shadow-brutal-sm flex flex-col justify-center">
              <div className="text-[10px] font-heading font-black uppercase flex items-center gap-1">
                <Coins className="w-3 h-3" /> GOLD
              </div>
              <div className="text-lg sm:text-xl font-heading font-black">{user?.cozyCoins || 0}</div>
            </div>

            {/* Quick Add Button */}
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="ink"
              size="md"
              className="font-black col-span-2 sm:col-span-1 justify-center"
            >
              <Plus className="w-4 h-4" />
              <span>LOG QUEST</span>
            </Button>
          </div>
        </div>
      </div>

      {actionError && (
        <div className="p-3 bg-[#E8402C] text-[#F5F3EF] border-2 border-[#141414] text-xs font-heading font-bold uppercase flex items-center justify-between shadow-brutal-sm">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="font-black cursor-pointer">✕</button>
        </div>
      )}

      {/* Character Viewport Paperdoll Rig */}
      <CharacterViewport
        user={user}
        onUnequip={(slot) => unequipMutation.mutate(slot)}
        isUnequipping={unequipMutation.isPending}
      />

      {/* Active Quests Section */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-[#E8402C]" />
            <h2 className="text-2xl font-heading font-black text-[#141414] uppercase">
              ACTIVE QUEST BOARD
            </h2>
            <span className="text-xs font-heading font-black px-2 py-0.5 bg-[#141414] text-[#F5F3EF]">
              {pendingQuests.length} PENDING
            </span>
          </div>

          <Link
            to="/quests"
            className="text-xs font-heading font-black text-[#141414]/70 hover:text-[#141414] flex items-center gap-1 transition-colors uppercase"
          >
            OPEN FULL LOG <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {questsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuestCardSkeleton />
            <QuestCardSkeleton />
            <QuestCardSkeleton />
          </div>
        ) : pendingQuests.length === 0 ? (
          <div className="bg-white border-2 border-[#141414] p-10 text-center flex flex-col items-center shadow-brutal">
            <Terminal className="w-10 h-10 text-[#141414]/40 mb-3" />
            <h3 className="text-base font-heading font-black uppercase text-[#141414]">
              ALL DIRECTIVES EXECUTED
            </h3>
            <p className="text-xs font-sans text-[#141414]/70 max-w-sm mt-1 mb-5">
              Your active queue is empty. Commit a new study goal or routine to maintain streak integrity.
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="primary"
              size="sm"
              className="font-black"
            >
              <Plus className="w-4 h-4" /> LOG QUEST →
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingQuests.map((quest) => (
              <QuestCard
                key={quest._id}
                quest={quest}
                onComplete={(q) => completeQuestMutation.mutate(q)}
                onEdit={(q) => {
                  setEditingQuest(q);
                  setIsModalOpen(true);
                }}
                onDelete={(id) => deleteQuestMutation.mutate(id)}
                isCompleting={completeQuestMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quest Create / Edit Modal */}
      <QuestFormModal
        isOpen={isModalOpen}
        initialData={editingQuest}
        onClose={() => {
          setIsModalOpen(false);
          setEditingQuest(null);
        }}
        onSubmit={(formData, id) => {
          if (id) {
            updateQuestMutation.mutate({ id, data: formData });
          } else {
            createQuestMutation.mutate(formData);
          }
        }}
        isSubmitting={createQuestMutation.isPending || updateQuestMutation.isPending}
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
