import React, { useState } from 'react';
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
      label: 'Intellect',
      desc: 'Study, coding, reading, learning',
      icon: BookOpen,
      color: 'border-[#B9A6D9] text-[#6B568E] bg-[#B9A6D9]/15',
    },
    {
      id: 'vitality',
      label: 'Vitality',
      desc: 'Workouts, yoga, walk, water, sleep',
      icon: Heart,
      color: 'border-[#9CAF88] text-[#4D6339] bg-[#9CAF88]/15',
    },
    {
      id: 'discipline',
      label: 'Discipline',
      desc: 'Meditation, cleaning room, routines',
      icon: Shield,
      color: 'border-[#E3A08A] text-[#8F4E38] bg-[#E3A08A]/15',
    },
    {
      id: 'creativity',
      label: 'Creativity',
      desc: 'Art, music, writing, design, crafts',
      icon: Sparkles,
      color: 'border-[#F4C572] text-[#855D16] bg-[#F4C572]/20',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Please enter a quest title';
    } else if (title.trim().length > 120) {
      newErrors.title = 'Title must be under 120 characters';
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

    // Reset fields
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
      title="Add New Quest ✍️"
      subtitle="Define a goal to expand your study nook and level up your skills"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <Input
          label="Quest Title *"
          placeholder="e.g. Read 2 chapters of Machine Learning book"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          required
        />

        {/* Description */}
        <Textarea
          label="Quest Notes (Optional)"
          placeholder="Breakdown of specific sections, links, or cozy goals..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />

        {/* Skill Category Selector */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[#78665B] block mb-2">
            Skill Category
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
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? `${cat.color} ring-2 ring-[#E3A08A]/40 font-semibold shadow-sm`
                      : 'border-[#E4D3BE] bg-[#FAF3E8]/80 hover:bg-[#F0E4D3] text-[#3A2E27]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-bold">{cat.label}</span>
                  </div>
                  <span className="text-[10px] text-[#78665B] line-clamp-1 leading-tight">
                    {cat.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Due Date & Recurring Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <Input
            label="Target Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2.5 p-2.5 bg-[#FAF3E8] border border-[#E4D3BE] rounded-xl cursor-pointer hover:bg-[#F0E4D3] transition-colors">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-4 h-4 rounded text-[#E3A08A] focus:ring-[#E3A08A] accent-[#E3A08A]"
              />
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#3A2E27]">
                <Repeat className="w-3.5 h-3.5 text-[#9CAF88]" />
                <span>Daily Habit Quest</span>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E4D3BE]">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Posting Quest...' : 'Add to Quest Log 📜'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
