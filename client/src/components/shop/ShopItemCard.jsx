import { Lock, Coins, Check, Scissors, Shirt, Footprints, Sword, Sparkles } from 'lucide-react';
import { PantsIcon } from '../ui/PantsIcon';

const slotIcons = {
  hair: Scissors,
  chest: Shirt,
  pants: PantsIcon,
  shoes: Footprints,
  weapon: Sword,
  aura: Sparkles,
  crystal: Sparkles,
};

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
  const reqLevel = item.requiredLevel || item.unlockLevel || 1;
  const cost = item.goldCost !== undefined ? item.goldCost : item.cost || 0;
  const targetSlot = item.itemType === 'crystal' ? 'aura' : item.itemType || item.slot || 'chest';

  const isLevelLocked = userLevel < reqLevel;
  const canAfford = userCoins >= cost;
  const isNewUnlock = userLevel === reqLevel;

  const Icon = slotIcons[targetSlot] || Sparkles;

  return (
    <div
      className={`relative border-3 border-[#141414] p-5 flex flex-col justify-between overflow-hidden ${
        isLevelLocked
          ? 'bg-[#141414] shadow-brutal'
          : isEquipped
          ? 'bg-[#FAF3E8] shadow-brutal-lg ring-2 ring-[#2B4AE8] card-hover-brutal'
          : 'bg-[#FAF3E8] shadow-brutal hover:bg-white card-hover-brutal'
      }`}
    >
      {/* Locked Solid Diagonal Striped Overlay - Zero Bleed-Through */}
      {isLevelLocked && (
        <div className="absolute inset-0 stripes-locked flex flex-col items-center justify-center z-30 p-4 text-center select-none">
          <div className="bg-[#E8402C] text-[#F5F3EF] border-2 border-[#141414] px-3.5 py-2 text-xs font-heading font-black uppercase shadow-brutal flex items-center gap-2">
            <Lock className="w-4 h-4 stroke-[2.5]" />
            <span>UNLOCKS AT LV. {reqLevel}</span>
          </div>
        </div>
      )}

      <div>
        {/* Slot & New Unlock badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 bg-[#141414] text-white flex items-center gap-1">
              <Icon className="w-3 h-3" />
              <span>{targetSlot === 'chest' ? 'shirt' : targetSlot}</span>
            </span>
            <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 border border-[#141414] bg-[#2B4AE8] text-white">
              LV.{reqLevel}
            </span>
          </div>

          {isNewUnlock && !isLevelLocked && (
            <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.5 bg-[#E8402C] text-white border border-[#141414]">
              NEW UNLOCK
            </span>
          )}
        </div>

        {/* Visual Sprite Representation Box */}
        <div className="w-full h-32 bg-[#F5F3EF] border-2 border-[#141414] flex flex-col items-center justify-center mb-4 relative overflow-hidden">
          {/* Subtle Grid Lines */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#141414_1px,transparent_1px)] [background-size:8px_8px] pointer-events-none" />

          {/* Animated Sprite Thumbnail */}
          {item.webpUrl ? (
            <div className="relative w-16 h-16 flex items-center justify-center">
              {/* Optional base avatar silhouette under item */}
              {targetSlot !== 'weapon' && targetSlot !== 'aura' && (
                <div
                  className="sprite-layer absolute top-0 left-0 opacity-30"
                  style={{
                    backgroundImage: "url('/assets/base/main-avatar.webp')",
                  }}
                />
              )}
              <div
                className="sprite-layer absolute top-0 left-0"
                style={{
                  backgroundImage: `url('${item.webpUrl}')`,
                }}
              />
            </div>
          ) : (
            <Icon className="w-10 h-10 text-[#141414]" />
          )}

          <span className="text-[9px] font-mono font-bold uppercase text-[#141414]/60 mt-1">
            4-FRAME PIXEL SPRITE
          </span>
        </div>

        {/* Name */}
        <h4 className="text-sm font-heading font-black text-[#141414] mb-1 uppercase tracking-tight leading-snug">
          {item.name}
        </h4>
        <div className="text-[11px] font-mono font-bold text-[#141414]/70 mb-3 uppercase">
          REQUIRED CLEARANCE: LV.{reqLevel}
        </div>
      </div>

      {/* Footer: Price Badge & Action Button */}
      <div className="pt-3 border-t-2 border-[#141414] flex items-center justify-between gap-2 mt-auto">
        <div className="bg-[#F2B705] text-[#141414] border-2 border-[#141414] px-2.5 py-1 text-xs font-mono font-black uppercase flex items-center gap-1">
          <Coins className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{cost} GOLD</span>
        </div>

        <div>
          {isOwned ? (
            isEquipped ? (
              <button
                type="button"
                onClick={() => onUnequip(targetSlot, item._id)}
                disabled={isProcessing}
                className="px-3 py-1.5 bg-[#2B4AE8] hover:bg-[#E8402C] text-white border-2 border-[#141414] text-xs font-mono font-black uppercase cursor-pointer transition-none shadow-brutal-sm flex items-center gap-1.5 group"
                title="Click to unequip this item"
              >
                <Check className="w-3.5 h-3.5 stroke-[3] group-hover:hidden" />
                <span className="group-hover:hidden">EQUIPPED</span>
                <span className="hidden group-hover:inline">UNEQUIP ✕</span>
              </button>
            ) : (
              <button
                onClick={() => onEquip(item._id)}
                disabled={isProcessing}
                className="px-3 py-1.5 bg-[#F5F3EF] hover:bg-[#141414] text-[#141414] hover:text-white border-2 border-[#141414] text-xs font-mono font-black uppercase cursor-pointer transition-none shadow-brutal-sm"
              >
                EQUIP →
              </button>
            )
          ) : (
            <button
              onClick={() => onPurchase(item._id)}
              disabled={isLevelLocked || !canAfford || isProcessing}
              className={`px-3 py-1.5 text-xs font-mono font-black uppercase border-2 border-[#141414] cursor-pointer transition-none ${
                isLevelLocked
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : !canAfford
                  ? 'bg-[#EBE7DF] text-[#141414]/50 cursor-not-allowed'
                  : 'bg-[#E8402C] hover:bg-[#141414] text-white shadow-brutal-sm'
              }`}
            >
              {isLevelLocked ? 'LOCKED' : !canAfford ? 'NEED GOLD' : 'BUY →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopItemCard;
