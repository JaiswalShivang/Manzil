import React from 'react';
import { Button } from '../ui/Button';
import { Lock, Coins, Check, Sparkles } from 'lucide-react';

export const ShopItemCard = ({
  item,
  userLevel = 1,
  userCoins = 0,
  isOwned = false,
  isEquipped = false,
  onPurchase,
  onEquip,
  onUnequip,
  isProcessing = false,
}) => {
  const isLevelLocked = userLevel < (item.unlockLevel || 1);
  const canAfford = userCoins >= item.cost;

  // Category specific preview icons/colors
  const categoryMeta = {
    plant: { icon: '🪴', color: 'bg-[#9CAF88]/15 border-[#9CAF88]/40 text-[#4D6339]' },
    lamp: { icon: '💡', color: 'bg-[#F4C572]/20 border-[#F4C572]/50 text-[#855D16]' },
    poster: { icon: '🖼️', color: 'bg-[#B9A6D9]/20 border-[#B9A6D9]/50 text-[#6B568E]' },
    rug: { icon: '🧶', color: 'bg-[#E3A08A]/20 border-[#E3A08A]/50 text-[#8F4E38]' },
    mug: { icon: '☕', color: 'bg-[#D4B996]/30 border-[#D4B996]/60 text-[#5D442E]' },
    wallpaper: { icon: '🎨', color: 'bg-[#FAF3E8] border-[#E4D3BE] text-[#3A2E27]' },
  };

  const meta = categoryMeta[item.category] || categoryMeta.plant;

  return (
    <div
      className={`group relative rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
        isLevelLocked
          ? 'bg-[#F0E4D3]/40 border-[#E4D3BE]/60 opacity-80'
          : 'bg-[#F0E4D3] border-[#E4D3BE] shadow-[0_4px_16px_rgba(58,46,39,0.06)] hover:shadow-[0_8px_24px_rgba(58,46,39,0.1)] hover:-translate-y-1'
      }`}
    >
      <div>
        {/* Category & Unlock Level pill */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border capitalize ${meta.color}`}
          >
            {item.category}
          </span>

          {item.unlockLevel > 1 && (
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                isLevelLocked
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : 'bg-[#FAF3E8] text-[#78665B] border border-[#E4D3BE]'
              }`}
            >
              {isLevelLocked && <Lock className="w-3 h-3" />}
              Lv. {item.unlockLevel}
            </span>
          )}
        </div>

        {/* Visual Preview Box */}
        <div className="w-full h-32 bg-[#FAF3E8] rounded-xl border border-[#E4D3BE] flex flex-col items-center justify-center mb-4 relative overflow-hidden group-hover:scale-[1.02] transition-transform">
          <span className="text-4xl filter drop-shadow-sm">{meta.icon}</span>
          <span className="text-[10px] text-[#78665B] font-mono mt-1 opacity-75">
            {item.imageKey}
          </span>

          {isLevelLocked && (
            <div className="absolute inset-0 bg-[#3A2E27]/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-2 text-center">
              <Lock className="w-6 h-6 mb-1 text-[#F4C572]" />
              <span className="text-xs font-bold">Unlocks at Level {item.unlockLevel}</span>
            </div>
          )}
        </div>

        {/* Name & Description */}
        <h4 className="text-base font-bold text-[#3A2E27] mb-1 font-sans">{item.name}</h4>
        <p className="text-xs text-[#78665B] leading-relaxed mb-4 line-clamp-2">
          {item.description}
        </p>
      </div>

      {/* Footer Action */}
      <div className="pt-3 border-t border-[#E4D3BE] flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-1 font-bold text-sm text-[#855D16]">
          <Coins className="w-4 h-4 text-[#F4C572]" />
          <span>{item.cost}</span>
          <span className="text-[11px] font-normal text-[#78665B]">Coins</span>
        </div>

        <div>
          {isOwned ? (
            isEquipped ? (
              <Button
                variant="sage"
                size="sm"
                onClick={() => onUnequip(item._id)}
                disabled={isProcessing}
                className="text-xs"
              >
                <Check className="w-3.5 h-3.5" /> Equipped
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEquip(item._id)}
                disabled={isProcessing}
                className="text-xs font-semibold"
              >
                Equip 🪄
              </Button>
            )
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onPurchase(item._id)}
              disabled={isLevelLocked || !canAfford || isProcessing}
              className="text-xs"
              title={!canAfford ? 'Not enough coins' : undefined}
            >
              {isLevelLocked ? (
                'Locked'
              ) : !canAfford ? (
                'Need Coins'
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> Buy
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
