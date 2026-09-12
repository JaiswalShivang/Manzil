import rateLimit from 'express-rate-limit';


export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Rate limit exceeded: Too many authentication attempts. Access locked for 15 minutes.',
  },
});

export const questCompleteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 quest executions per minute max (blocks scripted rapid-fire exploits)
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Rate limit exceeded: Excessive directive executions in short succession. Please throttle requests.',
  },
});
