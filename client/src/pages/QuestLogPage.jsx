import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { QuestCard } from '../components/quest/QuestCard';
import { QuestFormModal } from '../components/quest/QuestFormModal';
import { QuestFilter } from '../components/quest/QuestFilter';
import { LevelUpModal } from '../components/levelup/LevelUpModal';
import { triggerCozyCelebration } from '../components/levelup/CelebrationBurst';
import { Button } from '../components/ui/Button';
import { QuestCardSkeleton } from '../components/ui/Skeleton';
import { ScrollText, Plus, Search, Sparkles } from 'lucide-react';

export const QuestLogPage = () => {
  const { user, updateUserData } = useAuth();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [levelUpData, setLevelUpData] = useState({ isOpen: false, newLevel: 1 });
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch all quests
  const { data: questsData, isLoading } = useQuery({
    queryKey: ['quests', statusFilter, categoryFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (categoryFilter) params.append('category', categoryFilter);

      const res = await api.get(`/quests?${params.toString()}`);
      return res.data;
    },
  });

  const quests = questsData?.quests || [];

  // Client-side search filtering
  const filteredQuests = quests.filter((q) => {
    if (!searchQuery.trim()) return true;
    return (
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Calculate counts
  const totalPending = quests.filter((q) => q.status === 'pending').length;
  const totalCompleted = quests.filter((q) => q.status === 'completed').length;

  // Create Quest Mutation
  const createQuestMutation = useMutation({
    mutationFn: async (newQuest) => {
      const res = await api.post('/quests', newQuest);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      setIsModalOpen(false);
    },
    onError: (err) => {
      setErrorMessage(err.response?.data?.message || 'Failed to create quest');
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
      const previous = queryClient.getQueryData(['quests', statusFilter, categoryFilter]);

      // Optimistically update quest status
      queryClient.setQueryData(['quests', statusFilter, categoryFilter], (old) => {
        if (!old) return old;
        return {
          ...old,
          quests: old.quests.map((q) =>
            q._id === quest._id ? { ...q, status: 'completed' } : q
          ),
        };
      });

      return { previous };
    },
    onSuccess: (data) => {
      triggerCozyCelebration();
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
      if (context?.previous) {
        queryClient.setQueryData(['quests', statusFilter, categoryFilter], context.previous);
      }
      setErrorMessage('Could not complete quest. Retrying...');
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ScrollText className="w-6 h-6 text-[#E3A08A]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3A2E27] tracking-tight">
              Quest Log
            </h1>
          </div>
          <p className="text-xs text-[#78665B] mt-0.5">
            Manage your daily study sessions, habits, and life milestones
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          size="md"
          className="font-bold shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Quest ✍️</span>
        </Button>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-100 border border-red-200 text-red-800 rounded-2xl text-xs flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#78665B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search quests by title or note keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F0E4D3] text-[#3A2E27] placeholder-[#78665B]/60 rounded-xl border border-[#E4D3BE] focus:border-[#E3A08A] focus:ring-2 focus:ring-[#E3A08A]/30 transition-colors duration-200 outline-none text-xs"
          />
        </div>

        <QuestFilter
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          totalPending={totalPending}
          totalCompleted={totalCompleted}
        />
      </div>

      {/* Quests Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuestCardSkeleton />
          <QuestCardSkeleton />
          <QuestCardSkeleton />
        </div>
      ) : filteredQuests.length === 0 ? (
        <div className="bg-[#FFF9E6] border border-[#EFE2B8] rounded-3xl p-12 text-center flex flex-col items-center">
          <span className="text-4xl mb-3">📜</span>
          <h3 className="text-lg font-bold text-[#3A2E27]">No Quests Found</h3>
          <p className="text-xs text-[#78665B] max-w-sm mt-1 mb-5">
            {searchQuery || categoryFilter || statusFilter
              ? 'No quests match your active filter settings. Try adjusting filters or search query.'
              : 'Your quest log is empty. Write your first study goal to start earning Focus Points!'}
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
          {filteredQuests.map((quest) => (
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

      {/* Modal */}
      <QuestFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(newQuest) => createQuestMutation.mutate(newQuest)}
        isSubmitting={createQuestMutation.isPending}
      />

      <LevelUpModal
        isOpen={levelUpData.isOpen}
        onClose={() => setLevelUpData({ isOpen: false, newLevel: levelUpData.newLevel })}
        newLevel={levelUpData.newLevel}
      />
    </div>
  );
};
