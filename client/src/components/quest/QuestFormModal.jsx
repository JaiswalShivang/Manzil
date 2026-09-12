import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { BookOpen, Heart, Shield, Sparkles, Repeat } from 'lucide-react';

const categories = [
  {
    id: 'intellect',
    label: 'INTELLECT',
    desc: 'Coding, system architecture, research',
    icon: BookOpen,
  },
  {
    id: 'vitality',
    label: 'VITALITY',
    desc: 'Physical conditioning, hydration, sleep',
    icon: Heart,
  },
  {
    id: 'discipline',
    label: 'DISCIPLINE',
    desc: 'Unbroken routines, deep focus streaks',
    icon: Shield,
  },
  {
    id: 'creativity',
    label: 'CREATIVITY',
    desc: 'UI drafting, generative arts, crafts',
    icon: Sparkles,
  },
];

const QuestFormContent = ({ initialData, onSubmit, onClose, isSubmitting }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || 'intellect');
  const getTodayDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getTodayDateString();

  const [dueDate, setDueDate] = useState(
    initialData?.dueDate
      ? new Date(initialData.dueDate).toISOString().split('T')[0]
      : ''
  );
  const [isRecurring, setIsRecurring] = useState(Boolean(initialData?.isRecurring));
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'TITLE REQUIRED';
    } else if (title.trim().length > 120) {
      newErrors.title = 'MAX 120 CHARACTERS';
    }

    if (dueDate && dueDate < todayStr) {
      newErrors.dueDate = 'DEADLINE CANNOT BE SET TO A PAST DATE';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(
      {
        title: title.trim(),
        description: description.trim(),
        category,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        isRecurring,
      },
      initialData?._id
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Quest Designation (Title) *"
        placeholder="e.g. Ship Docker Compose cluster configuration"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        required
      />

      <Textarea
        label="Execution Notes (Optional)"
        placeholder="Sub-directives, command references, requirements..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
      />

      <div>
        <label className="text-xs font-heading font-black uppercase tracking-wider text-[#141414] block mb-2">
          ASSIGN TARGET SKILL VECTOR
        </label>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`flex flex-col items-start p-3 border-2 border-[#141414] text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#141414] text-[#F5F3EF] shadow-brutal-sm'
                    : 'bg-white hover:bg-[#F5F3EF] text-[#141414]'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span className="text-xs font-heading font-black">{cat.label}</span>
                </div>
                <span className="text-[10px] font-sans opacity-80 line-clamp-1">
                  {cat.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <Input
          label="Deadline Date (Today or Future)"
          type="date"
          min={todayStr}
          value={dueDate}
          onChange={(e) => {
            setDueDate(e.target.value);
            if (errors.dueDate) {
              setErrors((prev) => ({ ...prev, dueDate: null }));
            }
          }}
          error={errors.dueDate}
        />

        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-2.5 p-2.5 bg-white border-2 border-[#141414] cursor-pointer hover:bg-[#F5F3EF] transition-colors">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="w-4 h-4 text-[#E8402C] focus:ring-0 accent-[#E8402C]"
            />
            <div className="flex items-center gap-1.5 text-xs font-heading font-black uppercase text-[#141414]">
              <Repeat className="w-3.5 h-3.5" />
              <span>DAILY HABIT LOOP</span>
            </div>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2.5 pt-4 border-t-2 border-[#141414]">
        <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
          CANCEL
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'SAVING...' : initialData ? 'UPDATE DIRECTIVE →' : 'COMMIT QUEST →'}
        </Button>
      </div>
    </form>
  );
};

export const QuestFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  initialData = null,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'MODIFY DIRECTIVE SPECIFICATION' : 'INITIALIZE NEW QUEST'}
      subtitle={
        initialData
          ? 'Revise parameters for this active directive'
          : 'Define verified task parameters to allocate XP and Gold'
      }
      maxWidth="max-w-lg"
    >
      {isOpen && (
        <QuestFormContent
          key={initialData?._id || 'new-quest'}
          initialData={initialData}
          onSubmit={onSubmit}
          onClose={onClose}
          isSubmitting={isSubmitting}
        />
      )}
    </Modal>
  );
};
