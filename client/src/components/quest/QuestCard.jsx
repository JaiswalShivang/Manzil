import React from 'react';
import { CategoryBadge } from '../ui/Badge';
import { Check, Trash2, Calendar, Repeat, Sparkles, Coins } from 'lucide-react';

export const QuestCard = ({ quest, onComplete, onDelete, isCompleting = false }) => {
  const isCompleted = quest.status === 'completed';

  const formattedDate = quest.dueDate
    ? new Date(quest.dueDate).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div
      className={`group relative transition-all duration-200 rounded-2xl p-5 border ${
        isCompleted
          ? 'bg-[#F0E4D3]/50 border-[#E4D3BE]/60 opacity-70'
          : 'bg-[#FFF9E6] border-[#EFE2B8] shadow-[0_4px_16px_rgba(58,46,39,0.08)] hover:shadow-[0_8px_24px_rgba(58,46,39,0.12)] hover:-translate-y-0.5'
      }`}
    >
      {/* Top sticky tape decoration for uncompleted quests */}
      {!isCompleted && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-3.5 bg-[#E3A08A]/35 rounded-sm pointer-events-none" />
      )}

      {/* Header: Category Badge & Due Date */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <CategoryBadge category={quest.category} />

        <div className="flex items-center gap-2 text-xs text-[#78665B]">
          {quest.isRecurring && (
            <span
              className="flex items-center gap-1 text-[11px] text-[#4D6339] bg-[#9CAF88]/20 px-2 py-0.5 rounded-full"
              title="Daily recurring quest"
            >
              <Repeat className="w-3 h-3" /> Daily
            </span>
          )}
          {formattedDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#78665B]" />
              {formattedDate}
            </span>
          )}
        </div>
      </div>

      {/* Title & Description */}
      <h4
        className={`text-base font-bold tracking-tight text-[#3A2E27] mb-1 font-sans ${
          isCompleted ? 'line-through text-[#78665B]' : ''
        }`}
      >
        {quest.title}
      </h4>

      {quest.description && (
        <p
          className={`text-xs text-[#78665B] mb-3 line-clamp-2 ${
            isCompleted ? 'line-through' : ''
          }`}
        >
          {quest.description}
        </p>
      )}

      {/* Footer: Rewards & Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-[#E4D3BE]/60 mt-auto">
        <div className="flex items-center gap-2.5 text-xs font-semibold">
          <span className="flex items-center gap-1 text-[#8F4E38]" title="Focus Points XP">
            <Sparkles className="w-3.5 h-3.5 text-[#E3A08A]" />
            +{quest.xpReward} FP
          </span>
          <span className="flex items-center gap-1 text-[#855D16]" title="Cozy Coins">
            <Coins className="w-3.5 h-3.5 text-[#F4C572]" />
            +{quest.coinReward}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Delete Button */}
          <button
            onClick={() => onDelete(quest._id)}
            className="p-1.5 text-[#78665B]/60 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
            title="Remove quest"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Complete Button */}
          {!isCompleted ? (
            <button
              onClick={() => onComplete(quest)}
              disabled={isCompleting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#9CAF88] hover:bg-[#8A9E76] text-white rounded-xl text-xs font-semibold shadow-[0_3px_10px_rgba(156,175,136,0.3)] transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Complete</span>
            </button>
          ) : (
            <span className="text-xs font-medium text-[#4D6339] bg-[#9CAF88]/20 px-2.5 py-1 rounded-xl flex items-center gap-1">
              <Check className="w-3 h-3" /> Done
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
