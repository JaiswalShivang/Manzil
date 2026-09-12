import User from '../models/User.js';
import { populateUserEquipped } from './equipController.js';

export const getMe = async (req, res, next) => {
  try {
    const user = await populateUserEquipped(User.findById(req.user._id));

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        level: user.level,
        currentXP: user.currentXP,
        xpToNextLevel: user.xpToNextLevel,
        cozyCoins: user.cozyCoins,
        skills: user.skills,
        streak: user.streak,
        inventory: user.inventory,
        equipped: user.equipped || {
          hair: null,
          chest: null,
          pants: null,
          shoes: null,
          weapon: null,
          aura: null,
        },
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    await user.save();

    const updatedUser = await populateUserEquipped(User.findById(user._id));

    return res.status(200).json({
      success: true,
      message: 'Profile updated!',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        level: updatedUser.level,
        currentXP: updatedUser.currentXP,
        xpToNextLevel: updatedUser.xpToNextLevel,
        cozyCoins: updatedUser.cozyCoins,
        skills: updatedUser.skills,
        streak: updatedUser.streak,
        inventory: updatedUser.inventory,
        equipped: updatedUser.equipped,
      },
    });
  } catch (error) {
    next(error);
  }
};
