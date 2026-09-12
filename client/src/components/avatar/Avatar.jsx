
import { memo } from 'react';

/**
 * Avatar Paperdoll Component
 *
 * Strict z-index stack:
 *  - body: 0  (always rendered: /assets/base/main-avatar.webp)
 *  - shoes: 1 (rendered under or with pants)
 *  - pants: 1
 *  - chest: 2
 *  - hair: 3
 *  - weapon: 4
 *  - aura: 5
 *
 * Synchronized spriteWalk animation with steps(4) snapping.
 */
const AvatarComponent = ({ equipped = {}, scale = 4, className = '' }) => {
  // Normalize equipped items whether populated objects or raw string URLs
  const getUrl = (slot) => {
    const item = equipped?.[slot];
    if (!item) return null;
    return typeof item === 'string' ? item : item.webpUrl || null;
  };

  const hairUrl = getUrl('hair');
  const chestUrl = getUrl('chest');
  const pantsUrl = getUrl('pants');
  const shoesUrl = getUrl('shoes');
  const weaponUrl = getUrl('weapon');
  const auraUrl = getUrl('aura') || getUrl('crystal');

  // Dimension scaling calculation: native 64x64 scaled up
  const containerSize = 64 * scale;

  const equippedNames = Object.entries(equipped || {})
    .filter(([, val]) => Boolean(val))
    .map(([slot, item]) => `${slot}: ${typeof item === 'object' && item?.name ? item.name : 'equipped'}`)
    .join(', ');
  const avatarAriaLabel = equippedNames ? `Operative avatar with ${equippedNames}` : 'Operative paperdoll avatar';

  return (
    <div
      role="img"
      aria-label={avatarAriaLabel}
      className={`relative flex items-center justify-center overflow-hidden select-none ${className}`}
      style={{
        width: `${containerSize}px`,
        height: `${containerSize}px`,
      }}
    >
      {/* 64x64 native stage scaled smoothly by CSS transform */}
      <div
        className="relative"
        style={{
          width: '64px',
          height: '64px',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Layer 0: Base Character Body (Always active) */}
        <div
          className="sprite-layer absolute top-0 left-0"
          style={{
            zIndex: 0,
            backgroundImage: "url('/assets/base/main-avatar.webp')",
          }}
          title="Base Agent Sprite"
        />

        {/* Layer 1: Shoes */}
        {shoesUrl && (
          <div
            className="sprite-layer absolute top-0 left-0"
            style={{
              zIndex: 1,
              backgroundImage: `url('${shoesUrl}')`,
            }}
          />
        )}

        {/* Layer 1: Pants / Trousers */}
        {pantsUrl && (
          <div
            className="sprite-layer absolute top-0 left-0"
            style={{
              zIndex: 1,
              backgroundImage: `url('${pantsUrl}')`,
            }}
          />
        )}

        {/* Layer 2: Chest / Shirt */}
        {chestUrl && (
          <div
            className="sprite-layer absolute top-0 left-0"
            style={{
              zIndex: 2,
              backgroundImage: `url('${chestUrl}')`,
            }}
          />
        )}

        {/* Layer 3: Hair */}
        {hairUrl && (
          <div
            className="sprite-layer absolute top-0 left-0"
            style={{
              zIndex: 3,
              backgroundImage: `url('${hairUrl}')`,
            }}
          />
        )}

        {/* Layer 4: Weapon */}
        {weaponUrl && (
          <div
            className="sprite-layer absolute top-0 left-0"
            style={{
              zIndex: 4,
              backgroundImage: `url('${weaponUrl}')`,
            }}
          />
        )}

        {/* Layer 5: Aura / Crystal / Magic */}
        {auraUrl && (
          <div
            className="sprite-layer absolute top-0 left-0"
            style={{
              zIndex: 5,
              backgroundImage: `url('${auraUrl}')`,
            }}
          />
        )}
      </div>
    </div>
  );
};

export const Avatar = memo(AvatarComponent);
export default Avatar;
