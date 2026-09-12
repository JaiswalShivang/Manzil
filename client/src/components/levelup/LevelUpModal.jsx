import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ArrowRight, Coins, Award } from 'lucide-react';

export const LevelUpModal = ({ isOpen, onClose, newLevel, bonusCoins = 25 }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="text-center py-2 flex flex-col items-center">
        {/* Bauhaus Oversized Level Badge */}
        <div className="w-full bg-[#E8402C] text-[#F5F3EF] border-3 border-[#141414] py-4 px-6 mb-6 shadow-brutal">
          <span className="text-xs font-heading font-black tracking-widest uppercase block mb-1">
            TIER PROMOTION DETECTED
          </span>
          <div className="text-5xl sm:text-6xl font-heading font-black tracking-tighter uppercase">
            LEVEL {newLevel}
          </div>
        </div>

        <h3 className="text-xl font-heading font-black text-[#141414] uppercase tracking-tight mb-2">
          PROTOCOL ELEVATION CONFIRMED
        </h3>
        <p className="text-xs font-sans text-[#141414]/80 px-4 leading-relaxed mb-6">
          Your sustained output has unlocked higher clearance in The Vault and incremented your baseline capacities.
        </p>

        {/* Level Up Rewards */}
        <div className="w-full bg-white border-2 border-[#141414] p-4 mb-6 grid grid-cols-2 gap-4 shadow-brutal-sm">
          <div className="flex flex-col items-center border-r-2 border-[#141414] pr-2">
            <span className="text-[10px] font-heading font-black uppercase text-[#141414]/60">
              LEDGER CREDIT
            </span>
            <div className="flex items-center gap-1 font-heading font-black text-base text-[#141414] mt-1">
              <Coins className="w-4 h-4 text-[#F2B705]" />
              <span>+{bonusCoins} GOLD</span>
            </div>
          </div>

          <div className="flex flex-col items-center pl-2">
            <span className="text-[10px] font-heading font-black uppercase text-[#141414]/60">
              CLEARANCE TIER
            </span>
            <div className="flex items-center gap-1 font-heading font-black text-base text-[#2B4AE8] mt-1">
              <Award className="w-4 h-4 text-[#2B4AE8]" />
              <span>TIER {newLevel} GEAR</span>
            </div>
          </div>
        </div>

        <Button
          onClick={onClose}
          variant="primary"
          size="lg"
          className="w-full justify-center text-sm font-black"
        >
          RETURN TO COMMAND DECK <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </Modal>
  );
};
