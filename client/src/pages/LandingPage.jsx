import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/avatar/Avatar';
import {
  BookOpen,
  Heart,
  Shield,
  Sparkles,
  Flame,
  Coins,
  ArrowRight,
  Check,
  Zap,
} from 'lucide-react';

export const LandingPage = () => {
  // Live interactive loadout switcher for the hero avatar
  const [activeLoadout, setActiveLoadout] = useState('vanguard');

  const loadouts = {
    vanguard: {
      label: 'VANGUARD',
      hair: '/assets/hair/hair-curly.webp',
      chest: '/assets/chest/shirt-red.webp',
      pants: '/assets/pants/pants-blue.webp',
      shoes: '/assets/shoes/shoes-black.webp',
      weapon: '/assets/weapon/sword-red.webp',
      aura: '/assets/aura/magic-copper.webp',
    },
    scholar: {
      label: 'SCHOLAR',
      hair: '/assets/hair/hair-bob.webp',
      chest: '/assets/chest/shirt-blue.webp',
      pants: '/assets/pants/pants-yellow.webp',
      shoes: '/assets/shoes/shoes-black.webp',
      weapon: '/assets/weapon/scythe.webp',
      aura: '/assets/aura/crystal-green.webp',
    },
    artisan: {
      label: 'ARTISAN',
      hair: '/assets/hair/hair-buzzcut.webp',
      chest: '/assets/chest/shirt-yellow.webp',
      pants: '/assets/pants/pants-red.webp',
      shoes: '/assets/shoes/shoes-black.webp',
      weapon: '/assets/weapon/sword-blue.webp',
      aura: '/assets/aura/crystal-orange.webp',
    },
  };

  const currentGear = loadouts[activeLoadout];

  const features = [
    {
      step: '01',
      title: 'Daily Directives',
      tag: 'QUESTS',
      color: '#2B4AE8',
      desc: 'Turn coding sprints, workouts, and study sessions into structured quests. Earn server-verified XP and Gold upon completion.',
    },
    {
      step: '02',
      title: 'Modular Paperdoll Rig',
      tag: 'GEAR',
      color: '#E8402C',
      desc: 'Spend your hard-earned gold in The Vault. Equip weapons, armor, hair, and mythical auras with live walk animations.',
    },
    {
      step: '03',
      title: 'Discipline Multipliers',
      tag: 'STREAKS',
      color: '#F2B705',
      desc: 'Build consistency that compounds. Maintain unbroken streaks across calendar days to unlock milestone reward bonuses.',
    },
  ];

  const attributes = [
    {
      name: 'Intellect',
      icon: BookOpen,
      color: 'bg-[#2B4AE8]',
      textColor: 'text-[#2B4AE8]',
      meter: 82,
      gain: '+15 LOGIC',
      desc: 'Coding, algorithmic logic, reading, and deep analytical work.',
    },
    {
      name: 'Vitality',
      icon: Heart,
      color: 'bg-[#E8402C]',
      textColor: 'text-[#E8402C]',
      meter: 68,
      gain: '+20 STAMINA',
      desc: 'Workouts, cardio, hydration, sleep hygiene, and nutrition.',
    },
    {
      name: 'Discipline',
      icon: Shield,
      color: 'bg-[#141414]',
      textColor: 'text-[#141414]',
      meter: 92,
      gain: '+25 FOCUS',
      desc: 'Zero-drift habit maintenance, punctuality, and focus blocks.',
    },
    {
      name: 'Creativity',
      icon: Sparkles,
      color: 'bg-[#F2B705]',
      textColor: 'text-[#B88700]',
      meter: 74,
      gain: '+10 DESIGN',
      desc: 'Design, writing, drafting architecture, and expressive output.',
    },
  ];

  return (
    <div className="flex flex-col bg-[#F5F3EF] text-[#141414] relative selection:bg-[#E8402C] selection:text-white">

      {/* ------------------------------------------------------------- */}
      {/* 1. HERO: BOLD, DIRECT, INTERACTIVE */}
      {/* ------------------------------------------------------------- */}
      <section className="border-b-3 border-[#141414] pt-12 sm:pt-20 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-[#F5F3EF]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 bg-[#141414] text-[#F5F3EF] px-3.5 py-1 text-xs font-mono font-black tracking-widest uppercase border-2 border-[#141414] mb-6 shadow-brutal-sm">
              <span className="w-2 h-2 bg-[#E8402C] animate-pulse" />
              <span>MANZIL // GAMIFIED LIFE RPG</span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black font-space tracking-tight uppercase leading-[0.92] text-[#141414] mb-6">
              STOP DRIFTING.{' '}
              <span className="bg-[#E8402C] text-[#F5F3EF] px-3 py-0.5 inline-block shadow-brutal mt-1 sm:mt-0">
                LEVEL UP.
              </span>
            </h1>

            <p className="text-base sm:text-lg font-mono text-[#141414]/80 max-w-xl leading-relaxed mb-8">
              Transform real-world study, workouts, and daily habits into verifiable character stats, gold rewards, and an evolving animated paperdoll avatar.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-8">
              <Link to="/register">
                <Button size="lg" variant="primary" className="text-base font-black px-8 py-4 font-mono shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2">
                  COMMISSION OPERATIVE <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="secondary" className="text-base font-black px-8 py-4 font-mono cursor-pointer">
                  ACCESS RIG
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-mono font-bold uppercase tracking-wider text-[#141414]/70">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#2B4AE8] stroke-[3]" /> FREE & OPEN DEMO
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#E8402C] stroke-[3]" /> 6-LAYER PAPERDOLL RIG
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#F2B705] stroke-[3]" /> ANTI-CHEAT VERIFICATION
              </span>
            </div>
          </div>

          {/* Right Column: Live Paperdoll Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-sm bg-white border-3 border-[#141414] shadow-brutal-lg p-5 relative">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#141414]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#E8402C]" />
                  <span className="text-xs font-mono font-black uppercase text-[#141414]">
                    ACTIVE OPERATIVE
                  </span>
                </div>
                <span className="text-[10px] font-mono font-black bg-[#141414] text-white px-2 py-0.5 uppercase">
                  LVL 04
                </span>
              </div>

              {/* Character Stage */}
              <div className="w-full bg-[#2B4AE8] border-3 border-[#141414] shadow-brutal flex items-center justify-center p-4 mb-4 relative overflow-hidden h-64">
                {/* Clean Bauhaus Geometric Backdrop */}
                <div className="absolute top-2 right-2 w-20 h-20 bg-[#F2B705] border-2 border-[#141414] -rotate-6 opacity-40 pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-16 h-16 bg-[#E8402C] border-2 border-[#141414] rotate-12 opacity-40 pointer-events-none" />

                {/* Animated Avatar */}
                <Avatar
                  equipped={{
                    hair: currentGear.hair,
                    chest: currentGear.chest,
                    pants: currentGear.pants,
                    shoes: currentGear.shoes,
                    weapon: currentGear.weapon,
                    aura: currentGear.aura,
                  }}
                  scale={3.6}
                  className="z-10"
                />
              </div>

              {/* Preset Switcher */}
              <div className="space-y-1.5 mb-4">
                <span className="text-[10px] font-mono font-bold text-[#141414]/70 uppercase block">
                  DEMO LOADOUT PRESETS:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(loadouts).map(([key, item]) => (
                    <button
                      key={key}
                      onClick={() => setActiveLoadout(key)}
                      className={`py-1.5 px-2 border-2 border-[#141414] font-mono text-xs font-black uppercase cursor-pointer text-center transition-none ${
                        activeLoadout === key
                          ? 'bg-[#141414] text-white shadow-brutal-sm'
                          : 'bg-[#F5F3EF] text-[#141414] hover:bg-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats Bar */}
              <div className="pt-3 border-t-2 border-[#141414]/20 flex items-center justify-between text-xs font-mono font-bold">
                <span className="flex items-center gap-1 text-[#E8402C]">
                  <Flame className="w-3.5 h-3.5 fill-current" /> 14D STREAK
                </span>
                <span className="flex items-center gap-1 text-[#141414]">
                  <Coins className="w-3.5 h-3.5 text-[#F2B705] fill-current" /> 210 GOLD
                </span>
                <span className="text-[#2B4AE8] flex items-center gap-0.5">
                  <Zap className="w-3 h-3 fill-current" /> +45 XP
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. CORE FEATURES: CLEAN 3-COLUMN GRID */}
      {/* ------------------------------------------------------------- */}
      <section className="border-b-3 border-[#141414] py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b-3 border-[#141414]">
            <div>
              <span className="text-xs font-mono font-bold text-[#E8402C] uppercase tracking-wider block mb-1">
                // SYSTEM ARCHITECTURE
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-space tracking-tight uppercase text-[#141414]">
                HOW MANZIL WORKS
              </h2>
            </div>
            <p className="text-xs font-mono font-bold uppercase text-[#141414]/60 max-w-xs">
              SIMPLE RULES. REAL CONSISTENCY. VISUAL PROGRESSION.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat) => (
              <div
                key={feat.step}
                className="bg-[#FAF3E8] border-3 border-[#141414] p-6 shadow-brutal flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black font-space" style={{ color: feat.color }}>
                      {feat.step}
                    </span>
                    <span
                      className="px-2 py-0.5 text-[10px] font-mono font-black uppercase text-white border border-[#141414]"
                      style={{ backgroundColor: feat.color }}
                    >
                      {feat.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-black font-space uppercase mb-2 text-[#141414]">
                    {feat.title}
                  </h3>
                  <p className="text-xs font-mono text-[#141414]/80 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* KINETIC BAUHAUS TICKER STRIP */}
      {/* ------------------------------------------------------------- */}
      <div className="border-b-3 border-[#141414] bg-[#F2B705] text-[#141414] py-3 overflow-hidden select-none font-mono font-black text-xs uppercase tracking-widest">
        <motion.div
          className="flex whitespace-nowrap gap-8"
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
        >
          {Array.from({ length: 4 }).flatMap(() => [
            '★ LEVEL 01 COMMISSION',
            '// SERVER-VERIFIED REWARDS',
            '★ 6-LAYER MODULAR SPRITE RIG',
            '// EXPONENTIAL PROGRESSION',
            '★ CALENDAR-DAY STREAK CADENCE',
            '// ZERO DRIFT DISCIPLINE',
          ]).map((text, i) => (
            <span key={i} className="inline-flex items-center gap-2">
              {text}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. FOUR ATTRIBUTE VECTORS: ANIMATED & INTERACTIVE */}
      {/* ------------------------------------------------------------- */}
      <section className="border-b-3 border-[#141414] py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#F5F3EF]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 pb-4 border-b-3 border-[#141414] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#2B4AE8] uppercase tracking-wider block mb-1">
                // TELEMETRY VECTORS
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-space tracking-tight uppercase text-[#141414]">
                4 CHARACTER ATTRIBUTES
              </h2>
            </div>
            <p className="text-xs font-mono font-bold text-[#141414]/60 uppercase tracking-wider">
              EVERY COMPLETED QUEST DIRECTLY EMPOWERS ONE VECTOR
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {attributes.map((attr, idx) => {
              const Icon = attr.icon;
              return (
                <motion.div
                  key={attr.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: idx * 0.1, ease: 'easeOut' }}
                  whileHover={{ y: -6, transition: { duration: 0.15 } }}
                  className="bg-white border-3 border-[#141414] p-5 shadow-brutal flex flex-col justify-between group cursor-default hover:shadow-brutal-lg transition-shadow"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 ${attr.color} text-white border border-[#141414] group-hover:scale-105 transition-transform`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="font-black text-sm font-space uppercase text-[#141414]">
                          {attr.name}
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono font-black uppercase px-1.5 py-0.5 border border-[#141414] bg-[#FAF3E8]">
                        {attr.gain}
                      </span>
                    </div>

                    <p className="text-xs font-mono text-[#141414]/75 leading-relaxed mb-4">
                      {attr.desc}
                    </p>
                  </div>

                  {/* Animated Attribute Meter Bar */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#141414]/60 mb-1.5">
                      <span>BASE CAP: 150</span>
                      <span className="font-black text-[#141414]">{attr.meter}%</span>
                    </div>
                    <div className="w-full bg-[#E8E4DC] h-2.5 border-2 border-[#141414] overflow-hidden p-0.5">
                      <motion.div
                        className={`h-full ${attr.color}`}
                        initial={{ width: '0%' }}
                        whileInView={{ width: `${attr.meter}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. FINAL CALL TO ACTION: CRISP, KINETIC & HIGH IMPACT */}
      {/* ------------------------------------------------------------- */}
      <section className="bg-[#141414] text-[#F5F3EF] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        {/* Kinetic Geometric Background Rotations */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-16 -left-16 w-60 h-60 border-2 border-white/10 pointer-events-none"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-20 -right-20 w-72 h-72 border-2 border-[#E8402C]/20 pointer-events-none"
        />

        {/* Floating Gamified Telemetry Badges (Desktop) */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
          className="hidden xl:flex items-center gap-2 bg-[#2B4AE8] text-white px-3.5 py-2 border-2 border-white text-xs font-mono font-black shadow-brutal absolute left-12 top-1/2 -translate-y-1/2 pointer-events-none"
        >
          <Zap className="w-4 h-4 fill-current text-[#F2B705]" />
          <span>+50 XP DIRECTIVE COMPLETE</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.5 }}
          className="hidden xl:flex items-center gap-2 bg-[#E8402C] text-white px-3.5 py-2 border-2 border-white text-xs font-mono font-black shadow-brutal absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none"
        >
          <Flame className="w-4 h-4 fill-current text-[#F2B705]" />
          <span>14-DAY STREAK MULTIPLIER</span>
        </motion.div>

        <div className="max-w-2xl mx-auto flex flex-col items-center relative z-10">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-[#E8402C] text-[#F5F3EF] px-3.5 py-1.5 font-mono font-black text-xs uppercase mb-6 tracking-widest border border-white/20 shadow-brutal-sm"
          >
            <span className="w-2 h-2 bg-white rounded-full animate-ping" />
            <span>START AT LEVEL 01 // 60 GOLD STARTER VAULT</span>
          </motion.div>

          <h2 className="text-4xl sm:text-6xl font-black font-space tracking-tight uppercase leading-[0.95] mb-5">
            READY TO START LEVELING?
          </h2>

          <p className="text-sm font-mono text-[#F5F3EF]/70 max-w-md mb-8 leading-relaxed uppercase">
            Initialize your operative dossier, equip your first loadout, and forge your habit streak today.
          </p>

          <Link to="/register">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <Button
                size="lg"
                variant="primary"
                className="text-base sm:text-lg font-black font-mono px-9 py-4.5 bg-[#E8402C] text-white shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer flex items-center gap-2"
              >
                <span>COMMISSION OPERATIVE NOW</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                >
                  →
                </motion.span>
              </Button>
            </motion.div>
          </Link>
        </div>
      </section>
    </div>
  );
};
