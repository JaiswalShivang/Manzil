import Item from '../models/Item.js';
import User from '../models/User.js';

export const populateUserEquipped = async (userQuery) => {
  return await userQuery
    .populate('equipped.hair')
    .populate('equipped.chest')
    .populate('equipped.pants')
    .populate('equipped.shoes')
    .populate('equipped.weapon')
    .populate('equipped.aura')
    .populate('inventory.itemId');
};

export const equipItem = async (req, res, next) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide itemId to equip',
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
        message: 'User account not found',
      });
    }

    // Verify ownership in inventory
    const ownsItem = (user.inventory || []).some((invId) => {
      const idStr = (invId?._id || invId?.itemId || invId).toString();
      return idStr === item._id.toString();
    });

    if (!ownsItem) {
      return res.status(403).json({
        success: false,
        message: `Security violation: Item "${item.name}" is not owned in your inventory.`,
      });
    }

    // Verify level clearance
    if (user.level < item.requiredLevel) {
      return res.status(403).json({
        success: false,
        message: `Security clearance insufficient: Requires Level ${item.requiredLevel}, but your level is ${user.level}.`,
      });
    }

    if (!user.equipped) {
      user.equipped = {
        hair: null,
        chest: null,
        pants: null,
        shoes: null,
        weapon: null,
        aura: null,
      };
    }

    const targetSlot = item.itemType === 'crystal' ? 'aura' : item.itemType;
    if (!['hair', 'chest', 'pants', 'shoes', 'weapon', 'aura'].includes(targetSlot)) {
      return res.status(400).json({
        success: false,
        message: `Invalid equipment slot: ${targetSlot}`,
      });
    }

    const updatedUser = await populateUserEquipped(
      User.findByIdAndUpdate(
        user._id,
        { $set: { [`equipped.${targetSlot}`]: item._id } },
        { new: true }
      )
    );

    return res.status(200).json({
      success: true,
      message: `EQUIPPED: ${item.name.toUpperCase()} MOUNTED TO ${targetSlot.toUpperCase()}`,
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

export const unequipSlot = async (req, res, next) => {
  try {
    const { itemType, slot, itemId } = req.body;
    let targetSlot = itemType || slot;

    // Resolve slot by itemId if provided
    if (!targetSlot && itemId) {
      const item = await Item.findById(itemId);
      if (item) {
        targetSlot = item.itemType === 'crystal' ? 'aura' : item.itemType;
      } else {
        // Look through user's currently equipped slots
        const u = await User.findById(req.user._id);
        if (u?.equipped) {
          for (const [s, val] of Object.entries(u.equipped)) {
            if (val && val.toString() === itemId.toString()) {
              targetSlot = s;
              break;
            }
          }
        }
      }
    }

    // Normalize crystal -> aura
    if (targetSlot === 'crystal') {
      targetSlot = 'aura';
    }

    if (!targetSlot || !['hair', 'chest', 'pants', 'shoes', 'weapon', 'aura'].includes(targetSlot)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid equipment slot or itemId to unequip',
      });
    }

    // Atomic unset and populate in single query
    const updatedUser = await populateUserEquipped(
      User.findByIdAndUpdate(
        req.user._id,
        { $set: { [`equipped.${targetSlot}`]: null } },
        { new: true }
      )
    );

    return res.status(200).json({
      success: true,
      message: `UNEQUIPPED: ${targetSlot.toUpperCase()} SLOT CLEARED`,
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
