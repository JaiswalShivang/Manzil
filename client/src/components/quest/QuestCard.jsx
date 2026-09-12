import { useState } from 'react';
import { CategoryBadge } from '../ui/Badge';
import { Check, Trash2, Calendar, Repeat, Edit3 } from 'lucide-react';

export const QuestCard = ({
  quest,
  onComplete,
  onEdit,
  onDelete,
  isCompleting = false,
}) => {
  const isCompleted = quest.status === 'completed';
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const categoryColors = {
    intellect: 'bg-[#2B4AE8]',
    vitality: 'bg-[#E8402C]',
    discipline: 'bg-[#141414]',
    creativity: 'bg-[#F2B705]',
  };

  const cornerColor = categoryColors[quest.category] || 'bg-[#141414]';

  const formattedDate = quest.dueDate
    ? new Date(quest.dueDate).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div
      className={`relative border-2 border-[#141414] p-5 transition-all duration-150 flex flex-col justify-between card-hover-brutal ${
        isCompleted
          ? 'bg-[#EBE7DF] opacity-75 shadow-none'
          : 'bg-white shadow-brutal hover:bg-white'
      }`}
    >
      {/* Corner Tag Block */}
      <div className={`absolute top-0 right-0 w-4 h-4 ${cornerColor} border-l-2 border-b-2 border-[#141414]`} />

      <div>
        {/* Header: Category Badge & Due Date */}
        <div className="flex items-center justify-between gap-2 mb-3 pr-4">
          <CategoryBadge category={quest.category} />

          <div className="flex items-center gap-2 text-[11px] font-heading font-black uppercase text-[#141414]/70">
            {quest.isRecurring && (
              <span className="flex items-center gap-1 bg-[#141414] text-[#F5F3EF] px-1.5 py-0.5">
                <Repeat className="w-3 h-3" /> DAILY
              </span>
            )}
            {formattedDate && (
              <span className="flex items-center gap-1 border border-[#141414] px-1.5 py-0.5 bg-[#F5F3EF]">
                <Calendar className="w-3 h-3" /> {formattedDate}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h4
          className={`text-base font-heading font-black uppercase tracking-tight text-[#141414] mb-1 leading-snug ${
            isCompleted ? 'line-through text-[#141414]/50' : ''
          }`}
        >
          {quest.title}
        </h4>

        {quest.description && (
          <p
            className={`text-xs font-sans text-[#141414]/80 mb-4 line-clamp-2 leading-relaxed ${
              isCompleted ? 'line-through text-[#141414]/40' : ''
            }`}
          >
            {quest.description}
          </p>
        )}
      </div>

      {/* Footer: Rewards & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t-2 border-[#141414] mt-auto">
        <div className="flex items-center gap-2 text-xs font-heading font-black uppercase">
          <span className="bg-[#E8402C] text-[#F5F3EF] px-2 py-0.5 border border-[#141414]">
            +{quest.xpReward} XP
          </span>
          <span className="bg-[#F2B705] text-[#141414] px-2 py-0.5 border border-[#141414]">
            +{quest.coinReward} GOLD
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Edit Action (Pending Quests Only) */}
          {!isCompleted && onEdit && (
            <button
              type="button"
              onClick={() => onEdit(quest)}
              className="p-1.5 text-[#141414] hover:bg-[#2B4AE8] hover:text-[#F5F3EF] border border-[#141414] transition-colors cursor-pointer shadow-brutal-sm"
              title="Edit Directive"
              aria-label="Edit Directive"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Delete Action with Inline Confirmation (No browser confirm popup) */}
          {onDelete && (
            isConfirmingDelete ? (
              <div className="flex items-center gap-1 bg-[#FAF3E8] border border-[#141414] p-1 shadow-brutal-sm">
                <span className="text-[10px] font-heading font-black text-[#E8402C] px-1">PURGE?</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsConfirmingDelete(false);
                    onDelete(quest._id);
                  }}
                  className="px-2 py-0.5 bg-[#E8402C] text-white text-[10px] font-heading font-black border border-[#141414] hover:bg-[#141414] cursor-pointer"
                  title="Confirm Delete"
                >
                  YES
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(false)}
                  className="px-2 py-0.5 bg-white text-[#141414] text-[10px] font-heading font-black border border-[#141414] hover:bg-[#EBE7DF] cursor-pointer"
                  title="Cancel Delete"
                >
                  NO
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                className="p-1.5 text-[#141414] hover:bg-[#E8402C] hover:text-[#F5F3EF] border border-[#141414] transition-colors cursor-pointer shadow-brutal-sm"
                title="Purge Quest"
                aria-label="Purge Quest"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )
          )}

          {/* Complete Button */}
          {!isCompleted ? (
            <button
              type="button"
              onClick={() => onComplete(quest)}
              disabled={isCompleting}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#141414] hover:bg-[#E8402C] text-[#F5F3EF] border-2 border-[#141414] text-xs font-heading font-black uppercase shadow-brutal-sm hover:shadow-none transition-all cursor-pointer disabled:opacity-40"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>EXECUTE</span>
            </button>
          ) : (
            <span className="text-xs font-heading font-black uppercase text-[#141414] bg-[#F2B705] px-2.5 py-1 border border-[#141414] flex items-center gap-1">
              <Check className="w-3.5 h-3.5 stroke-[3]" /> RESOLVED
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
