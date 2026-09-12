import { Button } from '../ui/Button';
import { Lock, Coins, Check } from 'lucide-react';

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

  const categoryIcons = {
    plant: '🪴',
    lamp: '💡',
    poster: '🖼️',
    rug: '🧶',
    mug: '☕',
    wallpaper: '🎨',
  };

  return (
    <div
      className={`relative border-2 border-[#141414] p-5 transition-all duration-150 flex flex-col justify-between ${
        isLevelLocked
          ? 'bg-[#EBE7DF] opacity-90'
          : 'bg-white shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5'
      }`}
    >
      {/* Locked Diagonal Overlay */}
      {isLevelLocked && (
        <div className="absolute inset-0 stripes-locked flex flex-col items-center justify-center z-20 p-4 text-center">
          <div className="bg-[#E8402C] text-[#F5F3EF] border-2 border-[#141414] px-3 py-1.5 text-xs font-heading font-black uppercase shadow-brutal-sm flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>UNLOCKS AT LV. {item.unlockLevel}</span>
          </div>
        </div>
      )}

      <div>
        {/* Category & Level tag */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-heading font-black uppercase px-2 py-0.5 bg-[#141414] text-[#F5F3EF]">
            {item.category}
          </span>

          {item.unlockLevel > 1 && (
            <span className="text-[10px] font-heading font-black uppercase px-2 py-0.5 border border-[#141414] bg-[#F5F3EF] text-[#141414]">
              TIER LV. {item.unlockLevel}
            </span>
          )}
        </div>

        {/* Gear Artwork Display Box */}
        <div className="w-full h-32 bg-[#F5F3EF] border-2 border-[#141414] flex flex-col items-center justify-center mb-4 relative overflow-hidden">
          <span className="text-4xl select-none">{categoryIcons[item.category] || '📦'}</span>
          <span className="text-[10px] font-mono uppercase text-[#141414]/60 mt-1">
            {item.imageKey}
          </span>
        </div>

        {/* Name & Description */}
        <h4 className="text-sm font-heading font-black text-[#141414] mb-1 uppercase tracking-tight leading-snug">
          {item.name}
        </h4>
        <p className="text-xs font-sans text-[#141414]/80 leading-relaxed mb-4 line-clamp-2">
          {item.description}
        </p>
      </div>

      {/* Footer Price & Action */}
      <div className="pt-3 border-t-2 border-[#141414] flex items-center justify-between gap-2 mt-auto">
        <div className="bg-[#F2B705] text-[#141414] border-2 border-[#141414] px-2.5 py-1 text-xs font-heading font-black uppercase flex items-center gap-1">
          <Coins className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{item.cost} GOLD</span>
        </div>

        <div>
          {isOwned ? (
            isEquipped ? (
              <Button
                variant="ink"
                size="sm"
                onClick={() => onUnequip(item._id)}
                disabled={isProcessing}
                className="text-xs"
              >
                <Check className="w-3 h-3 stroke-[3]" /> EQUIPPED
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEquip(item._id)}
                disabled={isProcessing}
                className="text-xs font-black"
              >
                DEPLOY ⚡
              </Button>
            )
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onPurchase(item._id)}
              disabled={isLevelLocked || !canAfford || isProcessing}
              className="text-xs font-black"
            >
              {isLevelLocked ? (
                'LOCKED'
              ) : !canAfford ? (
                'NEED GOLD'
              ) : (
                'PURCHASE →'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
