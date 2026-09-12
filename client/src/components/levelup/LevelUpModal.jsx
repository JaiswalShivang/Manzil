import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Sparkles, Coins, ArrowRight, Award } from 'lucide-react';

export const LevelUpModal = ({ isOpen, onClose, newLevel, bonusCoins = 25 }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm">
      <div className="text-center py-4 flex flex-col items-center">
        {/* Warm ambient glowing badge */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#F4C572] to-[#E3A08A] flex items-center justify-center shadow-[0_0_35px_rgba(244,197,114,0.6)] animate-pulse">
            <Sparkles className="w-12 h-12 text-[#3A2E27]" />
          </div>
          <div className="absolute -bottom-2 bg-[#FAF3E8] border border-[#E3A08A] px-3 py-0.5 rounded-full text-xs font-bold text-[#3A2E27] shadow-sm">
            LEVEL UP!
          </div>
        </div>

        <h3 className="text-2xl font-extrabold text-[#3A2E27] tracking-tight">
          Level {newLevel} Reached! 🎉
        </h3>
        <p className="text-sm text-[#78665B] mt-1 px-4 font-sans">
          Your focus and dedication are transforming your study nook into a peaceful sanctuary.
        </p>

        {/* Level Up Rewards */}
        <div className="w-full bg-[#F0E4D3]/70 border border-[#E4D3BE] rounded-2xl p-4 my-5 flex items-center justify-around">
          <div className="flex flex-col items-center">
            <span className="text-xs text-[#78665B]">Level Bonus</span>
            <div className="flex items-center gap-1 font-bold text-sm text-[#855D16] mt-0.5">
              <Coins className="w-4 h-4 text-[#855D16]" />
              <span>+{bonusCoins} Coins</span>
            </div>
          </div>
          <div className="w-px h-8 bg-[#E4D3BE]" />
          <div className="flex flex-col items-center">
            <span className="text-xs text-[#78665B]">Shop Unlocks</span>
            <div className="flex items-center gap-1 font-bold text-sm text-[#4D6339] mt-0.5">
              <Award className="w-4 h-4 text-[#4D6339]" />
              <span>New Items!</span>
            </div>
          </div>
        </div>

        <Button
          onClick={onClose}
          variant="primary"
          size="lg"
          className="w-full justify-center text-sm font-bold"
        >
          Continue My Journey <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </Modal>
  );
};
