import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, CloudRain, Flame, Music } from 'lucide-react';

export const AmbientSound = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState('rain'); // 'rain' or 'fire'
  const [volume, setVolume] = useState(0.3);
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const noiseSourceRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  const startAudio = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      // Master gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Generate brown noise buffer for deep soothing rain / fireplace
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brown noise filter approximation
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Gain boost
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Lowpass filter for cozy muffled rain
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(mode === 'rain' ? 450 : 320, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(masterGain);

      whiteNoise.start();
      noiseSourceRef.current = whiteNoise;
      setIsPlaying(true);
    } catch (e) {
      console.warn('Web Audio playback error:', e);
    }
  };

  const stopAudio = () => {
    if (noiseSourceRef.current) {
      try {
        noiseSourceRef.current.stop();
      } catch (e) {}
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  return (
    <div className="flex items-center gap-2 bg-[#F0E4D3] border border-[#E4D3BE] px-3 py-1.5 rounded-full shadow-sm text-xs text-[#78665B]">
      <button
        onClick={togglePlay}
        className="flex items-center gap-1.5 font-medium hover:text-[#3A2E27] transition-colors cursor-pointer"
        title={isPlaying ? 'Mute ambient study sounds' : 'Play cozy ambient rain sounds'}
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-3.5 h-3.5 text-[#9CAF88] animate-pulse" />
            <span className="hidden sm:inline">Cozy Rain</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-[#78665B]" />
            <span className="hidden sm:inline">Ambient Rain</span>
          </>
        )}
      </button>

      {isPlaying && (
        <input
          type="range"
          min="0"
          max="0.8"
          step="0.05"
          value={volume}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            setVolume(val);
            if (gainNodeRef.current && audioCtxRef.current) {
              gainNodeRef.current.gain.setValueAtTime(val, audioCtxRef.current.currentTime);
            }
          }}
          className="w-14 h-1 bg-[#E4D3BE] rounded-lg accent-[#E3A08A] cursor-pointer"
          title="Ambient Volume"
        />
      )}
    </div>
  );
};
