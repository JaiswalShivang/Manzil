import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import AdmZip from 'adm-zip';
import sharp from 'sharp';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Item from '../models/Item.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const itemsCatalog = [
  // Hair
  { file: 'hair-buzzcut.zip', name: 'Buzzcut Hair', itemType: 'hair', zIndex: 3, level: 1, cost: 40 },
  { file: 'hair-bob.zip', name: 'Bob Cut Hair', itemType: 'hair', zIndex: 3, level: 2, cost: 70 },
  { file: 'hair-curly.zip', name: 'Curly Waves Hair', itemType: 'hair', zIndex: 3, level: 4, cost: 120 },
  { file: 'hair-pigtails.zip', name: 'Twin Pigtails', itemType: 'hair', zIndex: 3, level: 6, cost: 180 },

  // Chest
  { file: 'shirt-red.zip', name: 'Crimson Tunic', itemType: 'chest', zIndex: 2, level: 1, cost: 50 },
  { file: 'shirt-blue.zip', name: 'Cobalt Tunic', itemType: 'chest', zIndex: 2, level: 2, cost: 80 },
  { file: 'shirt-green.zip', name: 'Forest Tunic', itemType: 'chest', zIndex: 2, level: 4, cost: 140 },
  { file: 'shirt-yellow.zip', name: 'Solar Tunic', itemType: 'chest', zIndex: 2, level: 6, cost: 200 },

  // Pants
  { file: 'pants-blue.zip', name: 'Denim Slacks', itemType: 'pants', zIndex: 1, level: 1, cost: 50 },
  { file: 'pants-green.zip', name: 'Ranger Trousers', itemType: 'pants', zIndex: 1, level: 2, cost: 80 },
  { file: 'pants-red.zip', name: 'Vanguard Greaves', itemType: 'pants', zIndex: 1, level: 4, cost: 140 },
  { file: 'pants-yellow.zip', name: 'Gilded Leggings', itemType: 'pants', zIndex: 1, level: 6, cost: 200 },

  // Shoes
  { file: 'shoes-black.zip', name: 'Obsidian Boots', itemType: 'shoes', zIndex: 1, level: 1, cost: 40 },
  { file: 'shoes-sky.zip', name: 'Aero Walkers', itemType: 'shoes', zIndex: 1, level: 3, cost: 90 },

  // Weapons
  { file: 'sword-blue.zip', name: 'Cerulean Blade', itemType: 'weapon', zIndex: 4, level: 1, cost: 100 },
  { file: 'shield.zip', name: 'Iron Heater Shield', itemType: 'weapon', zIndex: 4, level: 2, cost: 120 },
  { file: 'shield-blue.zip', name: 'Aegis of the Blue', itemType: 'weapon', zIndex: 4, level: 4, cost: 180 },
  { file: 'crossbow.zip', name: 'Arbalest Crossbow', itemType: 'weapon', zIndex: 4, level: 5, cost: 240 },
  { file: 'sword-red.zip', name: 'Flaming Broadsword', itemType: 'weapon', zIndex: 4, level: 6, cost: 300 },
  { file: 'gnarled.zip', name: 'Gnarled Elder Staff', itemType: 'weapon', zIndex: 4, level: 8, cost: 450 },
  { file: 'scythe.zip', name: 'Reaper Scythe', itemType: 'weapon', zIndex: 4, level: 10, cost: 600 },

  // Aura
  { file: 'crystal-green.zip', name: 'Emerald Focus Crystal', itemType: 'aura', zIndex: 5, level: 3, cost: 150 },
  { file: 'crystal-orange.zip', name: 'Amber Focus Crystal', itemType: 'aura', zIndex: 5, level: 5, cost: 250 },
  { file: 'magic-light.zip', name: 'Holy Radiance Aura', itemType: 'aura', zIndex: 5, level: 7, cost: 400 },
  { file: 'magic-copper.zip', name: 'Tesla Surge Aura', itemType: 'aura', zIndex: 5, level: 9, cost: 550 },
  { file: 'magic-dark.zip', name: 'Void Singularity Aura', itemType: 'aura', zIndex: 5, level: 10, cost: 750 },
];

