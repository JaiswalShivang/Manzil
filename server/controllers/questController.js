import Quest from '../models/Quest.js';
import User from '../models/User.js';
import { getBaseRewards, applyProgression, updateStreak } from '../utils/progression.js';

export const getQuests = async (req, res, next) => {
  try {
    const { status, category } = req.query;

    const filter = { userId: req.user._id };

    if (status && ['pending', 'completed'].includes(status)) {
      filter.status = status;
    }

    if (category && ['intellect', 'vitality', 'discipline', 'creativity'].includes(category)) {
      filter.category = category;
    }

    const quests = await Quest.find(filter).sort({
      status: 1,
      dueDate: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: quests.length,
      quests,
    });
  } catch (error) {
    next(error);
  }
};

export const createQuest = async (req, res, next) => {
  try {
    const { title, description, category, isRecurring, dueDate } = req.body;

    const baseRewards = getBaseRewards(category);

    const quest = new Quest({
      userId: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      category: category || 'intellect',
      xpReward: baseRewards.xp,
      coinReward: baseRewards.coins,
      isRecurring: Boolean(isRecurring),
      dueDate: dueDate ? new Date(dueDate) : null,
      status: 'pending',
    });

    await quest.save();

    return res.status(201).json({
      success: true,
      message: 'New quest added to your log! ✍️',
      quest,
    });
  } catch (error) {
    next(error);
  }
};

export const updateQuest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, category, isRecurring, dueDate } = req.body;

    const quest = await Quest.findById(id);

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found',
      });
    }

    if (quest.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to modify this quest',
      });
    }

    if (quest.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Completed quests cannot be modified',
      });
    }

    if (title) quest.title = title.trim();
    if (description !== undefined) quest.description = description.trim();
    if (category) {
      quest.category = category;
      const rewards = getBaseRewards(category);
      quest.xpReward = rewards.xp;
      quest.coinReward = rewards.coins;
    }
    if (isRecurring !== undefined) quest.isRecurring = Boolean(isRecurring);
    if (dueDate !== undefined) quest.dueDate = dueDate ? new Date(dueDate) : null;

    await quest.save();

    return res.status(200).json({
      success: true,
      message: 'Quest updated successfully',
      quest,
    });
  } catch (error) {
    next(error);
  }
};

export const completeQuest = async (req, res, next) => {
  try {
    const { id } = req.params;

    // ATOMIC STATE TRANSITION:
    // Only transitions if quest is in 'pending' status and belongs to req.user._id.
    // Rapid duplicate requests or race conditions atomically fail on the second request.
    const quest = await Quest.findOneAndUpdate(
      { _id: id, userId: req.user._id, status: 'pending' },
      { $set: { status: 'completed', completedAt: new Date() } },
      { new: true }
    );

    if (!quest) {
      const existingQuest = await Quest.findOne({ _id: id, userId: req.user._id });
      if (existingQuest && existingQuest.status === 'completed') {
        return res.status(409).json({
          success: false,
          message: 'Directive already executed. Duplicate execution rejected.',
        });
      }
      return res.status(404).json({
        success: false,
        message: 'Quest not found or you do not have permission to complete it',
      });
    }

    const user = await User.findById(req.user._id).populate('inventory.itemId');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found',
      });
    }

    const streakResult = updateStreak(user.streak);
    user.streak = {
      count: streakResult.count,
      lastCompletedDate: streakResult.lastCompletedDate,
    };

    // Rewards are read strictly from stored database document — never from client payload
    let totalXpEarned = quest.xpReward;
    let totalCoinsEarned = quest.coinReward;

    if (streakResult.milestoneBonus) {
      totalXpEarned += streakResult.milestoneBonus.bonusXP;
      totalCoinsEarned += streakResult.milestoneBonus.bonusCoins;
    }

    const progressionResult = applyProgression(
      user,
      totalXpEarned,
      totalCoinsEarned,
      quest.category
    );

    user.level = progressionResult.level;
    user.currentXP = progressionResult.currentXP;
    user.xpToNextLevel = progressionResult.xpToNextLevel;
    user.cozyCoins = progressionResult.cozyCoins;
    user.skills = progressionResult.skills;

    let nextRecurringQuest = null;
    if (quest.isRecurring) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      nextRecurringQuest = new Quest({
        userId: user._id,
        title: quest.title,
        description: quest.description,
        category: quest.category,
        xpReward: quest.xpReward,
        coinReward: quest.coinReward,
        isRecurring: true,
        dueDate: tomorrow,
        status: 'pending',
      });
      await nextRecurringQuest.save();
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: progressionResult.leveledUp
        ? '🎉 Congratulations! You leveled up your cozy space!'
        : '✨ Quest completed! Focus Points and Cozy Coins awarded.',
      quest,
      nextRecurringQuest,
      rewards: {
        xpEarned: totalXpEarned,
        coinsEarned: totalCoinsEarned,
        skillGain: 5,
        skillCategory: quest.category,
        milestoneBonus: streakResult.milestoneBonus,
      },
      progression: {
        leveledUp: progressionResult.leveledUp,
        levelsGained: progressionResult.levelsGained,
        newLevel: user.level,
        currentXP: user.currentXP,
        xpToNextLevel: user.xpToNextLevel,
        cozyCoins: user.cozyCoins,
        skills: user.skills,
        streak: user.streak,
      },
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        level: user.level,
        currentXP: user.currentXP,
        xpToNextLevel: user.xpToNextLevel,
        cozyCoins: user.cozyCoins,
        skills: user.skills,
        streak: user.streak,
        inventory: user.inventory,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const deleteQuest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const quest = await Quest.findById(id);

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found',
      });
    }

    if (quest.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to delete this quest',
      });
    }

    await Quest.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Quest removed from quest log',
      deletedId: id,
    });
  } catch (error) {
    next(error);
  }
};
