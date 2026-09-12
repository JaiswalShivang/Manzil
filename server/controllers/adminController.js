import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import AdmZip from 'adm-zip';
import multer from 'multer';
import User from '../models/User.js';
import Quest from '../models/Quest.js';
import Item from '../models/Item.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy-load sharp to prevent serverless function crash on platforms without native bindings
let sharpModule = null;
const getSharp = async () => {
  if (!sharpModule) {
    try {
      sharpModule = (await import('sharp')).default;
    } catch (err) {
      console.warn('sharp native module could not be loaded:', err.message);
    }
  }
  return sharpModule;
};

// Configure multer storage (use /tmp in serverless/Vercel environments to avoid read-only filesystem crash)
const tempDir = process.env.VERCEL ? '/tmp' : path.resolve(__dirname, '../temp');
try {
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
} catch (dirErr) {
  console.warn('Temp directory creation warning:', dirErr.message);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

export const uploadZipMiddleware = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() !== '.zip') {
      return cb(new Error('Only .zip archive files are permitted'));
    }
    cb(null, true);
  },
});

// Helper to infer itemType and zIndex from filename / folder
export const inferItemMetadata = (rawName) => {
  const lower = rawName.toLowerCase();

  if (lower.startsWith('hair-') || lower.includes('/hair/')) {
    return { itemType: 'hair', zIndex: 3 };
  }
  if (lower.startsWith('shirt-') || lower.includes('/chest/') || lower.includes('/shirt/')) {
    return { itemType: 'chest', zIndex: 2 };
  }
  if (lower.startsWith('pants-') || lower.includes('/pants/')) {
    return { itemType: 'pants', zIndex: 1 };
  }
  if (lower.startsWith('shoes-') || lower.includes('/shoes/')) {
    return { itemType: 'shoes', zIndex: 1 };
  }
  if (
    lower.startsWith('sword-') ||
    lower.startsWith('crossbow') ||
    lower.startsWith('scythe') ||
    lower.startsWith('shield') ||
    lower.startsWith('gnarled') ||
    lower.includes('/weapon/')
  ) {
    return { itemType: 'weapon', zIndex: 4 };
  }
  if (
    lower.startsWith('crystal-') ||
    lower.startsWith('magic-') ||
    lower.includes('/aura/')
  ) {
    return { itemType: 'aura', zIndex: 5 };
  }
  if (lower.startsWith('main-avatar') || lower.includes('base')) {
    return { itemType: 'base', zIndex: 0 };
  }

  return { itemType: null, zIndex: 2 };
};

// Helper to strip underlying character body pixels from equipment sprite sheets
const stripBodyPixels = async (spriteBuffer, baseRaw) => {
  if (!baseRaw) return spriteBuffer;
  const sharp = await getSharp();
  if (!sharp) return spriteBuffer;

  const { data: itemData } = await sharp(spriteBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const outputData = Buffer.from(itemData);
  for (let i = 0; i < outputData.length; i += 4) {
    const ia = outputData[i + 3];
    if (ia === 0) continue;
    const ba = baseRaw[i + 3];
    if (ba === 0) continue;

    const diff =
      Math.abs(baseRaw[i] - outputData[i]) +
      Math.abs(baseRaw[i + 1] - outputData[i + 1]) +
      Math.abs(baseRaw[i + 2] - outputData[i + 2]);

    if (diff < 20) {
      outputData[i + 3] = 0;
    }
  }

  return sharp(outputData, {
    raw: {
      width: 256,
      height: 64,
      channels: 4,
    },
  })
    .webp({ lossless: true })
    .toBuffer();
};

// Helper to humanize item name
const humanizeName = (name) => {
  return name
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

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
      message: `Agent ${user.username} clearance & status updated.`,
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

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Root administrative user cannot be purged.' });
    }

    await Quest.deleteMany({ userId: id });
    await User.findByIdAndDelete(id);

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
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const quests = await Quest.find(filter)
      .populate('userId', 'username email level')
      .sort({ createdAt: -1 })
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
    const quest = await Quest.findById(id);

    if (!quest) {
      return res.status(404).json({ success: false, message: 'Quest not found' });
    }

    quest.status = 'completed';
    quest.completedAt = new Date();
    await quest.save();

    await User.findByIdAndUpdate(quest.userId, {
      $inc: {
        cozyCoins: quest.coinReward,
        currentXP: quest.xpReward,
      },
    });

    res.status(200).json({
      success: true,
      message: `Directive "${quest.title}" verified and completed.`,
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

// GET /api/admin/items (or /api/admin/shop)
export const getItems = async (req, res, next) => {
  try {
    const items = await Item.find({}).sort({ itemType: 1, requiredLevel: 1, goldCost: 1 }).lean();
    res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    next(error);
  }
};

// Alias for backwards-compatibility
export const getShopItems = getItems;

// PATCH /api/admin/items/:id
export const updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, requiredLevel, goldCost, zIndex, itemType } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (requiredLevel !== undefined) updates.requiredLevel = Number(requiredLevel);
    if (goldCost !== undefined) updates.goldCost = Number(goldCost);
    if (zIndex !== undefined) updates.zIndex = Number(zIndex);
    if (itemType !== undefined) updates.itemType = itemType;

    const item = await Item.findByIdAndUpdate(id, { $set: updates }, { new: true });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.status(200).json({
      success: true,
      message: `Asset "${item.name}" updated successfully.`,
      item,
    });
  } catch (error) {
    next(error);
  }
};