export const processZipToSpriteWebp = async (zipPath, outPath, baseBodyRaw = null) => {
  const zip = new AdmZip(zipPath);
  const entries = zip.getEntries();

  // Find walk.png or standard/walk.png or any webp/png
  let walkEntry = entries.find(e => e.entryName === 'standard/walk.png' || e.entryName.endsWith('walk.png'));
  if (!walkEntry) {
    walkEntry = entries.find(e => e.name.endsWith('.webp') || e.name.endsWith('.png'));
  }

  if (!walkEntry) {
    throw new Error(`No compatible sprite file found in ${zipPath}`);
  }

  const buffer = walkEntry.getData();
  const meta = await sharp(buffer).metadata();

  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  let spriteSharp;
  // If LPC sprite sheet (576x256 or similar), crop south walk (row 2: y=128, height=64, 4 frames: width=256)
  if (meta.width >= 256 && meta.height >= 192) {
    spriteSharp = sharp(buffer)
      .extract({ left: 0, top: 128, width: 256, height: 64 });
  } else if (meta.width === 256 && meta.height === 64) {
    spriteSharp = sharp(buffer);
  } else {
    // Resize / crop fallback to 256x64
    spriteSharp = sharp(buffer)
      .resize(256, 64, { fit: 'cover' });
  }

  if (baseBodyRaw) {
    const { data: itemData } = await spriteSharp
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const outputData = Buffer.from(itemData);
    for (let i = 0; i < outputData.length; i += 4) {
      const ia = outputData[i + 3];
      if (ia === 0) continue;
      const ba = baseBodyRaw[i + 3];
      if (ba === 0) continue;

      const diff =
        Math.abs(baseBodyRaw[i] - outputData[i]) +
        Math.abs(baseBodyRaw[i + 1] - outputData[i + 1]) +
        Math.abs(baseBodyRaw[i + 2] - outputData[i + 2]);

      // If matching base avatar body pixel within tolerance, strip it to keep equipment isolated
      if (diff < 20) {
        outputData[i + 3] = 0;
      }
    }

    await sharp(outputData, {
      raw: {
        width: 256,
        height: 64,
        channels: 4,
      },
    })
      .webp({ lossless: true })
      .toFile(outPath);
  } else {
    await spriteSharp
      .webp({ lossless: true })
      .toFile(outPath);
  }
};

const seed = async () => {
  try {
    await connectDB();

    const rootDir = path.resolve(__dirname, '../../');
    const publicAssetsDir = path.resolve(__dirname, '../public/assets');

    // 1. Process main-avatar base body
    let baseBodyRaw = null;
    const mainAvatarZip = path.join(rootDir, 'main-avatar.zip');
    if (fs.existsSync(mainAvatarZip)) {
      console.log('Extracting main-avatar base body...');
      const baseOut = path.join(publicAssetsDir, 'base', 'main-avatar.webp');
      await processZipToSpriteWebp(mainAvatarZip, baseOut, null);
      console.log(`✓ Base avatar generated at ${baseOut}`);

      const { data } = await sharp(baseOut)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      baseBodyRaw = data;
    }

    // 2. Process catalog items with upsert to preserve existing user equipped references
    for (const itemDef of itemsCatalog) {
      const zipPath = path.join(rootDir, itemDef.file);
      if (!fs.existsSync(zipPath)) {
        console.warn(`Zip not found: ${itemDef.file}, skipping...`);
        continue;
      }

      const slug = path.basename(itemDef.file, '.zip');
      const outWebpPath = path.join(publicAssetsDir, itemDef.itemType, `${slug}.webp`);
      await processZipToSpriteWebp(zipPath, outWebpPath, baseBodyRaw);

      const webpUrl = `/assets/${itemDef.itemType}/${slug}.webp`;

      await Item.findOneAndUpdate(
        { webpUrl },
        {
          name: itemDef.name,
          itemType: itemDef.itemType,
          requiredLevel: itemDef.level,
          goldCost: itemDef.cost,
          webpUrl,
          frameCount: 4,
          frameWidth: 64,
          frameHeight: 64,
          zIndex: itemDef.zIndex,
        },
        { upsert: true, new: true }
      );

      console.log(`✓ Seeded item: [${itemDef.itemType.toUpperCase()}] ${itemDef.name} (LV.${itemDef.level} | ${itemDef.cost}G)`);
    }

    const count = await Item.countDocuments();
    console.log(`\n🎉 Successfully extracted and seeded ${count} avatar items into database!`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
