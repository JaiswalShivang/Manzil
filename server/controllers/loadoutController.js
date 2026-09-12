import User from '../models/User.js';
import Item from '../models/Item.js';

// Helper to populate user loadout and inventory
export const populateUserLoadout = (query) => {
  return query
    .populate('inventory')
    .populate('loadout.lamp')
    .populate('loadout.plant')
    .populate('loadout.poster')
    .populate('loadout.rug')
    .populate('loadout.mug')
    .populate('loadout.wallpaper');
};

// PATCH /api/loadout/equip
// Body: { itemId }
export const equipItem = async (req, res, next) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: 'Missing itemId in request body',
      });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in catalog',
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Server-side security: Check ownership
    const ownsItem = (user.inventory || []).some((invId) => {
      const idStr = (invId?._id || invId?.itemId || invId).toString();
      return idStr === item._id.toString();
    });

    if (!ownsItem) {
      return res.status(403).json({
        success: false,
        message: 'Security violation: You do not own this asset.',
      });
    }

    // Server-side security: Check level requirement
    if (user.level < item.unlockLevel) {
      return res.status(403).json({
        success: false,
        message: `Clearance insufficient: Requires Level ${item.unlockLevel}.`,
      });
    }

    const targetSlot = item.slot || item.category;
    if (!['lamp', 'plant', 'poster', 'rug', 'mug', 'wallpaper'].includes(targetSlot)) {
      return res.status(400).json({
        success: false,
        message: `Invalid slot ${targetSlot}`,
      });
    }

    if (!user.loadout) {
      user.loadout = {
        lamp: null,
        plant: null,
        poster: null,
        rug: null,
        mug: null,
        wallpaper: null,
      };
    }

    // Equip item into slot (replaces broken or previous tier)
    user.loadout[targetSlot] = item._id;

    // Backward compatibility: also sync inventory equipped flags if using subdocuments
    if (Array.isArray(user.inventory) && user.inventory[0]?.itemId) {
      user.inventory.forEach((entry) => {
        if (entry.itemId) {
          const entryId = (entry.itemId._id || entry.itemId).toString();
          if (entryId === item._id.toString()) {
            entry.equipped = true;
          }
        }
      });
    }

    await user.save();

    const updatedUser = await populateUserLoadout(User.findById(user._id));

    return res.status(200).json({
      success: true,
      message: `${item.name.toUpperCase()} EQUIPPED IN ${targetSlot.toUpperCase()} SLOT.`,
      slot: targetSlot,
      equippedItem: item,
      loadout: updatedUser.loadout,
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
        loadout: updatedUser.loadout,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/loadout/unequip
// Body: { slot }
export const unequipSlot = async (req, res, next) => {
  try {
    const { slot } = req.body;

    if (!slot || !['lamp', 'plant', 'poster', 'rug', 'mug', 'wallpaper'].includes(slot)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing slot name',
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.loadout) {
      user.loadout = {
        lamp: null,
        plant: null,
        poster: null,
        rug: null,
        mug: null,
        wallpaper: null,
      };
    }

    // Setting slot to null reverts back to Stage 0 (BROKEN)
    user.loadout[slot] = null;

    // Backward compatibility: unequip in inventory subdocuments if present
    if (Array.isArray(user.inventory) && user.inventory[0]?.itemId) {
      user.inventory.forEach((entry) => {
        if (entry.equipped) {
          entry.equipped = false;
        }
      });
    }

    await user.save();

    const updatedUser = await populateUserLoadout(User.findById(user._id));

    return res.status(200).json({
      success: true,
      message: `${slot.toUpperCase()} DEMOUNTED. REVERTED TO BROKEN BASELINE.`,
      slot,
      loadout: updatedUser.loadout,
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
        loadout: updatedUser.loadout,
      },
    });
  } catch (error) {
    next(error);
  }
};
