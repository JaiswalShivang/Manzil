
export const calculateXPToNextLevel = (level) => {
  return Math.max(50, Math.round(50 * Math.pow(level, 1.5)));
};

export const getBaseRewards = (category = 'intellect') => {
  switch (category) {
    case 'intellect':
      return { xp: 45, coins: 25, skillGain: 5 };
    case 'vitality':
      return { xp: 50, coins: 20, skillGain: 5 };
    case 'discipline':
      return { xp: 40, coins: 30, skillGain: 5 };
    case 'creativity':
      return { xp: 45, coins: 25, skillGain: 5 };
    default:
      return { xp: 40, coins: 20, skillGain: 5 };
  }
};

export const updateStreak = (currentStreak = { count: 0, lastCompletedDate: null }) => {
  const now = new Date();

  if (!currentStreak.lastCompletedDate) {
    return {
      count: 1,
      lastCompletedDate: now,
      isNewDay: true,
      milestoneBonus: null,
    };
  }

  const lastDate = new Date(currentStreak.lastCompletedDate);


  const lastDateStr = lastDate.toISOString().split('T')[0];
  const todayStr = now.toISOString().split('T')[0];

  if (lastDateStr === todayStr) {

    return {
      count: currentStreak.count || 1,
      lastCompletedDate: now,
      isNewDay: false,
      milestoneBonus: null,
    };
  }

  const diffTime = Math.abs(now.setHours(0, 0, 0, 0) - lastDate.setHours(0, 0, 0, 0));
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  let newCount = 1;
  if (diffDays === 1) {
    newCount = (currentStreak.count || 0) + 1;
  } else {
    newCount = 1;
  }

  let milestoneBonus = null;
  if (newCount === 3) milestoneBonus = { bonusXP: 50, bonusCoins: 30, message: '3-day Study Streak! 🕯️' };
  else if (newCount === 7) milestoneBonus = { bonusXP: 120, bonusCoins: 75, message: '1-Week Habit Master! 🌿' };
  else if (newCount === 14) milestoneBonus = { bonusXP: 250, bonusCoins: 150, message: '2-Week Focus Flow! ☕' };
  else if (newCount === 30) milestoneBonus = { bonusXP: 500, bonusCoins: 350, message: 'Monthly Zen Scholar! 🌟' };

  return {
    count: newCount,
    lastCompletedDate: new Date(),
    isNewDay: true,
    milestoneBonus,
  };
};

export const applyProgression = (user, xpEarned, coinsEarned, category) => {
  let level = user.level || 1;
  let currentXP = (user.currentXP || 0) + xpEarned;
  let cozyCoins = (user.cozyCoins || 0) + coinsEarned;
  let xpThreshold = calculateXPToNextLevel(level);
  let leveledUp = false;
  let levelsGained = 0;

  while (currentXP >= xpThreshold) {
    currentXP -= xpThreshold;
    level += 1;
    leveledUp = true;
    levelsGained += 1;
    xpThreshold = calculateXPToNextLevel(level);
    cozyCoins += 25;
  }

  const skills = {
    intellect: user.skills?.intellect || 0,
    vitality: user.skills?.vitality || 0,
    discipline: user.skills?.discipline || 0,
    creativity: user.skills?.creativity || 0,
  };

  const skillGain = 5;
  if (category && skills[category] !== undefined) {
    skills[category] += skillGain;
  }

  return {
    level,
    currentXP,
    xpToNextLevel: xpThreshold,
    cozyCoins,
    skills,
    leveledUp,
    levelsGained,
  };
};
