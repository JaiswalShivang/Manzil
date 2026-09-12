import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { QuestCard } from '../components/quest/QuestCard';
import { QuestFormModal } from '../components/quest/QuestFormModal';
import { QuestFilter } from '../components/quest/QuestFilter';
import { LevelUpModal } from '../components/levelup/LevelUpModal';
import { Button } from '../components/ui/Button';
import { QuestCardSkeleton } from '../components/ui/Skeleton';
import { ScrollText, Plus, Search } from 'lucide-react';

export const QuestLogPage = () => {
  const { updateUserData } = useAuth();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState(null);
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

  const filteredQuests = quests.filter((q) => {
    if (!searchQuery.trim()) return true;
    return (
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
      setEditingQuest(null);
    },
    onError: (err) => {
      setErrorMessage(err.response?.data?.message || 'Failed to create quest');
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
      const previous = queryClient.getQueryData(['quests', statusFilter, categoryFilter]);
      queryClient.setQueryData(['quests', statusFilter, categoryFilter], (old) => {
        if (!old) return old;
        return {
          ...old,
          quests: (old.quests || []).map((q) => (q._id === id ? { ...q, ...data } : q)),
        };
      });
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      setIsModalOpen(false);
      setEditingQuest(null);
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['quests', statusFilter, categoryFilter], context.previous);
      }
      setErrorMessage(err.response?.data?.message || 'Failed to update quest');
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

  // Delete Quest Mutation (Optimistic)
  const deleteQuestMutation = useMutation({
    mutationFn: async (questId) => {
      const res = await api.delete(`/quests/${questId}`);
      return res.data;
    },
    onMutate: async (questId) => {
      await queryClient.cancelQueries({ queryKey: ['quests'] });
      const previous = queryClient.getQueryData(['quests', statusFilter, categoryFilter]);
      queryClient.setQueryData(['quests', statusFilter, categoryFilter], (old) => {
        if (!old) return old;
        return {
          ...old,
          quests: (old.quests || []).filter((q) => q._id !== questId),
        };
      });
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['quests', statusFilter, categoryFilter], context.previous);
      }
      setErrorMessage(err.response?.data?.message || 'Could not delete quest');
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-3 border-[#141414]">
        <div>
          <div className="flex items-center gap-2">
            <ScrollText className="w-6 h-6 text-[#E8402C]" />
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-[#141414] uppercase tracking-tight">
              QUEST LOG
            </h1>
          </div>
          <p className="text-xs font-heading font-bold uppercase text-[#141414]/60 mt-1">
            MANAGE DEPLOYABLE TASKS AND EXECUTION MILESTONES
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          size="md"
          className="font-black"
        >
          <Plus className="w-4 h-4" />
          <span>LOG NEW QUEST →</span>
        </Button>
      </div>

      {errorMessage && (
        <div className="p-3 bg-[#E8402C] text-[#F5F3EF] border-2 border-[#141414] text-xs font-heading font-bold uppercase flex items-center justify-between shadow-brutal-sm">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="font-black cursor-pointer">✕</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#141414]/60 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[2.5]" />
          <input
            type="text"
            placeholder="SEARCH QUESTS BY DESIGNATION OR DIRECTIVE KEYWORDS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white text-[#141414] placeholder-[#141414]/40 border-2 border-[#141414] focus:outline-none focus:shadow-brutal-sm text-xs font-heading font-bold uppercase"
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
        <div className="bg-white border-2 border-[#141414] p-12 text-center flex flex-col items-center shadow-brutal">
          <span className="text-4xl mb-3">📜</span>
          <h3 className="text-xl font-heading font-black text-[#141414] uppercase">
            NO MATCHING DIRECTIVES
          </h3>
          <p className="text-xs font-sans text-[#141414]/70 max-w-sm mt-1 mb-6">
            {searchQuery || categoryFilter || statusFilter
              ? 'No quests match your active filter parameters. Adjust search string or filter vectors.'
              : 'Your active queue is clear. Log a new task to resume XP accumulation.'}
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="primary"
            size="sm"
            className="font-black"
          >
            <Plus className="w-4 h-4" /> COMMIT QUEST →
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuests.map((quest) => (
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

      {/* Integrity Model Protocol Note */}
      <div className="bg-[#FAF3E8] border-2 border-[#141414] p-4 shadow-brutal-sm font-mono text-xs">
        <div className="text-[10px] font-black text-[#2B4AE8] mb-1 uppercase tracking-wider">
          // INTEGRITY MODEL
        </div>
        <p className="text-[#141414]/80 leading-relaxed font-bold uppercase text-[11px]">
          Task completion is self-declared by the operative. All XP, Gold, and skill rewards are calculated and validated server-side from stored directive data — client-submitted values are never trusted, and duplicate completions are rejected atomically. No manual review layer exists by design; verification targets technical exploitation, not real-world task honesty.
        </p>
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

      <LevelUpModal
        isOpen={levelUpData.isOpen}
        onClose={() => setLevelUpData({ isOpen: false, newLevel: levelUpData.newLevel })}
        newLevel={levelUpData.newLevel}
      />
    </div>
  );
};
