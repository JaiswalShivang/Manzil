import React from 'react';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';

export const LandingPage = () => {
  // Mock sample user to show an inviting preview of the room
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

  return (
    <div className="flex flex-col gap-16 sm:gap-24 py-6 sm:py-12">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E3A08A]/20 border border-[#E3A08A]/40 text-xs font-bold text-[#3A2E27] mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#E3A08A]" />
          <span>The Cozy Lo-Fi Gamified Productivity App</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#3A2E27] tracking-tight max-w-4xl font-sans leading-[1.15]">
          Turn your daily study goals into a{' '}
          <span className="text-[#E3A08A] underline decoration-[#F4C572] decoration-wavy decoration-2">
            cozy RPG journey
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-[#78665B] max-w-2xl font-normal leading-relaxed">
          Complete real-world habits, study sessions, and projects. Earn Focus Points, level up your
          character, and watch your personal study room bloom with plants, warm lights, and decorations.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link to="/register" className="w-full sm:w-auto">
            <Button size="lg" variant="primary" className="w-full sm:w-auto text-base px-8 py-3.5 shadow-md font-bold">
              Start Your Quest — It's Free ✍️
            </Button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base px-6 py-3.5">
              Enter Existing Nook
            </Button>
          </Link>
        </div>

        {/* Ambient Room Interactive Preview */}
        <div className="mt-14 w-full max-w-4xl mx-auto transform hover:scale-[1.01] transition-transform duration-300">
          <div className="text-left mb-2 flex items-center justify-between text-xs text-[#78665B]">
            <span className="font-handwritten text-base font-semibold">✨ Live Study Nook Preview (Try clicking the lamp & rain!)</span>
            <span>Interactive Demo Scene</span>
          </div>
          <StudyRoomScene user={demoUser} />
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#3A2E27] tracking-tight">
            Designed for calm, consistent progress
          </h2>
          <p className="mt-2 text-sm text-[#78665B]">
            No cold dashboards or anxiety-inducing streak alerts. Just a peaceful study space that rewards your daily focus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[#F0E4D3] border border-[#E4D3BE] rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#E3A08A]/20 flex items-center justify-center text-2xl mb-4">
              📜
            </div>
            <h3 className="text-lg font-bold text-[#3A2E27] mb-2 font-sans">
              Quest Log & Focus Points
            </h3>
            <p className="text-xs text-[#78665B] leading-relaxed">
              Every task is a quest. Tag your goals with Intellect, Vitality, Discipline, or Creativity and watch your stats grow with each checkmark.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#F0E4D3] border border-[#E4D3BE] rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#9CAF88]/25 flex items-center justify-center text-2xl mb-4">
              🪴
            </div>
            <h3 className="text-lg font-bold text-[#3A2E27] mb-2 font-sans">
              Visual Room Progression
            </h3>
            <p className="text-xs text-[#78665B] leading-relaxed">
              Your character isn't a pixel warrior — it's your personal study nook. Leveling up unlocks lush monstera plants, retro lamps, and cozy rugs.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#F0E4D3] border border-[#E4D3BE] rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#F4C572]/25 flex items-center justify-center text-2xl mb-4">
              ☕
            </div>
            <h3 className="text-lg font-bold text-[#3A2E27] mb-2 font-sans">
              The Cozy Corner Shop
            </h3>
            <p className="text-xs text-[#78665B] leading-relaxed">
              Earn Cozy Coins securely by completing real work. Spend your earnings on handcrafted decorations that physically populate your study desk.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-5xl mx-auto px-4 w-full">
        <div className="bg-gradient-to-br from-[#F0E4D3] to-[#E5D5C2] border border-[#E3A08A]/40 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-[0_12px_36px_rgba(58,46,39,0.08)]">
          <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
            <span className="text-3xl mb-3">🕯️</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3A2E27]">
              Ready to begin your study quest?
            </h2>
            <p className="mt-3 text-sm text-[#78665B] mb-6">
              Step inside your personal study room. Start with 60 complimentary Cozy Coins and set your first focus goal today.
            </p>
            <Link to="/register">
              <Button size="lg" variant="primary" className="font-bold px-8 shadow-md">
                Claim Your Study Nook <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