// Alias for backwards-compatibility
export const updateShopItem = updateItem;

// DELETE /api/admin/items/:id
export const deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    // 1. Delete .webp file from disk if it exists
    if (item.webpUrl) {
      const relativePath = item.webpUrl.startsWith('/') ? item.webpUrl.slice(1) : item.webpUrl;
      const filePathOnDisk = path.resolve(__dirname, '../public', relativePath.replace(/^assets\//, 'assets/'));
      if (fs.existsSync(filePathOnDisk)) {
        try {
          fs.unlinkSync(filePathOnDisk);
        } catch (fileErr) {
          console.warn(`Could not delete file ${filePathOnDisk}:`, fileErr.message);
        }
      }
    }

    // 2. Remove item ID from any user's inventory
    await User.updateMany({ inventory: item._id }, { $pull: { inventory: item._id } });

    // 3. Unset from any user's equipped slots
    const targetSlot = item.itemType === 'crystal' ? 'aura' : item.itemType;
    if (['hair', 'chest', 'pants', 'shoes', 'weapon', 'aura'].includes(targetSlot)) {
      await User.updateMany(
        { [`equipped.${targetSlot}`]: item._id },
        { $set: { [`equipped.${targetSlot}`]: null } }
      );
    }

    // 4. Delete item document
    await Item.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: `Asset "${item.name}" decommissioned. File removed and user inventory/equipped references cleaned.`,
    });
  } catch (error) {
    next(error);
  }
};

// Alias for backwards-compatibility
export const deleteShopItem = deleteItem;

