import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { BookOpen, Heart, Shield, Sparkles, Repeat } from 'lucide-react';

export const QuestFormModal = ({ isOpen, onClose, onSubmit, isSubmitting = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('intellect');
  const [dueDate, setDueDate] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    {
      id: 'intellect',
      label: 'INTELLECT',
      desc: 'Coding, system architecture, research',
      icon: BookOpen,
      accent: 'border-[#2B4AE8] bg-[#2B4AE8]',
    },
    {
      id: 'vitality',
      label: 'VITALITY',
      desc: 'Physical conditioning, hydration, sleep',
      icon: Heart,
      accent: 'border-[#E8402C] bg-[#E8402C]',
    },
    {
      id: 'discipline',
      label: 'DISCIPLINE',
      desc: 'Unbroken routines, deep focus streaks',
      icon: Shield,
      accent: 'border-[#141414] bg-[#141414]',
    },
    {
      id: 'creativity',
      label: 'CREATIVITY',
      desc: 'UI drafting, generative arts, crafts',
      icon: Sparkles,
      accent: 'border-[#F2B705] bg-[#F2B705]',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'TITLE REQUIRED';
    } else if (title.trim().length > 120) {
      newErrors.title = 'MAX 120 CHARACTERS';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      category,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      isRecurring,
    });

    setTitle('');
    setDescription('');
    setCategory('intellect');
    setDueDate('');
    setIsRecurring(false);
    setErrors({});
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="INITIALIZE NEW QUEST"
      subtitle="Define verified task parameters to allocate XP and Gold"
      maxWidth="max-w-lg"
    >
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
          placeholder="Sub-tasks, command references, requirements..."
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
            label="Deadline Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
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
            {isSubmitting ? 'LOGGING...' : 'COMMIT QUEST →'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
