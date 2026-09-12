import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export const AmbientSound = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const noiseSourceRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const startAudio = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // Master gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Generate noise buffer
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(masterGain);

      whiteNoise.start();
      noiseSourceRef.current = whiteNoise;
      setIsPlaying(true);
    } catch {
      // Audio playback unavailable
    }
  };

  const stopAudio = () => {
    if (noiseSourceRef.current) {
      try {
        noiseSourceRef.current.stop();
      } catch {
        // audio already stopped
      }
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {
        // audio context already closed
      }
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
    <div className="flex items-center gap-2 bg-[#F5F3EF] border-2 border-[#141414] px-2.5 py-1 text-xs font-mono font-bold text-[#141414]">
      <button
        onClick={togglePlay}
        className="flex items-center gap-1.5 hover:text-[#E8402C] transition-none cursor-pointer uppercase"
        title={isPlaying ? 'Mute ambient sound' : 'Play white noise'}
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-3.5 h-3.5 text-[#E8402C]" />
            <span className="hidden sm:inline">AUDIO ON</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-[#141414]/60" />
            <span className="hidden sm:inline">AUDIO MUTED</span>
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
          className="w-12 h-1 accent-[#E8402C] cursor-pointer"
          title="Ambient Volume"
        />
      )}
    </div>
  );
};
