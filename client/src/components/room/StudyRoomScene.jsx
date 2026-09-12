import React, { useState } from 'react';
import { Sparkles, Moon, Sun, CloudRain } from 'lucide-react';

export const StudyRoomScene = ({ user }) => {
  const [lampOn, setLampOn] = useState(true);
  const [isRaining, setIsRaining] = useState(true);
  const [isNight, setIsNight] = useState(true);

  // Determine which items are currently equipped from inventory
  const equippedItems = (user?.inventory || []).filter((inv) => inv.equipped && inv.itemId);
  
  const hasEquipped = (category, imageKey = null) => {
    return equippedItems.some((inv) => {
      if (!inv.itemId) return false;
      if (imageKey) return inv.itemId.imageKey === imageKey;
      return inv.itemId.category === category;
    });
  };

  const getEquippedItem = (category) => {
    return equippedItems.find((inv) => inv.itemId && inv.itemId.category === category)?.itemId;
  };

  const equippedWallpaper = getEquippedItem('wallpaper');
  const equippedRug = getEquippedItem('rug');
  const equippedLamp = getEquippedItem('lamp');
  const equippedPoster = getEquippedItem('poster');
  const equippedMug = getEquippedItem('mug');

  // Background wall colors based on wallpaper
  const getWallColor = () => {
    if (equippedWallpaper?.imageKey === 'midnight_rain_blue') return '#2A3342';
    if (equippedWallpaper?.imageKey === 'forest_sage_wood') return '#627254';
    return isNight ? '#E8DEC8' : '#FAF3E8'; // default warm plaster
  };

  const wallColor = getWallColor();

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-[#E4D3BE] shadow-[0_12px_36px_rgba(58,46,39,0.12)] bg-[#FAF3E8]">
      {/* Top Scene Controls Overlay */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-[#FAF3E8]/85 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-[#E4D3BE] text-xs text-[#78665B] shadow-sm">
        <button
          onClick={() => setLampOn(!lampOn)}
          className={`flex items-center gap-1 px-2 py-1 rounded-xl transition-colors cursor-pointer ${
            lampOn ? 'bg-[#F4C572]/30 text-[#855D16] font-semibold' : 'hover:bg-[#F0E4D3]'
          }`}
          title="Toggle Desk Lamp"
        >
          <span>💡</span>
          <span>{lampOn ? 'Lamp On' : 'Lamp Off'}</span>
        </button>

        <button
          onClick={() => setIsRaining(!isRaining)}
          className={`flex items-center gap-1 px-2 py-1 rounded-xl transition-colors cursor-pointer ${
            isRaining ? 'bg-[#9CAF88]/25 text-[#4D6339] font-semibold' : 'hover:bg-[#F0E4D3]'
          }`}
          title="Toggle Window Rain"
        >
          <CloudRain className="w-3.5 h-3.5" />
          <span>{isRaining ? 'Rain' : 'Clear'}</span>
        </button>

        <button
          onClick={() => setIsNight(!isNight)}
          className="p-1 rounded-xl hover:bg-[#F0E4D3] transition-colors cursor-pointer text-[#78665B]"
          title="Toggle Day/Night View"
        >
          {isNight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Level Tag Overlay */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#FAF3E8]/85 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-[#E4D3BE] shadow-sm">
        <span className="text-sm">🪴</span>
        <span className="text-xs font-bold text-[#3A2E27]">
          {user?.username ? `${user.username}'s Study Nook` : 'My Study Nook'}
        </span>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E3A08A]/30 text-[#3A2E27]">
          Lv. {user?.level || 1}
        </span>
      </div>

      {/* Main Illustrated SVG Room */}
      <svg
        viewBox="0 0 800 500"
        className="w-full h-auto max-h-[520px] transition-all duration-700 select-none"
        style={{ backgroundColor: wallColor }}
      >
        <defs>
          {/* Lamp Light Radial Gradient */}
          <radialGradient id="lampGlow" cx="620" cy="240" r="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F4C572" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#F4C572" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#F4C572" stopOpacity="0" />
          </radialGradient>

          {/* Window Sky Gradient */}
          <linearGradient id="skyNight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E2638" />
            <stop offset="100%" stopColor="#3B4861" />
          </linearGradient>
          <linearGradient id="skyDay" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A8C0D8" />
            <stop offset="100%" stopColor="#D9E6F2" />
          </linearGradient>

          {/* Floor Wood Plank Gradient */}
          <linearGradient id="woodFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C4A882" />
            <stop offset="100%" stopColor="#9C7F59" />
          </linearGradient>

          {/* Desk Wood Gradient */}
          <linearGradient id="deskWood" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8A6642" />
            <stop offset="50%" stopColor="#A07850" />
            <stop offset="100%" stopColor="#7E5C3B" />
          </linearGradient>
        </defs>

        {/* 1. ROOM FLOOR */}
        <polygon points="0,380 800,380 800,500 0,500" fill="url(#woodFloor)" />
        {/* Floor Plank Lines */}
        <line x1="0" y1="410" x2="800" y2="410" stroke="#846845" strokeWidth="1.5" opacity="0.6" />
        <line x1="0" y1="440" x2="800" y2="440" stroke="#846845" strokeWidth="1.5" opacity="0.6" />
        <line x1="0" y1="470" x2="800" y2="470" stroke="#846845" strokeWidth="1.5" opacity="0.6" />
        <line x1="160" y1="380" x2="130" y2="500" stroke="#846845" strokeWidth="1" opacity="0.4" />
        <line x1="380" y1="380" x2="350" y2="500" stroke="#846845" strokeWidth="1" opacity="0.4" />
        <line x1="600" y1="380" x2="570" y2="500" stroke="#846845" strokeWidth="1" opacity="0.4" />

        {/* Baseboard Trim */}
        <rect x="0" y="372" width="800" height="8" fill="#E4D3BE" />

        {/* 2. EQUIPPED RUG ON FLOOR */}
        {equippedRug?.imageKey === 'boho_woven_rug' && (
          <g transform="translate(340, 420)">
            <ellipse cx="0" cy="20" rx="140" ry="40" fill="#E2D0B6" stroke="#9C7F59" strokeWidth="3" strokeDasharray="6,4" />
            <ellipse cx="0" cy="20" rx="100" ry="26" fill="#D4B996" opacity="0.8" />
            <ellipse cx="0" cy="20" rx="60" ry="16" fill="#C4A57F" opacity="0.9" />
          </g>
        )}
        {equippedRug?.imageKey === 'plush_circle_rug' && (
          <g transform="translate(350, 425)">
            <ellipse cx="0" cy="18" rx="135" ry="42" fill="#FAF3E8" stroke="#E3A08A" strokeWidth="2.5" opacity="0.95" />
            <ellipse cx="0" cy="18" rx="115" ry="32" fill="#FFFBF5" />
          </g>
        )}
        {equippedRug?.imageKey === 'forest_moss_mat' && (
          <g transform="translate(340, 420)">
            <ellipse cx="0" cy="20" rx="145" ry="42" fill="#5F7A4D" opacity="0.9" />
            <ellipse cx="-20" cy="18" rx="60" ry="24" fill="#7D9B66" />
            <ellipse cx="40" cy="22" rx="70" ry="26" fill="#4B623C" />
          </g>
        )}

        {/* 3. COZY WINDOW WITH OUTSIDE VIEW */}
        <g transform="translate(80, 70)">
          {/* Outer Window Frame */}
          <rect x="0" y="0" width="220" height="230" rx="16" fill="#F0E4D3" stroke="#D4B996" strokeWidth="6" />
          {/* Glass Pane Background */}
          <rect
            x="10"
            y="10"
            width="200"
            height="210"
            rx="10"
            fill={isNight ? 'url(#skyNight)' : 'url(#skyDay)'}
          />

          {/* Stars or Clouds */}
          {isNight ? (
            <g>
              <circle cx="45" cy="40" r="1.5" fill="#FAF3E8" opacity="0.9" />
              <circle cx="160" cy="55" r="2" fill="#F4C572" opacity="0.8" />
              <circle cx="90" cy="70" r="1" fill="#FAF3E8" opacity="0.7" />
              <circle cx="130" cy="35" r="1.5" fill="#FAF3E8" opacity="0.9" />
              {/* Crescent Moon */}
              <path
                d="M170,30 A14,14 0 0,0 182,44 A12,12 0 1,1 170,30"
                fill="#F4C572"
                opacity="0.9"
              />
            </g>
          ) : (
            <g opacity="0.6">
              <ellipse cx="60" cy="45" rx="30" ry="14" fill="#FFF" />
              <ellipse cx="80" cy="40" rx="20" ry="12" fill="#FFF" />
              <ellipse cx="150" cy="60" rx="35" ry="15" fill="#FFF" />
            </g>
          )}

          {/* Rain Streaks if raining */}
          {isRaining && (
            <g stroke="#9CAF88" strokeWidth="1.2" opacity="0.65" strokeDasharray="8,10">
              <line x1="30" y1="20" x2="20" y2="190" className="animate-pulse" />
              <line x1="70" y1="15" x2="60" y2="185" className="animate-pulse" />
              <line x1="110" y1="25" x2="100" y2="195" className="animate-pulse" />
              <line x1="150" y1="18" x2="140" y2="188" className="animate-pulse" />
              <line x1="185" y1="30" x2="175" y2="200" className="animate-pulse" />
            </g>
          )}

          {/* Window Panes Wooden Cross */}
          <line x1="110" y1="10" x2="110" y2="220" stroke="#D4B996" strokeWidth="5" />
          <line x1="10" y1="115" x2="210" y2="115" stroke="#D4B996" strokeWidth="5" />

          {/* Window Sill */}
          <rect x="-10" y="225" width="240" height="12" rx="4" fill="#C4A882" stroke="#9C7F59" strokeWidth="2" />

          {/* Window Sill Plant if unlocked/equipped (succulents or starter plant) */}
          <g transform="translate(140, 195)">
            <rect x="0" y="18" width="30" height="18" rx="3" fill="#E3A08A" />
            <path d="M5,18 Q15,0 25,18" fill="#9CAF88" />
            <path d="M10,18 Q15,-6 20,18" fill="#7D9B66" />
          </g>
        </g>

        {/* 4. POSTERS & WALL ART */}
        {equippedPoster && (
          <g transform="translate(340, 80)">
            <rect x="0" y="0" width="130" height="150" rx="8" fill="#FFF9E6" stroke="#D4B996" strokeWidth="4" />
            {equippedPoster.imageKey === 'lofi_cat_window' && (
              <g transform="translate(15, 15)">
                <rect x="0" y="0" width="100" height="120" rx="4" fill="#3B4861" />
                {/* Moon */}
                <circle cx="75" cy="30" r="12" fill="#F4C572" opacity="0.8" />
                {/* Sleeping Cat Silhouette */}
                <ellipse cx="50" cy="85" rx="25" ry="14" fill="#FAF3E8" />
                <circle cx="30" cy="80" r="10" fill="#FAF3E8" />
                <polygon points="25,72 23,65 30,70" fill="#E3A08A" />
                <polygon points="34,70 38,64 38,72" fill="#E3A08A" />
                {/* Cat Tail */}
                <path d="M74,86 Q85,75 80,68" stroke="#FAF3E8" strokeWidth="4" fill="none" strokeLinecap="round" />
                <text x="50" y="112" textAnchor="middle" fill="#FAF3E8" fontSize="9" fontFamily="Caveat, cursive">cozy lofi cat</text>
              </g>
            )}
            {equippedPoster.imageKey === 'botanical_chart' && (
              <g transform="translate(15, 15)">
                <rect x="0" y="0" width="100" height="120" rx="4" fill="#FAF3E8" />
                <path d="M50,105 Q50,30 50,20" stroke="#5F7A4D" strokeWidth="3" fill="none" />
                <path d="M50,40 Q30,35 25,45 Q40,50 50,45" fill="#7D9B66" />
                <path d="M50,55 Q70,50 75,60 Q60,65 50,60" fill="#7D9B66" />
                <path d="M50,70 Q30,65 22,75 Q38,80 50,75" fill="#5F7A4D" />
                <path d="M50,85 Q70,80 78,90 Q60,95 50,90" fill="#5F7A4D" />
                <text x="50" y="114" textAnchor="middle" fill="#3A2E27" fontSize="8" fontFamily="Quicksand">BOTANICA</text>
              </g>
            )}
            {equippedPoster.imageKey === 'retro_pixel_city' && (
              <g transform="translate(15, 15)">
                <rect x="0" y="0" width="100" height="120" rx="4" fill="#20152B" />
                <polygon points="10,120 10,60 30,60 30,120" fill="#4B2C5E" />
                <polygon points="35,120 35,40 65,40 65,120" fill="#B9A6D9" />
                <polygon points="70,120 70,75 90,75 90,120" fill="#E3A08A" />
                <circle cx="50" cy="25" r="10" fill="#F4C572" />
              </g>
            )}
            {equippedPoster.imageKey === 'starry_galaxy' && (
              <g transform="translate(15, 15)">
                <rect x="0" y="0" width="100" height="120" rx="4" fill="#141926" />
                <circle cx="50" cy="55" r="30" fill="#B9A6D9" opacity="0.3" filter="blur(2px)" />
                <circle cx="50" cy="55" r="15" fill="#F4C572" opacity="0.4" />
                <line x1="30" y1="40" x2="50" y2="55" stroke="#F4C572" strokeWidth="1" />
                <line x1="50" y1="55" x2="70" y2="45" stroke="#F4C572" strokeWidth="1" />
                <line x1="50" y1="55" x2="60" y2="80" stroke="#F4C572" strokeWidth="1" />
                <circle cx="30" cy="40" r="2" fill="#FFF" />
                <circle cx="70" cy="45" r="2" fill="#FFF" />
                <circle cx="60" cy="80" r="2" fill="#FFF" />
              </g>
            )}
          </g>
        )}

        {/* Hanging Pothos Plant near ceiling if equipped */}
        {hasEquipped('plant', 'hanging_pothos') && (
          <g transform="translate(260, 0)">
            <line x1="30" y1="0" x2="30" y2="60" stroke="#846845" strokeWidth="2" />
            <ellipse cx="30" cy="65" rx="16" ry="8" fill="#E3A08A" />
            <path d="M22,70 Q10,110 15,140 Q25,100 28,70" fill="#9CAF88" />
            <path d="M32,70 Q45,120 38,150 Q30,105 32,70" fill="#7D9B66" />
            <path d="M30,70 Q30,130 28,160 Q34,115 32,70" fill="#5F7A4D" />
          </g>
        )}

        {/* 5. BOOKSHELF ON WALL */}
        <g transform="translate(500, 70)">
          {/* Wooden Shelf */}
          <rect x="0" y="60" width="220" height="12" rx="3" fill="#A07850" stroke="#7E5C3B" strokeWidth="2" />
          {/* Books on shelf */}
          <rect x="15" y="15" width="12" height="45" rx="2" fill="#E3A08A" />
          <rect x="29" y="10" width="14" height="50" rx="2" fill="#9CAF88" />
          <rect x="45" y="20" width="10" height="40" rx="2" fill="#B9A6D9" />
          <rect x="57" y="8" width="16" height="52" rx="2" fill="#F4C572" />
          <rect x="75" y="22" width="11" height="38" rx="2" fill="#78665B" />

          {/* Monstera plant on shelf or floor if equipped */}
          {hasEquipped('plant', 'monstera') && (
            <g transform="translate(140, 10)">
              <polygon points="10,50 35,50 30,30 15,30" fill="#E3A08A" />
              {/* Monstera Leaves */}
              <path d="M22,30 Q5,5 0,15 Q10,25 22,30" fill="#5F7A4D" />
              <path d="M22,30 Q40,-5 45,5 Q35,20 22,30" fill="#7D9B66" />
              <path d="M22,30 Q22,-10 25,-5 Q28,15 22,30" fill="#9CAF88" />
            </g>
          )}

          {/* Fairy lights along shelf if equipped */}
          {hasEquipped('lamp', 'fairy_lights') && (
            <g>
              <path d="M0,65 Q50,85 110,65 Q170,85 220,65" stroke="#F4C572" strokeWidth="1.5" fill="none" />
              <circle cx="30" cy="74" r="3.5" fill="#F4C572" className="animate-pulse" />
              <circle cx="80" cy="73" r="3.5" fill="#F4C572" className="animate-pulse" />
              <circle cx="140" cy="74" r="3.5" fill="#F4C572" className="animate-pulse" />
              <circle cx="190" cy="72" r="3.5" fill="#F4C572" className="animate-pulse" />
            </g>
          )}
        </g>

        {/* 6. STUDY DESK & CHAIR */}
        {/* Cozy Wooden Desk */}
        <g id="desk-furniture">
          {/* Desk Top */}
          <rect x="220" y="270" width="460" height="24" rx="6" fill="url(#deskWood)" stroke="#5D3E24" strokeWidth="2.5" />
          {/* Desk Edge Highlight */}
          <line x1="222" y1="272" x2="678" y2="272" stroke="#FAF3E8" strokeWidth="1" opacity="0.3" />

          {/* Left Desk Legs */}
          <rect x="250" y="294" width="20" height="140" rx="3" fill="#7E5C3B" />
          <rect x="280" y="294" width="16" height="135" rx="3" fill="#6B4D2F" />

          {/* Right Desk Drawer Cabinet */}
          <rect x="580" y="294" width="90" height="140" rx="4" fill="#8A6642" stroke="#5D3E24" strokeWidth="2" />
          {/* Drawers */}
          <rect x="590" y="305" width="70" height="35" rx="3" fill="#A07850" />
          <circle cx="625" cy="322" r="3" fill="#F4C572" />
          <rect x="590" y="350" width="70" height="35" rx="3" fill="#A07850" />
          <circle cx="625" cy="367" r="3" fill="#F4C572" />
          <rect x="590" y="395" width="70" height="32" rx="3" fill="#A07850" />
          <circle cx="625" cy="411" r="3" fill="#F4C572" />
        </g>

        {/* Cozy Study Chair */}
        <g transform="translate(370, 310)">
          {/* Chair Back Cushion */}
          <rect x="0" y="-30" width="90" height="85" rx="20" fill="#E3A08A" stroke="#C9846E" strokeWidth="2.5" />
          <rect x="10" y="-20" width="70" height="65" rx="14" fill="#E8B2A1" opacity="0.8" />
          {/* Chair Seat */}
          <ellipse cx="45" cy="65" rx="55" ry="16" fill="#D9907A" stroke="#C9846E" strokeWidth="2.5" />
          {/* Chair Base Stem */}
          <rect x="41" y="80" width="8" height="40" fill="#4A3B32" />
          <polygon points="15,120 75,120 45,115" fill="#3A2E27" />
        </g>

        {/* 7. DESK ACCESSORIES & OBJECTS */}
        {/* Laptop Computer with glowing screen */}
        <g transform="translate(390, 215)">
          {/* Laptop Screen Lid */}
          <rect x="0" y="0" width="85" height="58" rx="4" fill="#3A2E27" stroke="#55443B" strokeWidth="2" />
          {/* Screen Display */}
          <rect x="4" y="4" width="77" height="50" rx="2" fill="#202A36" />
          {/* Code lines / Notes on screen */}
          <line x1="12" y1="14" x2="40" y2="14" stroke="#9CAF88" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="22" x2="65" y2="22" stroke="#FAF3E8" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          <line x1="12" y1="30" x2="52" y2="30" stroke="#B9A6D9" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="38" x2="35" y2="38" stroke="#F4C572" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="46" x2="60" y2="46" stroke="#E3A08A" strokeWidth="2" strokeLinecap="round" />

          {/* Keyboard Base */}
          <polygon points="-8,58 93,58 98,62 -13,62" fill="#4A3B32" />
        </g>

        {/* Desk Lamp & Ambient Lighting Effect */}
        <g transform="translate(590, 175)">
          {/* Lamp Base */}
          <ellipse cx="25" cy="95" rx="20" ry="6" fill="#8C7355" stroke="#5D4B37" strokeWidth="2" />
          {/* Curved Gooseneck */}
          <path d="M25,95 Q45,40 20,20 Q5,10 -5,25" stroke="#A08563" strokeWidth="5" fill="none" strokeLinecap="round" />
          {/* Lamp Shade Hood */}
          <polygon points="-25,42 12,20 -5,12" fill={equippedLamp?.imageKey === 'lava_lamp_rose' ? '#E3A08A' : '#7E684D'} />
          <ellipse cx="-8" cy="32" rx="15" ry="8" fill={lampOn ? '#F4C572' : '#5D4B37'} />

          {/* Candle Lantern option */}
          {equippedLamp?.imageKey === 'candle_lantern' && (
            <g transform="translate(10, 60)">
              <rect x="0" y="0" width="22" height="34" rx="4" fill="#F0E4D3" stroke="#8C7355" strokeWidth="2" />
              <line x1="11" y1="18" x2="11" y2="12" stroke="#3A2E27" strokeWidth="2" />
              <circle cx="11" cy="10" r="5" fill="#F4C572" className="animate-flicker" />
            </g>
          )}
        </g>

        {/* Lamp Light Glow Cone onto Desk */}
        {lampOn && (
          <ellipse
            cx="550"
            cy="275"
            rx="140"
            ry="55"
            fill="url(#lampGlow)"
            style={{ mixBlendMode: 'screen', pointerEvents: 'none' }}
          />
        )}

        {/* Steaming Mug on Desk */}
        <g transform="translate(330, 248)">
          {/* Rising Steam */}
          <path
            d="M12,0 C8,-8 16,-14 12,-22"
            stroke="#FAF3E8"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            className="animate-steam"
            opacity="0.8"
          />
          <path
            d="M18,-2 C14,-10 22,-16 18,-24"
            stroke="#FAF3E8"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            className="animate-steam"
            opacity="0.6"
          />
          {/* Cup Body */}
          <rect
            x="4"
            y="4"
            width="22"
            height="22"
            rx="4"
            fill={
              equippedMug?.imageKey === 'matcha_latte_mug'
                ? '#9CAF88'
                : equippedMug?.imageKey === 'hot_cocoa_mug'
                ? '#78665B'
                : '#E3A08A'
            }
          />
          {/* Handle */}
          <path d="M26,8 C32,8 32,20 26,20" stroke="#E3A08A" strokeWidth="3" fill="none" />
          {/* Drink Surface */}
          <ellipse
            cx="15"
            cy="6"
            rx="9"
            ry="3"
            fill={
              equippedMug?.imageKey === 'matcha_latte_mug'
                ? '#5F7A4D'
                : equippedMug?.imageKey === 'hot_cocoa_mug'
                ? '#4A3B32'
                : '#B97C47'
            }
          />
        </g>

        {/* Sticky Note on Desk */}
        <g transform="translate(245, 252) rotate(-3)">
          <rect x="0" y="0" width="38" height="38" rx="3" fill="#FFF9E6" stroke="#EFE2B8" strokeWidth="1" />
          <rect x="10" y="-4" width="18" height="7" fill="rgba(227, 160, 138, 0.5)" />
          <line x1="6" y1="12" x2="32" y2="12" stroke="#78665B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="6" y1="18" x2="28" y2="18" stroke="#78665B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="6" y1="24" x2="22" y2="24" stroke="#9CAF88" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Bonsai Tree if unlocked/equipped on floor or desk */}
        {hasEquipped('plant', 'bonsai_tree') && (
          <g transform="translate(130, 320)">
            <polygon points="10,60 50,60 45,46 15,46" fill="#3A2E27" />
            <path d="M30,46 Q20,20 40,15" stroke="#78665B" strokeWidth="7" fill="none" strokeLinecap="round" />
            <path d="M40,15 Q55,10 50,0" stroke="#78665B" strokeWidth="5" fill="none" strokeLinecap="round" />
            {/* Bonsai Cloud Foliage */}
            <ellipse cx="25" cy="18" rx="18" ry="10" fill="#4B623C" />
            <ellipse cx="48" cy="2" rx="16" ry="8" fill="#5F7A4D" />
            <ellipse cx="60" cy="14" rx="15" ry="8" fill="#7D9B66" />
          </g>
        )}
      </svg>
    </div>
  );
};
