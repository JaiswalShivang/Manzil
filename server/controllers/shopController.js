import Item from '../models/Item.js';
import User from '../models/User.js';
import { populateUserEquipped } from './equipController.js';

export const getShopItems = async (req, res, next) => {
  try {
    const { itemType, slot } = req.query;
    const filter = {};

    const targetType = itemType || slot;
    if (targetType) {
      filter.itemType = targetType;
    }

    const items = await Item.find(filter)
      .sort({ itemType: 1, requiredLevel: 1, goldCost: 1 })
      .lean();

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
        message: 'Item not found in Vault catalog',
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found',
      });
    }

    // Check if user already owns this item
    const alreadyOwns = (user.inventory || []).some((entry) => {
      const entryItemId = (entry?.itemId?._id || entry?.itemId || entry?._id || entry)?.toString();
      return entryItemId === item._id.toString();
    });

    if (alreadyOwns) {
      return res.status(400).json({
        success: false,
        message: `Item "${item.name}" already acquired in inventory.`,
      });
    }

    // Server-side level requirement check
    if (user.level < item.requiredLevel) {
      return res.status(403).json({
        success: false,
        message: `Clearance level insufficient: Unlocks at Level ${item.requiredLevel}.`,
      });
    }

    // Server-side gold currency check
    if (user.cozyCoins < item.goldCost) {
      return res.status(400).json({
        success: false,
        message: `Insufficient Gold: You have ${user.cozyCoins} G, but need ${item.goldCost} G.`,
      });
    }

    const targetSlot = item.itemType === 'crystal' ? 'aura' : item.itemType;
    const updateOps = {
      $inc: { cozyCoins: -item.goldCost },
      $push: {
        inventory: {
          itemId: item._id,
          purchasedAt: new Date(),
        },
      },
    };
    if (['hair', 'chest', 'pants', 'shoes', 'weapon', 'aura'].includes(targetSlot)) {
      updateOps.$set = { [`equipped.${targetSlot}`]: item._id };
    }

    // Atomic purchase & equip in single query
    const updatedUser = await populateUserEquipped(
      User.findByIdAndUpdate(user._id, updateOps, { new: true })
    );

    return res.status(200).json({
      success: true,
      message: `REQUISITION COMPLETE: "${item.name.toUpperCase()}" ACQUIRED & EQUIPPED.`,
      item,
      cozyCoins: updatedUser.cozyCoins,
      inventory: updatedUser.inventory,
      equipped: updatedUser.equipped,
      user: {
        _id: updatedUser._id,
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
