import mongoose from 'mongoose';
import User from '../models/User.js';
import Quest from '../models/Quest.js';
import Item from '../models/Item.js';

const defaultShopItems = [
  { name: 'Potted Succulent', description: 'Hardy desert plant requiring minimal hydration.', category: 'plant', cost: 40, unlockLevel: 1, imageKey: 'plant_succulent' },
  { name: 'Monstera Deliciosa', description: 'Broad foliage oxygenator for cognitive endurance.', category: 'plant', cost: 75, unlockLevel: 2, imageKey: 'plant_monstera' },
  { name: 'Bonsai Pine', description: 'Miniature precision coniferous specimen.', category: 'plant', cost: 160, unlockLevel: 4, imageKey: 'plant_bonsai' },
  { name: 'Anglepoise Task Lamp', description: 'Directional industrial luminaire with adjustable joints.', category: 'lamp', cost: 55, unlockLevel: 1, imageKey: 'lamp_anglepoise' },
  { name: 'Edison Filament Bulb', description: 'Warm tungsten radiator for night-shift focus.', category: 'lamp', cost: 90, unlockLevel: 2, imageKey: 'lamp_edison' },
  { name: 'Bauhaus Exhibition 1923', description: 'Original lithographic print of Constructivist geometry.', category: 'poster', cost: 65, unlockLevel: 1, imageKey: 'poster_bauhaus' },
  { name: 'Grid Coordinate Map', description: 'Cartographic blueprint for systemic navigation.', category: 'poster', cost: 110, unlockLevel: 3, imageKey: 'poster_grid' },
  { name: 'Geometric Wool Mat', description: 'Linear woven floor barrier with acoustic damping.', category: 'rug', cost: 85, unlockLevel: 2, imageKey: 'rug_geometric' },
  { name: 'Enamel Ration Mug', description: 'Sturdy steel vessel for dark roast caffeine fuel.', category: 'mug', cost: 35, unlockLevel: 1, imageKey: 'mug_enamel' },
  { name: 'Raw Concrete Bulkhead', description: 'Minimalist industrial wall surface finish.', category: 'wallpaper', cost: 120, unlockLevel: 3, imageKey: 'wallpaper_concrete' },
];

// GET /api/admin/stats
export const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalQuests, completedQuests, pendingQuests, totalItems, goldAgg] =
      await Promise.all([
        User.countDocuments(),
        Quest.countDocuments(),
        Quest.countDocuments({ status: 'completed' }),
        Quest.countDocuments({ status: 'pending' }),
        Item.countDocuments(),
        User.aggregate([
          { $group: { _id: null, totalGold: { $sum: '$cozyCoins' }, avgLevel: { $avg: '$level' } } },
        ]),
      ]);

    const totalGold = goldAgg[0]?.totalGold || 0;
    const avgLevel = goldAgg[0]?.avgLevel ? Math.round(goldAgg[0].avgLevel * 10) / 10 : 1;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalQuests,
        completedQuests,
        pendingQuests,
        totalItems,
        totalGold,
        avgLevel,
        serverTime: new Date().toISOString(),
        dbState: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED',
        nodeVersion: process.version,
        uptimeSeconds: Math.floor(process.uptime()),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
      .select('-passwordHash -refreshTokenHash')
      .sort({ createdAt: -1 })
      .lean();

    // Attach quest count to each user
    const usersWithCounts = await Promise.all(
      users.map(async (u) => {
        const questCount = await Quest.countDocuments({ userId: u._id });
        return {
          ...u,
          questCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: usersWithCounts.length,
      users: usersWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/users/:id
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { level, cozyCoins, role, currentXP, streakCount } = req.body;

    const updates = {};
    if (level !== undefined) updates.level = Number(level);
    if (cozyCoins !== undefined) updates.cozyCoins = Number(cozyCoins);
    if (currentXP !== undefined) updates.currentXP = Number(currentXP);
    if (role !== undefined) updates.role = role;
    if (streakCount !== undefined) updates['streak.count'] = Number(streakCount);

    const user = await User.findByIdAndUpdate(id, { $set: updates }, { new: true })
      .select('-passwordHash -refreshTokenHash');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: `Agent ${user.username} parameters updated.`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Protect primary admin from deletion
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot purge administrator account.' });
    }

    await Promise.all([
      User.findByIdAndDelete(id),
      Quest.deleteMany({ userId: id }),
    ]);

    res.status(200).json({
      success: true,
      message: `Agent ${user.username} and all operational records purged.`,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/quests
export const getQuests = async (req, res, next) => {
  try {
    const { status, limit = 100 } = req.query;
    const query = {};
    if (status) query.status = status;

    const quests = await Quest.find(query)
      .populate('userId', 'username email level')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean();

    res.status(200).json({
      success: true,
      count: quests.length,
      quests,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/quests/:id/complete
export const completeQuest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quest = await Quest.findByIdAndUpdate(
      id,
      { status: 'completed', completedAt: new Date() },
      { new: true }
    );

    if (!quest) {
      return res.status(404).json({ success: false, message: 'Quest directive not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Quest marked as verified complete by Admin.',
      quest,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/quests/:id
export const deleteQuest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quest = await Quest.findByIdAndDelete(id);

    if (!quest) {
      return res.status(404).json({ success: false, message: 'Quest not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Quest directive terminated.',
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/shop
export const getShopItems = async (req, res, next) => {
  try {
    const items = await Item.find({}).sort({ unlockLevel: 1, cost: 1 }).lean();
    res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/shop
export const createShopItem = async (req, res, next) => {
  try {
    const { name, description, category, cost, unlockLevel, imageKey } = req.body;

    if (!name || !description || !category || cost === undefined || !imageKey) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, category, cost, and imageKey are required',
      });
    }

    const item = new Item({
      name,
      description,
      category,
      cost: Number(cost),
      unlockLevel: Number(unlockLevel || 1),
      imageKey,
    });

    await item.save();

    res.status(201).json({
      success: true,
      message: `Asset ${item.name} cataloged in The Vault.`,
      item,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/shop/:id
export const updateShopItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const item = await Item.findByIdAndUpdate(id, { $set: updates }, { new: true });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.status(200).json({
      success: true,
      message: `Asset ${item.name} revised.`,
      item,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/shop/:id
export const deleteShopItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Item.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.status(200).json({
      success: true,
      message: `Asset ${item.name} decommissioned from The Vault.`,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/system/seed
export const reseedShop = async (req, res, next) => {
  try {
    await Item.deleteMany({});
    const inserted = await Item.insertMany(defaultShopItems);

    res.status(200).json({
      success: true,
      message: `The Vault catalog re-seeded with ${inserted.length} standard assets.`,
      count: inserted.length,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/system/grant-all
export const grantAllUsers = async (req, res, next) => {
  try {
    const { goldBonus = 100, levelBonus = 0 } = req.body;

    const updateQuery = {};
    if (goldBonus) updateQuery.$inc = { cozyCoins: Number(goldBonus) };
    if (levelBonus) {
      updateQuery.$inc = updateQuery.$inc || {};
      updateQuery.$inc.level = Number(levelBonus);
    }

    const result = await User.updateMany({}, updateQuery);

    res.status(200).json({
      success: true,
      message: `Granted +${goldBonus} Gold to ${result.modifiedCount} agents across system.`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
};
