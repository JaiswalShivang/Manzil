import confetti from 'canvas-confetti';

/**
 * Fires bold constructivist geometric confetti matching the Bauhaus primary palette:
 * Cadmium Red (#E8402C), International Blue (#2B4AE8), Bauhaus Yellow (#F2B705), Ink Black (#141414), Bone (#F5F3EF).
 * Strictly respects prefers-reduced-motion.
 */
export const triggerBauhausCelebration = () => {
  // Check prefers-reduced-motion
  if (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }

  // Primary geometric burst
  confetti({
    particleCount: 50,
    spread: 80,
    origin: { y: 0.65 },
    colors: ['#E8402C', '#2B4AE8', '#F2B705', '#141414', '#F5F3EF'],
    ticks: 200,
    gravity: 0.9,
    decay: 0.92,
    startVelocity: 30,
    shapes: ['square', 'circle'],
    scalar: 1.2,
  });

  // Secondary tactical flanking bursts
  setTimeout(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    confetti({
      particleCount: 30,
      angle: 60,
      spread: 50,
      origin: { x: 0.1, y: 0.75 },
      colors: ['#E8402C', '#F2B705', '#141414'],
      ticks: 220,
      gravity: 0.85,
      startVelocity: 24,
      shapes: ['square'],
      scalar: 1.1,
    });

    confetti({
      particleCount: 30,
      angle: 120,
      spread: 50,
      origin: { x: 0.9, y: 0.75 },
      colors: ['#2B4AE8', '#F2B705', '#F5F3EF'],
      ticks: 220,
      gravity: 0.85,
      startVelocity: 24,
      shapes: ['square'],
      scalar: 1.1,
    });
  }, 180);
};

// Backwards compatibility alias
export const triggerCozyCelebration = triggerBauhausCelebration;
