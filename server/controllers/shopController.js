import Item from '../models/Item.js';
import User from '../models/User.js';


export const getShopItems = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = {};

    if (category && ['plant', 'lamp', 'poster', 'rug', 'mug', 'wallpaper'].includes(category)) {
      filter.category = category;
    }

    const items = await Item.find(filter).sort({ unlockLevel: 1, cost: 1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    next(error);
  }
};

export const purchaseItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Decoration item not found in shop',
      });
    }

    const user = await User.findById(req.user._id).populate('inventory.itemId');

    const alreadyOwns = user.inventory.some(
      (entry) => entry.itemId && entry.itemId._id.toString() === item._id.toString()
    );

    if (alreadyOwns) {
      return res.status(400).json({
        success: false,
        message: `You already own the ${item.name}!`,
      });
    }

    if (user.level < item.unlockLevel) {
      return res.status(403).json({
        success: false,
        message: `This item unlocks at Level ${item.unlockLevel}. Keep studying to level up! 📚`,
      });
    }

    if (user.cozyCoins < item.cost) {
      return res.status(400).json({
        success: false,
        message: `Not enough Cozy Coins! You have ${user.cozyCoins} coins, but need ${item.cost}. Complete more quests to earn coins. 🪙`,
      });
    }

    user.cozyCoins -= item.cost;

    if (['wallpaper', 'rug', 'lamp'].includes(item.category)) {
      user.inventory.forEach((entry) => {
        if (entry.itemId && entry.itemId.category === item.category) {
          entry.equipped = false;
        }
      });
    }

    user.inventory.push({
      itemId: item._id,
      equipped: true,
      acquiredAt: new Date(),
    });

    await user.save();

    const updatedUser = await User.findById(user._id).populate('inventory.itemId');

    return res.status(200).json({
      success: true,
      message: `Yay! You bought the ${item.name} and placed it in your study room! 🪴`,
      item,
      cozyCoins: updatedUser.cozyCoins,
      inventory: updatedUser.inventory,
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
