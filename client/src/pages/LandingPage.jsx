import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { StudyRoomScene } from '../components/room/StudyRoomScene';
import {
  Sparkles,
  Flame,
  Store,
  Compass,
  CheckCircle2,
  Coffee,
  Heart,
  BookOpen,
  ArrowRight,
  Shield,
  ScrollText,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';

// Animated Count-Up Number Component
const AnimatedCounter = ({ target, suffix = '', label }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;
    let start = 0;
    const duration = 1800;
    const steps = 60;
    const stepTime = duration / steps;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [hasStarted, target]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      onViewportEnter={() => setHasStarted(true)}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-center p-4"
    >
      <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#3A2E27] tracking-tight font-sans">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-xs sm:text-sm font-semibold text-[#78665B] mt-1.5">
        {label}
      </div>
    </motion.div>
  );
};

export const LandingPage = () => {
  // Demo user showing equipped decorations in preview
  const demoUser = {
    username: 'Lofi Scholar',
    level: 3,
    inventory: [
      { equipped: true, itemId: { category: 'plant', imageKey: 'monstera' } },
      { equipped: true, itemId: { category: 'poster', imageKey: 'lofi_cat_window' } },
      { equipped: true, itemId: { category: 'rug', imageKey: 'boho_woven_rug' } },
      { equipped: true, itemId: { category: 'mug', imageKey: 'terracotta_tea_cup' } },
    ],
  };

  // State for interactive "How It Works" tab
  const [activeStep, setActiveStep] = useState(0);

  // State for interactive live skill meter preview
  const [skillProgress, setSkillProgress] = useState({
    intellect: 85,
    vitality: 55,
    discipline: 70,
    creativity: 60,
  });
  const [simulatedCount, setSimulatedCount] = useState(0);

  const simulateQuestCompletion = () => {
    setSkillProgress((prev) => ({
      intellect: Math.min(100, prev.intellect + 5),
      vitality: Math.min(100, prev.vitality + 8),
      discipline: Math.min(100, prev.discipline + 6),
      creativity: Math.min(100, prev.creativity + 7),
    }));
    setSimulatedCount((c) => c + 1);
  };

  const steps = [
    {
      step: '01',
      title: 'Log a Quest',
      desc: 'Turn any real-world habit, coding sprint, or reading goal into an RPG quest in seconds.',
      detail: 'Choose a skill category: Intellect, Vitality, Discipline, or Creativity.',
      icon: '✍️',
      badge: 'Step 1: Set Goals',
    },
    {
      step: '02',
      title: 'Complete & Focus',
      desc: 'Work on your task with cozy ambient sound and check it off when you finish.',
      detail: 'Earn Focus Points (XP) and Cozy Coins with non-linear leveling math.',
      icon: '✨',
      badge: 'Step 2: Earn Rewards',
    },
    {
      step: '03',
      title: 'Watch Your Room Bloom',
      desc: 'Level up your space and spend your coins in The Cozy Corner Shop.',
      detail: 'Equip lush monstera plants, retro lamps, and wall art that render directly in your room.',
      icon: '🪴',
      badge: 'Step 3: Furnish Room',
    },
  ];

  return (
    <div className="relative overflow-hidden flex flex-col gap-20 sm:gap-28 py-6 sm:py-12">
      {/* Soft Ambient Glow Blobs Behind Hero */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-br from-[#F4C572]/20 via-[#E3A08A]/15 to-[#B9A6D9]/15 blur-3xl -z-10 rounded-full" />
      <div className="pointer-events-none absolute top-[700px] right-0 w-[450px] h-[450px] bg-[#9CAF88]/15 blur-3xl -z-10 rounded-full" />
      <div className="pointer-events-none absolute top-[1600px] left-0 w-[500px] h-[500px] bg-[#F4C572]/15 blur-3xl -z-10 rounded-full" />

      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center relative">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E3A08A]/20 border border-[#E3A08A]/40 text-xs font-bold text-[#3A2E27] mb-6 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E3A08A]" />
          <span>The Cozy Lo-Fi Gamified Productivity App</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#3A2E27] tracking-tight max-w-4xl font-sans leading-[1.08]"
        >
          Turn your daily study goals into a{' '}
          <span className="relative inline-block text-[#E3A08A]">
            cozy RPG journey
            {/* Hand-drawn underline accent */}
            <svg
              className="absolute -bottom-2.5 left-0 w-full h-3 text-[#F4C572] pointer-events-none"
              viewBox="0 0 250 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 8.5C50 2 150 2 247 8.5"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-[#78665B] max-w-2xl font-normal leading-relaxed"
        >
          Complete real-world habits, study sessions, and projects. Earn Focus Points, level up your
          space, and watch your personal study room bloom with plants, warm lights, and decorations.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link to="/register" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="primary"
              className="w-full sm:w-auto text-base px-8 py-3.5 shadow-[0_6px_20px_rgba(227,160,138,0.35)] hover:shadow-[0_8px_25px_rgba(227,160,138,0.45)] font-bold transition-all"
            >
              Start Your Quest — It's Free ✍️
            </Button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto text-base px-7 py-3.5 shadow-xs"
            >
              Enter Existing Nook
            </Button>
          </Link>
        </motion.div>

        {/* Interactive Demo Room Section with Dual Shadows & Glow */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-14 w-full max-w-4xl mx-auto relative"
        >
          {/* Warm Backdrop Glow behind demo */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F4C572]/20 via-[#E3A08A]/15 to-[#B9A6D9]/20 blur-2xl -z-10 rounded-3xl transform scale-95" />

          <div className="text-left mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-[#78665B] px-1">
            <span className="font-handwritten text-base font-bold text-[#3A2E27] flex items-center gap-1.5">
              <span>✨</span>
              <span>Interactive Study Nook (Try hovering books, clicking the cat poster, plant & lamp!)</span>
            </span>
            <span className="text-[11px] bg-[#F0E4D3] px-2.5 py-0.5 rounded-full border border-[#E4D3BE]">
              Live Interactive Room Demo
            </span>
          </div>

          <StudyRoomScene user={demoUser} />
        </motion.div>
      </section>

      {/* 2. "HOW IT WORKS" — 3-STEP HORIZONTAL TIMELINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E3A08A] block mb-1">
            The Gameplay Loop
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3A2E27] tracking-tight">
            How Life RPG Works
          </h2>
          <p className="mt-2 text-sm text-[#78665B]">
            Three gentle steps turning everyday effort into an evolving sanctuary.
          </p>
        </div>

        {/* Timeline Horizontal Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Dashed connector line between stages (desktop only) */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 border-t-2 border-dashed border-[#E4D3BE] -z-10" />

          {steps.map((item, idx) => {
            const isSelected = activeStep === idx;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                onClick={() => setActiveStep(idx)}
                className={`relative rounded-3xl p-6 sm:p-7 border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#F0E4D3] border-[#E3A08A] shadow-[0_8px_24px_rgba(58,46,39,0.1)] -translate-y-1.5'
                    : 'bg-[#FAF3E8] border-[#E4D3BE] hover:bg-[#F0E4D3]/70 hover:-translate-y-1'
                }`}
              >
                <div>
                  {/* Step Numeral Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-xs transition-colors ${
                        isSelected
                          ? 'bg-[#E3A08A] text-[#3A2E27] shadow-[0_4px_12px_rgba(227,160,138,0.3)]'
                          : 'bg-[#F0E4D3] text-[#78665B] border border-[#E4D3BE]'
                      }`}
                    >
                      {item.step}
                    </div>
                    <span className="text-2xl">{item.icon}</span>
                  </div>

                  <span className="text-[11px] font-bold text-[#E3A08A] uppercase tracking-wider block mb-1">
                    {item.badge}
                  </span>
                  <h3 className="text-xl font-bold text-[#3A2E27] mb-2 font-sans">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#78665B] leading-relaxed mb-3">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E4D3BE]/60 text-[11px] text-[#3A2E27] font-medium bg-[#FAF3E8]/60 p-2.5 rounded-xl">
                  💡 {item.detail}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURE SHOWCASE GRID (2x2 with Staggered Cascades) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#9CAF88] block mb-1">
            Built for Study & Life
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3A2E27] tracking-tight">
            Features Crafted for Deep Focus
          </h2>
          <p className="mt-2 text-sm text-[#78665B]">
            Every system works harmoniously to keep you inspired, mindful, and consistent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature Card 1: Quest Log */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-[#F0E4D3] border border-[#E4D3BE] rounded-3xl p-7 shadow-[0_4px_16px_rgba(58,46,39,0.06),0_12px_28px_rgba(58,46,39,0.08)] hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#E3A08A]/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              📜
            </div>
            <h3 className="text-xl font-bold text-[#3A2E27] mb-2 font-sans">
              Sticky-Note Quest Log
            </h3>
            <p className="text-xs text-[#78665B] leading-relaxed mb-4">
              Capture tasks in a warm journal layout. Tag quests with Intellect, Vitality, Discipline, or Creativity.
              Supports recurring daily habit tracking with instant optimistic UI updates.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#8F4E38]">
              <CheckCircle2 className="w-4 h-4 text-[#E3A08A]" />
              <span>Zero client math cheating — server-calculated rewards</span>
            </div>
          </motion.div>

          {/* Feature Card 2: Skill Meters */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#F0E4D3] border border-[#E4D3BE] rounded-3xl p-7 shadow-[0_4px_16px_rgba(58,46,39,0.06),0_12px_28px_rgba(58,46,39,0.08)] hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#9CAF88]/25 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              📊
            </div>
            <h3 className="text-xl font-bold text-[#3A2E27] mb-2 font-sans">
              4 RPG Skill Meters
            </h3>
            <p className="text-xs text-[#78665B] leading-relaxed mb-4">
              Track multi-dimensional growth. Coding and reading build <strong>Intellect</strong>, workouts fuel <strong>Vitality</strong>, daily routines fortify <strong>Discipline</strong>, and art cultivates <strong>Creativity</strong>.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#4D6339]">
              <Heart className="w-4 h-4 text-[#9CAF88]" />
              <span>Balanced lifestyle progression without burnout</span>
            </div>
          </motion.div>

          {/* Feature Card 3: Streaks */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#F0E4D3] border border-[#E4D3BE] rounded-3xl p-7 shadow-[0_4px_16px_rgba(58,46,39,0.06),0_12px_28px_rgba(58,46,39,0.08)] hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#F4C572]/25 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              🔥
            </div>
            <h3 className="text-xl font-bold text-[#3A2E27] mb-2 font-sans">
              Gentle Calendar Streaks
            </h3>
            <p className="text-xs text-[#78665B] leading-relaxed mb-4">
              Celebrate consistency without punitive dread. Track consecutive calendar study days and unlock bonus Cozy Coins and XP at 3, 7, 14, and 30-day milestones.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#855D16]">
              <Flame className="w-4 h-4 text-[#F4C572]" />
              <span>Milestone bonuses with cheerful animations</span>
            </div>
          </motion.div>

          {/* Feature Card 4: Cozy Shop */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[#F0E4D3] border border-[#E4D3BE] rounded-3xl p-7 shadow-[0_4px_16px_rgba(58,46,39,0.06),0_12px_28px_rgba(58,46,39,0.08)] hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#B9A6D9]/25 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              🪴
            </div>
            <h3 className="text-xl font-bold text-[#3A2E27] mb-2 font-sans">
              The Cozy Corner Shop
            </h3>
            <p className="text-xs text-[#78665B] leading-relaxed mb-4">
              Spend coins earned through genuine productivity. Unlock 21+ room decorations including lush monstera plants, retro lava lamps, woven jute rugs, and warm tea mugs.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#6B568E]">
              <Store className="w-4 h-4 text-[#B9A6D9]" />
              <span>Items physically render in your study room scene</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. SOCIAL PROOF & STATS STRIP (Animated Count-Ups) */}
      <section className="w-full bg-gradient-to-r from-[#F0E4D3] via-[#E8D9C5] to-[#F0E4D3] border-y border-[#E4D3BE] py-12 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#E4D3BE]/80">
            <AnimatedCounter target={14800} suffix="+" label="Quests Completed 📜" />
            <AnimatedCounter target={3400} suffix="+" label="Cozy Rooms Furnished 🪴" />
            <AnimatedCounter target={94} suffix="%" label="Habit Consistency 🔥" />
            <AnimatedCounter target={82500} suffix="+" label="Cozy Coins Earned 🪙" />
          </div>
        </div>
      </section>

      {/* 5. LIVE SKILL METER PREVIEW WIDGET */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-[#F0E4D3] border border-[#E4D3BE] rounded-3xl p-6 sm:p-10 shadow-[0_8px_30px_rgba(58,46,39,0.08)] flex flex-col md:flex-row items-center gap-8">
          {/* Left Column: Explainer & Interactive Button */}
          <div className="flex-1 text-left space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF3E8] border border-[#E4D3BE] text-xs font-bold text-[#3A2E27]">
              <span>🎮</span>
              <span>Interactive Simulator</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3A2E27] tracking-tight">
              Watch your skills level up in real-time
            </h2>

            <p className="text-xs sm:text-sm text-[#78665B] leading-relaxed">
              Every quest grants Focus Points to its corresponding skill. Click below to simulate completing a study session and see your skill meters respond live!
            </p>

            <div className="pt-2">
              <Button
                onClick={simulateQuestCompletion}
                variant="primary"
                size="md"
                className="font-bold shadow-md active:scale-95"
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                Simulate Quest Completion (+15 FP)
              </Button>
              {simulatedCount > 0 && (
                <span className="block text-[11px] font-handwritten text-[#E3A08A] font-bold mt-2">
                  ✨ Completed {simulatedCount} quest{simulatedCount > 1 ? 's' : ''}! Leveling up your stats...
                </span>
              )}
            </div>
          </div>

          {/* Right Column: The 4 Live Animated Skill Bars */}
          <div className="flex-1 w-full space-y-4 bg-[#FAF3E8] border border-[#E4D3BE] p-6 rounded-2xl shadow-xs">
            {/* Intellect */}
            <div>
              <div className="flex justify-between text-xs font-bold text-[#6B568E] mb-1.5">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Intellect
                </span>
                <span>{skillProgress.intellect}%</span>
              </div>
              <div className="w-full h-3 bg-[#F0E4D3] rounded-full overflow-hidden border border-[#E4D3BE]">
                <div
                  className="h-full bg-gradient-to-r from-[#B9A6D9] to-[#A28DC7] rounded-full transition-all duration-500 relative"
                  style={{ width: `${skillProgress.intellect}%` }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/70 rounded-full blur-[1px]" />
                </div>
              </div>
            </div>

            {/* Vitality */}
            <div>
              <div className="flex justify-between text-xs font-bold text-[#4D6339] mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5" /> Vitality
                </span>
                <span>{skillProgress.vitality}%</span>
              </div>
              <div className="w-full h-3 bg-[#F0E4D3] rounded-full overflow-hidden border border-[#E4D3BE]">
                <div
                  className="h-full bg-gradient-to-r from-[#9CAF88] to-[#809869] rounded-full transition-all duration-500 relative"
                  style={{ width: `${skillProgress.vitality}%` }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/70 rounded-full blur-[1px]" />
                </div>
              </div>
            </div>

            {/* Discipline */}
            <div>
              <div className="flex justify-between text-xs font-bold text-[#8F4E38] mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Discipline
                </span>
                <span>{skillProgress.discipline}%</span>
              </div>
              <div className="w-full h-3 bg-[#F0E4D3] rounded-full overflow-hidden border border-[#E4D3BE]">
                <div
                  className="h-full bg-gradient-to-r from-[#E3A08A] to-[#D58C74] rounded-full transition-all duration-500 relative"
                  style={{ width: `${skillProgress.discipline}%` }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/70 rounded-full blur-[1px]" />
                </div>
              </div>
            </div>

            {/* Creativity */}
            <div>
              <div className="flex justify-between text-xs font-bold text-[#855D16] mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Creativity
                </span>
                <span>{skillProgress.creativity}%</span>
              </div>
              <div className="w-full h-3 bg-[#F0E4D3] rounded-full overflow-hidden border border-[#E4D3BE]">
                <div
                  className="h-full bg-gradient-to-r from-[#F4C572] to-[#E3A08A] rounded-full transition-all duration-500 relative"
                  style={{ width: `${skillProgress.creativity}%` }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/70 rounded-full blur-[1px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL FULL-BLEED CTA BAND WITH DECORATIVE ACCENTS */}
      <section className="max-w-5xl mx-auto px-4 w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-[#F0E4D3] via-[#E8D9C5] to-[#DFCCB4] border border-[#E3A08A]/50 rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden shadow-[0_16px_40px_rgba(58,46,39,0.12)]"
        >
          {/* Decorative corner illustrations */}
          <div className="absolute -bottom-6 -left-6 text-7xl opacity-20 pointer-events-none select-none">
            🪴
          </div>
          <div className="absolute -top-6 -right-6 text-7xl opacity-20 pointer-events-none select-none">
            🕯️
          </div>

          <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
            <span className="text-4xl mb-3 animate-bounce">☕</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3A2E27] tracking-tight">
              Ready to start your cozy quest?
            </h2>
            <p className="mt-3 text-sm text-[#78665B] mb-8 leading-relaxed">
              Step inside your personal study room. Start with Level 1, 60 complimentary Cozy Coins, and claim your quiet sanctuary today.
            </p>
            <Link to="/register">
              <Button
                size="lg"
                variant="primary"
                className="font-bold text-base px-9 py-4 shadow-[0_6px_25px_rgba(227,160,138,0.4)] hover:shadow-[0_8px_30px_rgba(227,160,138,0.5)] transition-all"
              >
                Claim Your Study Nook Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
