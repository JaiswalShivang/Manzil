import User from '../models/User.js';
import Item from '../models/Item.js';

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('inventory.itemId');

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
        level: user.level,
        currentXP: user.currentXP,
        xpToNextLevel: user.xpToNextLevel,
        cozyCoins: user.cozyCoins,
        skills: user.skills,
        streak: user.streak,
        inventory: user.inventory,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { equipItemId, unequipItemId } = req.body;

    const user = await User.findById(req.user._id).populate('inventory.itemId');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (equipItemId) {
      const invEntry = user.inventory.find(
        (entry) => entry.itemId && entry.itemId._id.toString() === equipItemId.toString()
      );

      if (!invEntry) {
        return res.status(400).json({
          success: false,
          message: 'You do not own this decoration item yet!',
        });
      }

      const targetCategory = invEntry.itemId.category;
      if (['wallpaper', 'rug', 'lamp'].includes(targetCategory)) {
        user.inventory.forEach((entry) => {
          if (entry.itemId && entry.itemId.category === targetCategory) {
            entry.equipped = false;
          }
        });
      }

      invEntry.equipped = true;
    }

    if (unequipItemId) {
      const invEntry = user.inventory.find(
        (entry) => entry.itemId && entry.itemId._id.toString() === unequipItemId.toString()
      );

      if (invEntry) {
        invEntry.equipped = false;
      }
    }

    await user.save();

    const updatedUser = await User.findById(user._id).populate('inventory.itemId');

    return res.status(200).json({
      success: true,
      message: 'Room decoration updated!',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        level: updatedUser.level,
        currentXP: updatedUser.currentXP,
        xpToNextLevel: updatedUser.xpToNextLevel,
        cozyCoins: updatedUser.cozyCoins,
        skills: updatedUser.skills,
        streak: updatedUser.streak,
        inventory: updatedUser.inventory,
      },
    });
  } catch (error) {
    next(error);
  }
};
