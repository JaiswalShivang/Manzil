import confetti from 'canvas-confetti';

/**
 * Fires gentle pastel / warm firefly sparkles matching the cozy lo-fi palette
 */
export const triggerCozyCelebration = () => {
  // Firefly golden sparkles drift
  confetti({
    particleCount: 40,
    spread: 70,
    origin: { y: 0.7 },
    colors: ['#F4C572', '#E3A08A', '#9CAF88', '#B9A6D9', '#FAF3E8'],
    ticks: 200,
    gravity: 0.8,
    decay: 0.94,
    startVelocity: 25,
    shapes: ['circle'],
    scalar: 1.2,
  });

  // Secondary soft drift
  setTimeout(() => {
    confetti({
      particleCount: 25,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.8 },
      colors: ['#F4C572', '#E3A08A', '#FAF3E8'],
      ticks: 220,
      gravity: 0.7,
      startVelocity: 20,
    });
    confetti({
      particleCount: 25,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.8 },
      colors: ['#9CAF88', '#B9A6D9', '#FAF3E8'],
      ticks: 220,
      gravity: 0.7,
      startVelocity: 20,
    });
  }, 200);
};
