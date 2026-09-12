import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { Button } from '../components/ui/Button';
import {
  Sparkles,
  Lock,
  Play,
  Pause,
  Terminal,
  Zap,
} from 'lucide-react';

const CountUpNumeral = ({ endValue, suffix = '', duration = 1.2, shouldReduceMotion = false }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (shouldReduceMotion || !isInView) return;

    let startTime = null;
    let frameId = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * endValue);
      setDisplayValue(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isInView, endValue, duration, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return (
      <span>
        {endValue.toLocaleString()}
        {suffix}
      </span>
    );
  }

  return (
    <span ref={ref}>
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
};

export const LandingPage = () => {
  const shouldReduceMotion = useReducedMotion();

  // -------------------------------------------------------------
  // HERO FEATURE: INTERACTIVE PROGRESSION PIPELINE (5 STAGES)
  // -------------------------------------------------------------
  const [pipelineStage, setPipelineStage] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  const pipelineStages = [
    {
      id: 0,
      number: '01',
      label: 'LOG A QUEST',
      short: 'INPUT',
      accent: 'bg-[#2B4AE8]',
      inputLabel: 'ACTIVE TASK INPUT',
      inputContent: {
        title: 'Complete Distributed Systems Chapter 4',
        category: 'INTELLECT',
        categoryColor: 'bg-[#2B4AE8] text-[#F5F3EF]',
        status: 'PENDING EXECUTION',
      },
      transformLabel: 'PARSING & VALIDATION',
      transformContent: 'Verifying user ownership & assigning server-side reward caps (45 XP, 25 Gold).',
      outputLabel: 'PROJECTED REWARD',
      outputContent: {
        xp: '+45 XP',
        gold: '+25 GOLD',
        stat: '+5 INTELLECT',
      },
    },
    {
      id: 1,
      number: '02',
      label: 'COMPLETE IT',
      short: 'EXECUTION',
      accent: 'bg-[#E8402C]',
      inputLabel: 'EXECUTION CHECK',
      inputContent: {
        title: 'Task Marked Complete in Log',
        category: 'INTELLECT',
        categoryColor: 'bg-[#2B4AE8] text-[#F5F3EF]',
        status: 'VERIFIED ON BACKEND',
      },
      transformLabel: 'STATE TRANSITION',
      transformContent: 'POST /api/quests/:id/complete triggered. Non-linear level formula computed in Node.js.',
      outputLabel: 'SYSTEM EVENT',
      outputContent: {
        xp: 'QUEST RESOLVED',
        gold: 'TIMESTAMP RECORDED',
        stat: 'STREAK INCREMENTED',
      },
    },
    {
      id: 2,
      number: '03',
      label: 'EARN XP & GOLD',
      short: 'PAYLOAD',
      accent: 'bg-[#F2B705]',
      inputLabel: 'LEDGER UPDATE',
      inputContent: {
        title: 'XP Overflow Evaluation',
        category: 'ECONOMY',
        categoryColor: 'bg-[#F2B705] text-[#141414]',
        status: 'CREDITING ASSETS',
      },
      transformLabel: 'MATH VERIFICATION',
      transformContent: 'Current XP (90) + Earned (45) = 135 XP. Threshold for Level 2 is 100 XP.',
      outputLabel: 'BALANCE DELTA',
      outputContent: {
        xp: '+45 XP CREDITED',
        gold: '+25 GOLD ADDED',
        stat: 'OVERFLOW: +35 XP',
      },
    },
    {
      id: 3,
      number: '04',
      label: 'LEVEL UP',
      short: 'ELEVATION',
      accent: 'bg-[#E8402C]',
      inputLabel: 'THRESHOLD CROSSING',
      inputContent: {
        title: 'Elevation to Level 2',
        category: 'PROGRESSION',
        categoryColor: 'bg-[#E8402C] text-[#F5F3EF]',
        status: 'LEVEL UNLOCKED',
      },
      transformLabel: 'PROGRESSION ENGINE',
      transformContent: 'User elevated to Level 2! Tier bonus +25 Gold credited. Vault items unlocked.',
      outputLabel: 'COMMAND SUMMARY',
      outputContent: {
        xp: 'LV. 2 CONFIRMED',
        gold: '+25 BONUS GOLD',
        stat: 'NEW ITEMS UNLOCKED',
      },
    },
    {
      id: 4,
      number: '05',
      label: 'UNLOCK GEAR',
      short: 'ACQUISITION',
      accent: 'bg-[#141414]',
      inputLabel: 'THE VAULT UNLOCKED',
      inputContent: {
        title: 'Obsidian Terminal Rig Acquired',
        category: 'HARDWARE',
        categoryColor: 'bg-[#141414] text-[#F5F3EF]',
        status: 'EQUIPPED IN HQ',
      },
      transformLabel: 'INVENTORY UPDATE',
      transformContent: 'Item purchased with verified server gold balance. HQ scene rendered with new rig.',
      outputLabel: 'ACTIVE GEAR',
      outputContent: {
        xp: 'RIG DEPLOYED',
        gold: 'INVENTORY SAVED',
        stat: 'COMMAND DECK ARMED',
      },
    },
  ];

  // Autoplay ticker
  useEffect(() => {
    if (!isAutoplay) return;
    const interval = setInterval(() => {
      setPipelineStage((prev) => (prev + 1) % pipelineStages.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isAutoplay, pipelineStages.length]);

  const activeStageData = pipelineStages[pipelineStage];

  // Sample Vault gear cards for preview
  const vaultPreviewItems = [
    {
      name: 'NEO-CONSTRUCTIVIST DESK RIG',
      category: 'HARDWARE',
      cost: 40,
      unlockLevel: 1,
      accent: 'border-[#141414]',
      isLocked: false,
    },
    {
      name: 'MONSTERA BIO-MODULE',
      category: 'BOTANICAL',
      cost: 65,
      unlockLevel: 2,
      accent: 'border-[#2B4AE8]',
      isLocked: false,
    },
    {
      name: 'BAUHAUS GRID POSTER 01',
      category: 'GRAPHIC',
      cost: 35,
      unlockLevel: 1,
      accent: 'border-[#E8402C]',
      isLocked: false,
    },
    {
      name: 'OBSIDIAN CHRONO LAMP',
      category: 'LIGHTING',
      cost: 120,
      unlockLevel: 3,
      accent: 'border-[#F2B705]',
      isLocked: true,
    },
  ];

  return (
    <div className="flex flex-col gap-0 bg-[#F5F3EF] text-[#141414] relative">
      {/* Tactile Paper Grain Noise Texture Overlay across page (2.5% opacity) */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* ------------------------------------------------------------- */}
      {/* 2. HERO SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="border-b-3 border-[#141414] pt-12 sm:pt-16 pb-10 sm:pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#F5F3EF]">
        <div className="max-w-7xl mx-auto flex flex-col items-start">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 bg-[#141414] text-[#F5F3EF] px-3.5 py-1 text-xs font-heading font-black tracking-widest uppercase border-2 border-[#141414] mb-6 shadow-brutal-sm">
            <span className="w-2 h-2 bg-[#E8402C]"></span>
            <span>THE FULL-STACK PRODUCTIVITY RPG</span>
          </div>

          {/* Oversized Uppercase Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-heading font-black tracking-tighter uppercase leading-[0.92] text-[#141414] max-w-5xl mb-6">
            STOP DRIFTING.{' '}
            <span className="relative inline-block">
              {/* Subtle Color-Block Depth Glow Behind Sharp Badge */}
              <span
                className="absolute -inset-2 bg-[#E8402C] opacity-40 blur-xl -z-10 pointer-events-none"
                aria-hidden="true"
              />
              <span
                className="absolute -inset-4 bg-[#F2B705] opacity-25 blur-2xl -z-10 pointer-events-none"
                aria-hidden="true"
              />
              <span className="bg-[#E8402C] text-[#F5F3EF] px-2 py-0 inline-block shadow-brutal relative z-0">
                START LEVELING.
              </span>
            </span>
          </h1>

          {/* One-Line Subhead */}
          <p className="text-base sm:text-xl font-sans text-[#141414]/80 max-w-2xl font-medium leading-relaxed mb-8">
            Transform real-world study goals, routines, and coding milestones into verifiable RPG character stats, server-guarded gold, and unlocked gear.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
            <Link to="/register">
              <Button size="lg" variant="primary" className="text-base font-black px-8 py-4">
                BEGIN QUEST →
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="secondary" className="text-base font-black px-8 py-4">
                LOG IN
              </Button>
            </Link>
          </div>

          {/* Meta Row */}
          <div className="w-full border-t-2 border-[#141414] pt-4 flex flex-wrap items-center gap-4 text-xs font-heading font-black uppercase tracking-wider text-[#141414]/70">
            <span>FREE TO PLAY</span>
            <span className="text-[#E8402C]">•</span>
            <span>REAL PROGRESS</span>
            <span className="text-[#E8402C]">•</span>
            <span>NO FLUFF</span>
            <span className="text-[#E8402C]">•</span>
            <span>ZERO CLIENT CHEATING</span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. INTERACTIVE PROGRESSION PIPELINE (HERO FEATURE) */}
      {/* ------------------------------------------------------------- */}
      <section className="border-b-3 border-[#141414] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="max-w-7xl mx-auto"
        >
          {/* Section Heading & Autoplay Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#E8402C] text-[#F5F3EF] px-2 py-0.5 text-[11px] font-heading font-black">
                  FEATURE 01
                </span>
                <span className="font-heading font-black text-xs uppercase tracking-widest text-[#141414]/60">
                  WORKFLOW ENGINE
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight uppercase">
                THE PROGRESSION PIPELINE
              </h2>
            </div>

            <button
              onClick={() => setIsAutoplay(!isAutoplay)}
              className="flex items-center gap-2 px-4 py-2 bg-[#F5F3EF] border-2 border-[#141414] font-heading font-black text-xs uppercase tracking-wider shadow-brutal-sm hover:bg-[#141414] hover:text-[#F5F3EF] transition-all cursor-pointer self-start sm:self-auto"
            >
              {isAutoplay ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>PAUSE PIPELINE</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>AUTOPLAY PIPELINE</span>
                </>
              )}
            </button>
          </div>

          {/* Horizontal Stepped Tracker (5 Stages) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 border-2 border-[#141414] bg-[#F5F3EF] mb-8 shadow-brutal">
            {pipelineStages.map((stage) => {
              const isActive = pipelineStage === stage.id;
              const isPast = pipelineStage > stage.id;

              return (
                <button
                  key={stage.id}
                  onClick={() => {
                    setPipelineStage(stage.id);
                    setIsAutoplay(false);
                  }}
                  className={`p-4 text-left border-r-2 border-b-2 sm:border-b-0 border-[#141414] last:border-r-0 cursor-pointer relative transition-all ${
                    isActive
                      ? 'bg-[#141414] text-[#F5F3EF]'
                      : isPast
                      ? 'bg-[#F5F3EF] text-[#141414] hover:bg-[#FAF3E8] hover:border-[#E8402C] hover:text-[#E8402C]'
                      : 'bg-white text-[#141414]/70 hover:bg-[#FAF3E8] hover:border-[#E8402C] hover:text-[#E8402C]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-lg font-heading font-black tracking-tighter ${
                        isActive ? 'text-[#E8402C]' : ''
                      }`}
                    >
                      {stage.number}
                    </span>
                    <span
                      className={`text-[9px] font-heading font-extrabold uppercase px-1.5 py-0.5 border ${
                        isActive
                          ? 'border-[#F5F3EF] bg-[#141414]'
                          : 'border-[#141414] bg-white text-[#141414]'
                      }`}
                    >
                      {stage.short}
                    </span>
                  </div>
                  <div className="font-heading font-black text-xs uppercase tracking-tight line-clamp-1">
                    {stage.label}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Live Pipeline Execution Display Panel */}
          <div className="border-3 border-[#141414] bg-[#F5F3EF] p-6 sm:p-8 shadow-brutal-lg">
            <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-[#141414]">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#E8402C]" />
                <span className="font-heading font-black text-sm uppercase tracking-wider">
                  PIPELINE STATE MONITOR — STAGE {activeStageData.number}
                </span>
              </div>
              <span className="text-xs font-heading font-bold bg-[#F2B705] text-[#141414] px-2 py-0.5 border border-[#141414]">
                STAGE: {activeStageData.label}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Input Card */}
              <div className="bg-white border-2 border-[#141414] p-5 shadow-brutal-sm card-hover-brutal">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#141414]/20">
                  <span className="text-[10px] font-heading font-black uppercase text-[#141414]/60">
                    [01] {activeStageData.inputLabel}
                  </span>
                  <span className={`text-[10px] font-heading font-black px-1.5 ${activeStageData.inputContent.categoryColor}`}>
                    {activeStageData.inputContent.category}
                  </span>
                </div>
                <h4 className="font-heading font-bold text-sm text-[#141414] mb-3 uppercase">
                  {activeStageData.inputContent.title}
                </h4>
                <span className="inline-block text-[10px] font-heading font-black px-2 py-1 bg-[#141414] text-[#F5F3EF]">
                  STATUS: {activeStageData.inputContent.status}
                </span>
              </div>

              {/* Transformation Card */}
              <div className="bg-white border-2 border-[#141414] p-5 shadow-brutal-sm card-hover-brutal">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#141414]/20">
                  <span className="text-[10px] font-heading font-black uppercase text-[#141414]/60">
                    [02] {activeStageData.transformLabel}
                  </span>
                  <Zap className="w-3.5 h-3.5 text-[#E8402C]" />
                </div>
                <p className="text-xs font-sans text-[#141414] leading-relaxed mb-3">
                  {activeStageData.transformContent}
                </p>
                <div className="text-[10px] font-heading font-black text-[#2B4AE8] uppercase">
                  ✓ FORMULA VERIFIED VIA ODM
                </div>
              </div>

              {/* Output Card */}
              <div className="bg-[#141414] text-[#F5F3EF] border-2 border-[#141414] p-5 shadow-brutal-red card-hover-brutal">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#F5F3EF]/20">
                  <span className="text-[10px] font-heading font-black uppercase text-[#F2B705]">
                    [03] {activeStageData.outputLabel}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-[#F2B705]" />
                </div>
                <div className="space-y-1.5 font-heading font-black text-xs uppercase">
                  <div className="text-[#E8402C]">{activeStageData.outputContent.xp}</div>
                  <div className="text-[#F2B705]">{activeStageData.outputContent.gold}</div>
                  <div className="text-[#F5F3EF]">{activeStageData.outputContent.stat}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. SKILL SYSTEM — "MENTAL MODEL" CARDS GRID */}
      {/* ------------------------------------------------------------- */}
      <section className="border-b-3 border-[#141414] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#F5F3EF]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <span className="bg-[#2B4AE8] text-[#F5F3EF] px-2 py-0.5 text-[11px] font-heading font-black inline-block mb-1">
              FEATURE 02
            </span>
            <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight uppercase">
              SKILL SPECIFICATIONS
            </h2>
            <p className="text-xs font-heading font-bold text-[#141414]/60 uppercase tracking-wider mt-1">
              THE 4 VECTOR METERS OF MANZIL PROGRESSION
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Intellect Card */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: shouldReduceMotion ? 0 : 0, ease: 'easeOut' }}
              className="bg-white border-2 border-[#141414] p-6 shadow-brutal relative card-hover-brutal"
            >
              {/* Corner Tag Block */}
              <div className="absolute top-0 left-0 w-8 h-8 bg-[#2B4AE8] border-r-2 border-b-2 border-[#141414] flex items-center justify-center text-[#F5F3EF] text-xs font-black">
                01
              </div>
              <div className="pt-5">
                <span className="text-[10px] font-heading font-black text-[#2B4AE8] uppercase tracking-wider block mb-1">
                  VECTOR 01
                </span>
                <h3 className="text-2xl font-heading font-black text-[#141414] mb-2 uppercase">
                  INTELLECT
                </h3>
                <p className="text-xs font-sans text-[#141414]/80 leading-relaxed mb-6">
                  Leveled by high-leverage cognitive output: algorithms, papers read, documentation mastered, and complex logic solved.
                </p>

                {/* Hard Bordered Stat Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-heading font-black uppercase">
                    <span>CAPACITY</span>
                    <span>88%</span>
                  </div>
                  <div className="w-full h-4 bg-[#F5F3EF] border-2 border-[#141414] p-0.5">
                    <div className="h-full bg-[#2B4AE8]" style={{ width: '88%' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Vitality Card */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: shouldReduceMotion ? 0 : 0.08, ease: 'easeOut' }}
              className="bg-white border-2 border-[#141414] p-6 shadow-brutal relative card-hover-brutal"
            >
              <div className="absolute top-0 left-0 w-8 h-8 bg-[#E8402C] border-r-2 border-b-2 border-[#141414] flex items-center justify-center text-[#F5F3EF] text-xs font-black">
                02
              </div>
              <div className="pt-5">
                <span className="text-[10px] font-heading font-black text-[#E8402C] uppercase tracking-wider block mb-1">
                  VECTOR 02
                </span>
                <h3 className="text-2xl font-heading font-black text-[#141414] mb-2 uppercase">
                  VITALITY
                </h3>
                <p className="text-xs font-sans text-[#141414]/80 leading-relaxed mb-6">
                  Leveled by physiological resilience: heavy lifts, aerobic runs, strict hydration protocols, and deliberate sleep hours.
                </p>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-heading font-black uppercase">
                    <span>CAPACITY</span>
                    <span>74%</span>
                  </div>
                  <div className="w-full h-4 bg-[#F5F3EF] border-2 border-[#141414] p-0.5">
                    <div className="h-full bg-[#E8402C]" style={{ width: '74%' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Discipline Card */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: shouldReduceMotion ? 0 : 0.16, ease: 'easeOut' }}
              className="bg-white border-2 border-[#141414] p-6 shadow-brutal relative card-hover-brutal"
            >
              <div className="absolute top-0 left-0 w-8 h-8 bg-[#141414] border-r-2 border-b-2 border-[#141414] flex items-center justify-center text-[#F5F3EF] text-xs font-black">
                03
              </div>
              <div className="pt-5">
                <span className="text-[10px] font-heading font-black text-[#141414] uppercase tracking-wider block mb-1">
                  VECTOR 03
                </span>
                <h3 className="text-2xl font-heading font-black text-[#141414] mb-2 uppercase">
                  DISCIPLINE
                </h3>
                <p className="text-xs font-sans text-[#141414]/80 leading-relaxed mb-6">
                  Leveled by temporal adherence: unbroken study streaks, early morning protocols, clean workspace maintenance.
                </p>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-heading font-black uppercase">
                    <span>CAPACITY</span>
                    <span>92%</span>
                  </div>
                  <div className="w-full h-4 bg-[#F5F3EF] border-2 border-[#141414] p-0.5">
                    <div className="h-full bg-[#141414]" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Creativity Card */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: shouldReduceMotion ? 0 : 0.24, ease: 'easeOut' }}
              className="bg-white border-2 border-[#141414] p-6 shadow-brutal relative card-hover-brutal"
            >
              <div className="absolute top-0 left-0 w-8 h-8 bg-[#F2B705] border-r-2 border-b-2 border-[#141414] flex items-center justify-center text-[#141414] text-xs font-black">
                04
              </div>
              <div className="pt-5">
                <span className="text-[10px] font-heading font-black text-[#F2B705] uppercase tracking-wider block mb-1">
                  VECTOR 04
                </span>
                <h3 className="text-2xl font-heading font-black text-[#141414] mb-2 uppercase">
                  CREATIVITY
                </h3>
                <p className="text-xs font-sans text-[#141414]/80 leading-relaxed mb-6">
                  Leveled by generative production: UI architecture, creative writing, musical composition, and open-source contributions.
                </p>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-heading font-black uppercase">
                    <span>CAPACITY</span>
                    <span>68%</span>
                  </div>
                  <div className="w-full h-4 bg-[#F5F3EF] border-2 border-[#141414] p-0.5">
                    <div className="h-full bg-[#F2B705]" style={{ width: '68%' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. STATS STRIP (SOLID ACCENT BAND WITH OVERSIZED NUMERALS) */}
      {/* ------------------------------------------------------------- */}
      <section className="border-b-3 border-[#141414] bg-[#E8402C] text-[#F5F3EF] py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#141414]">
            <div className="pt-4 md:pt-0 md:px-6">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight">
                <CountUpNumeral endValue={14800} suffix="+" shouldReduceMotion={shouldReduceMotion} />
              </div>
              <div className="text-xs font-heading font-extrabold uppercase tracking-widest text-[#F5F3EF]/90 mt-1">
                QUESTS COMPLETED
              </div>
            </div>

            <div className="pt-4 md:pt-0 md:px-6">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-[#F2B705]">
                <CountUpNumeral endValue={3400} suffix="+" shouldReduceMotion={shouldReduceMotion} />
              </div>
              <div className="text-xs font-heading font-extrabold uppercase tracking-widest text-[#F5F3EF]/90 mt-1">
                PLAYERS LEVELED UP
              </div>
            </div>

            <div className="pt-4 md:pt-0 md:px-6">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight">
                <CountUpNumeral endValue={94} suffix="%" shouldReduceMotion={shouldReduceMotion} />
              </div>
              <div className="text-xs font-heading font-extrabold uppercase tracking-widest text-[#F5F3EF]/90 mt-1">
                PROTOCOL ADHERENCE
              </div>
            </div>

            <div className="pt-4 md:pt-0 md:px-6">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-[#F2B705]">
                <CountUpNumeral endValue={85000} suffix="+" shouldReduceMotion={shouldReduceMotion} />
              </div>
              <div className="text-xs font-heading font-extrabold uppercase tracking-widest text-[#F5F3EF]/90 mt-1">
                GOLD DISTRIBUTED
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. THE VAULT (SHOP PREVIEW) */}
      {/* ------------------------------------------------------------- */}
      <section className="border-b-3 border-[#141414] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="bg-[#F2B705] text-[#141414] px-2 py-0.5 text-[11px] font-heading font-black inline-block mb-1">
                FEATURE 03
              </span>
              <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight uppercase">
                THE VAULT
              </h2>
              <p className="text-xs font-heading font-bold text-[#141414]/60 uppercase tracking-wider mt-1">
                CONVERT REAL OUTPUT INTO COMMAND DECK FURNISHINGS
              </p>
            </div>

            <Link to="/register">
              <Button variant="secondary" size="md" className="font-black">
                ENTER THE VAULT →
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vaultPreviewItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: shouldReduceMotion ? 0 : idx * 0.08, ease: 'easeOut' }}
                className={`bg-[#F5F3EF] border-2 ${item.accent} p-5 shadow-brutal relative flex flex-col justify-between overflow-hidden ${
                  item.isLocked ? '' : 'card-hover-brutal'
                }`}
              >
                {/* Solid Opaque Diagonal Striped Overlay for Locked Items - Zero Bleed-Through */}
                {item.isLocked && (
                  <div className="absolute inset-0 stripes-locked flex flex-col items-center justify-center z-30 p-4 text-center select-none">
                    <div className="bg-[#E8402C] text-[#F5F3EF] border-2 border-[#141414] px-3.5 py-2 text-xs font-heading font-black uppercase shadow-brutal flex items-center gap-2">
                      <Lock className="w-4 h-4 stroke-[2.5]" />
                      <span>UNLOCKS AT LV. {item.unlockLevel}</span>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-heading font-black uppercase px-2 py-0.5 bg-[#141414] text-[#F5F3EF]">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-heading font-black uppercase text-[#141414]/60">
                      LV. {item.unlockLevel}
                    </span>
                  </div>

                  {/* Gear Placeholder Art Block */}
                  <div className="w-full h-28 bg-white border-2 border-[#141414] flex items-center justify-center font-heading font-black text-3xl mb-4">
                    {idx === 0 ? '🖥️' : idx === 1 ? '🪴' : idx === 2 ? '🖼️' : '💡'}
                  </div>

                  <h4 className="font-heading font-black text-sm text-[#141414] mb-3 uppercase leading-tight">
                    {item.name}
                  </h4>
                </div>

                {/* Price Tag Badge */}
                <div className="flex items-center justify-between pt-3 border-t-2 border-[#141414]">
                  <div className="bg-[#F2B705] text-[#141414] border-2 border-[#141414] px-2.5 py-1 text-xs font-heading font-black uppercase">
                    {item.cost} GOLD
                  </div>
                  <span className="text-[11px] font-heading font-bold text-[#141414]/60">
                    GEAR TIER
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 7. STREAK PROTOCOL CALLOUT (WARNING-STYLE PROTOCOL BOX) */}
      {/* ------------------------------------------------------------- */}
      <section className="border-b-3 border-[#141414] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#F5F3EF]">
        <div className="max-w-5xl mx-auto border-3 border-[#141414] bg-white p-6 sm:p-10 shadow-brutal-lg relative">
          <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-[#141414]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#E8402C]"></span>
              <h3 className="font-heading font-black text-xl text-[#141414] uppercase tracking-tight">
                STREAK ENGAGEMENT PROTOCOL
              </h3>
            </div>
            <span className="text-xs font-heading font-black bg-[#E8402C] text-[#F5F3EF] px-2 py-0.5">
              MANDATORY RULES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-[#141414] p-4 bg-[#F5F3EF] card-hover-brutal">
              <span className="text-[10px] font-heading font-black text-[#E8402C] uppercase block mb-1">
                RULE 01
              </span>
              <h4 className="font-heading font-black text-sm uppercase mb-1">
                CALENDAR DAY SYNCHRONIZATION
              </h4>
              <p className="text-xs font-sans text-[#141414]/80 leading-relaxed">
                Streaks require minimum 1 verified quest completion per calendar day. Completing multiple quests in a single day maintains the streak without duplicate increments.
              </p>
            </div>

            <div className="border-2 border-[#141414] p-4 bg-[#F5F3EF] card-hover-brutal">
              <span className="text-[10px] font-heading font-black text-[#2B4AE8] uppercase block mb-1">
                RULE 02
              </span>
              <h4 className="font-heading font-black text-sm uppercase mb-1">
                ZERO BACKDATING TOLERANCE
              </h4>
              <p className="text-xs font-sans text-[#141414]/80 leading-relaxed">
                If a day is skipped, streak reset to 1 is enforced automatically by the server-side algorithm. No manual overrides, no excuses.
              </p>
            </div>

            <div className="border-2 border-[#141414] p-4 bg-[#F5F3EF] card-hover-brutal">
              <span className="text-[10px] font-heading font-black text-[#F2B705] uppercase block mb-1">
                RULE 03
              </span>
              <h4 className="font-heading font-black text-sm uppercase mb-1">
                TIER MILESTONE MULTIPLIERS
              </h4>
              <p className="text-xs font-sans text-[#141414]/80 leading-relaxed">
                Reaching 3, 7, 14, and 30-day milestones triggers exponential bonus XP and Gold disbursements directly into your ledger.
              </p>
            </div>

            <div className="border-2 border-[#141414] p-4 bg-[#F5F3EF] card-hover-brutal">
              <span className="text-[10px] font-heading font-black text-[#141414] uppercase block mb-1">
                RULE 04
              </span>
              <h4 className="font-heading font-black text-sm uppercase mb-1">
                CROSS-PLATFORM INTEGRITY
              </h4>
              <p className="text-xs font-sans text-[#141414]/80 leading-relaxed">
                Streak counters are secured with tamper-proof JWT authentication and verified against UTC server clocks on every request.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 8. FINAL FULL-BLEED CTA BAND */}
      {/* ------------------------------------------------------------- */}
      <section className="bg-[#141414] text-[#F5F3EF] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <div className="inline-block bg-[#E8402C] text-[#F5F3EF] px-3 py-1 font-heading font-black text-xs uppercase mb-6 tracking-widest">
            COMMAND DECK WAITING
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tighter uppercase leading-[0.95] mb-6">
            READY TO START YOUR CONSTRUCTIVIST QUEST?
          </h2>

          <p className="text-base sm:text-lg font-sans text-[#F5F3EF]/70 max-w-xl mb-10">
            Initialize your profile now. Receive 60 Gold immediately and begin executing verified tasks.
          </p>

          <Link to="/register">
            <Button
              size="lg"
              variant="primary"
              className="text-lg font-black px-10 py-5 bg-[#E8402C] text-[#F5F3EF] shadow-brutal-yellow hover:translate-x-0.5 hover:translate-y-0.5"
            >
              INITIALIZE AGENT NOW →
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};