// POST /api/admin/assets/upload (multipart/form-data, .zip file)
export const uploadZipAssets = async (req, res, next) => {
  let uploadedFilePath = req.file?.path;
  const skipped = [];
  let importedCount = 0;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid .zip file in the "file" field',
      });
    }

    const publicAssetsDir = path.resolve(__dirname, '../public/assets');
    const zip = new AdmZip(uploadedFilePath);
    const zipEntries = zip.getEntries();

    // Security check: Zip slip validation
    for (const entry of zipEntries) {
      if (entry.isDirectory) continue;
      const raw = entry.entryName;
      if (raw.includes('..') || raw.startsWith('/') || raw.startsWith('\\') || path.isAbsolute(raw)) {
        return res.status(400).json({
          success: false,
          message: `Security Violation: Zip entry "${entry.entryName}" contains path traversal characters (zip-slip attempt detected).`,
        });
      }
    }

    // Load base body avatar pixels for subtracting body from equipment overlays
    let baseBodyRaw = null;
    const baseAvatarPath = path.join(publicAssetsDir, 'base', 'main-avatar.webp');
    if (fs.existsSync(baseAvatarPath)) {
      try {
        const baseRes = await sharp(baseAvatarPath)
          .ensureAlpha()
          .raw()
          .toBuffer({ resolveWithObject: true });
        baseBodyRaw = baseRes.data;
      } catch (baseErr) {
        console.warn('Could not load base avatar for pixel subtraction:', baseErr.message);
      }
    }

    // Group entries or find image assets
    // Check if zip contains LPC folder structure (e.g. standard/walk.png) or direct webp/png files
    const hasStandardWalk = zipEntries.some(e => e.entryName === 'standard/walk.png' || e.entryName.endsWith('/walk.png'));

    if (hasStandardWalk) {
      // LPC archive: identify by uploaded original filename (e.g. hair-bob.zip)
      const zipBaseName = path.basename(req.file.originalname, path.extname(req.file.originalname));
      const meta = inferItemMetadata(zipBaseName);

      if (!meta.itemType) {
        skipped.push({
          filename: req.file.originalname,
          reason: 'Could not infer itemType from archive name prefix (must start with hair-, shirt-, pants-, shoes-, sword-, crossbow-, scythe-, shield-, gnarled-, crystal-, magic-, or main-avatar)',
        });
      } else {
        const walkEntry = zipEntries.find(e => e.entryName === 'standard/walk.png' || e.entryName.endsWith('/walk.png'));
        const buffer = walkEntry.getData();
        const imgMeta = await sharp(buffer).metadata();

        const destSubdir = meta.itemType === 'base' ? 'base' : meta.itemType;
        const outDir = path.join(publicAssetsDir, destSubdir);
        fs.mkdirSync(outDir, { recursive: true });

        const outWebpPath = path.join(outDir, `${zipBaseName}.webp`);

        let spriteBuffer;
        if (imgMeta.width >= 256 && imgMeta.height >= 192) {
          spriteBuffer = await sharp(buffer)
            .extract({ left: 0, top: 128, width: 256, height: 64 })
            .webp({ lossless: true })
            .toBuffer();
        } else {
          spriteBuffer = await sharp(buffer)
            .resize(256, 64, { fit: 'cover' })
            .webp({ lossless: true })
            .toBuffer();
        }

        if (meta.itemType !== 'base' && baseBodyRaw) {
          spriteBuffer = await stripBodyPixels(spriteBuffer, baseBodyRaw);
        }

        fs.writeFileSync(outWebpPath, spriteBuffer);

        if (meta.itemType !== 'base') {
          const webpUrl = `/assets/${meta.itemType}/${zipBaseName}.webp`;
          const itemName = humanizeName(zipBaseName);

          await Item.findOneAndUpdate(
            { webpUrl },
            {
              name: itemName,
              itemType: meta.itemType,
              requiredLevel: 1,
              goldCost: 50,
              webpUrl,
              frameCount: 4,
              frameWidth: 64,
              frameHeight: 64,
              zIndex: meta.zIndex,
            },
            { upsert: true, new: true }
          );
        }

        importedCount++;
      }
    } else {
      // Process individual webp/png entries in the zip
      for (const entry of zipEntries) {
        if (entry.isDirectory) continue;

        const ext = path.extname(entry.name).toLowerCase();
        if (ext !== '.webp' && ext !== '.png') {
          skipped.push({
            filename: entry.entryName,
            reason: `Invalid file extension "${ext}". Only .webp and .png are allowed.`,
          });
          continue;
        }

        const meta = inferItemMetadata(entry.entryName);
        if (!meta.itemType) {
          skipped.push({
            filename: entry.entryName,
            reason: 'Could not infer itemType from path/prefix (e.g. hair-*, shirt-*, pants-*, shoes-*, sword-*, crystal-*)',
          });
          continue;
        }

        const buffer = entry.getData();
        const destSubdir = meta.itemType === 'base' ? 'base' : meta.itemType;
        const outDir = path.join(publicAssetsDir, destSubdir);
        fs.mkdirSync(outDir, { recursive: true });

        const slug = path.basename(entry.name, ext);
        const outWebpPath = path.join(outDir, `${slug}.webp`);

        const imgMeta = await sharp(buffer).metadata();
        let spriteBuffer;
        if (imgMeta.width >= 256 && imgMeta.height >= 192) {
          spriteBuffer = await sharp(buffer)
            .extract({ left: 0, top: 128, width: 256, height: 64 })
            .webp({ lossless: true })
            .toBuffer();
        } else if (imgMeta.width === 256 && imgMeta.height === 64 && ext === '.webp') {
          spriteBuffer = buffer;
        } else {
          spriteBuffer = await sharp(buffer)
            .resize(256, 64, { fit: 'cover' })
            .webp({ lossless: true })
            .toBuffer();
        }

        if (meta.itemType !== 'base' && baseBodyRaw) {
          spriteBuffer = await stripBodyPixels(spriteBuffer, baseBodyRaw);
        }

        fs.writeFileSync(outWebpPath, spriteBuffer);

        if (meta.itemType !== 'base') {
          const webpUrl = `/assets/${meta.itemType}/${slug}.webp`;
          const itemName = humanizeName(slug);

          await Item.findOneAndUpdate(
            { webpUrl },
            {
              name: itemName,
              itemType: meta.itemType,
              requiredLevel: 1,
              goldCost: 50,
              webpUrl,
              frameCount: 4,
              frameWidth: 64,
              frameHeight: 64,
              zIndex: meta.zIndex,
            },
            { upsert: true, new: true }
          );
        }

        importedCount++;
      }
    }

    return res.status(200).json({
      success: true,
      imported: importedCount,
      skipped,
      message: `Asset import completed: ${importedCount} imported, ${skipped.length} skipped.`,
    });
  } catch (error) {
    next(error);
  } finally {
    // Ongoing cleanup: always delete temp uploaded zip file
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      try {
        fs.unlinkSync(uploadedFilePath);
      } catch (err) {
        console.warn('Could not remove temp uploaded zip file:', err.message);
      }
    }
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
