import mongoose from 'mongoose';
import Item from '../models/Item.js';

let isConnected = false;
let mongoServer = null;

const defaultCatalog = [
  // Hair
  { name: 'Buzzcut Hair', itemType: 'hair', zIndex: 3, requiredLevel: 1, goldCost: 40, webpUrl: '/assets/hair/hair-buzzcut.webp' },
  { name: 'Bob Cut Hair', itemType: 'hair', zIndex: 3, requiredLevel: 2, goldCost: 70, webpUrl: '/assets/hair/hair-bob.webp' },
  { name: 'Curly Waves Hair', itemType: 'hair', zIndex: 3, requiredLevel: 4, goldCost: 120, webpUrl: '/assets/hair/hair-curly.webp' },
  { name: 'Twin Pigtails', itemType: 'hair', zIndex: 3, requiredLevel: 6, goldCost: 180, webpUrl: '/assets/hair/hair-pigtails.webp' },

  // Chest
  { name: 'Crimson Tunic', itemType: 'chest', zIndex: 2, requiredLevel: 1, goldCost: 50, webpUrl: '/assets/chest/shirt-red.webp' },
  { name: 'Cobalt Tunic', itemType: 'chest', zIndex: 2, requiredLevel: 2, goldCost: 80, webpUrl: '/assets/chest/shirt-blue.webp' },
  { name: 'Forest Tunic', itemType: 'chest', zIndex: 2, requiredLevel: 4, goldCost: 140, webpUrl: '/assets/chest/shirt-green.webp' },
  { name: 'Solar Tunic', itemType: 'chest', zIndex: 2, requiredLevel: 6, goldCost: 200, webpUrl: '/assets/chest/shirt-yellow.webp' },

  // Pants
  { name: 'Denim Slacks', itemType: 'pants', zIndex: 1, requiredLevel: 1, goldCost: 50, webpUrl: '/assets/pants/pants-blue.webp' },
  { name: 'Ranger Trousers', itemType: 'pants', zIndex: 1, requiredLevel: 2, goldCost: 80, webpUrl: '/assets/pants/pants-green.webp' },
  { name: 'Vanguard Greaves', itemType: 'pants', zIndex: 1, requiredLevel: 4, goldCost: 140, webpUrl: '/assets/pants/pants-red.webp' },
  { name: 'Gilded Leggings', itemType: 'pants', zIndex: 1, requiredLevel: 6, goldCost: 200, webpUrl: '/assets/pants/pants-yellow.webp' },

  // Shoes
  { name: 'Obsidian Boots', itemType: 'shoes', zIndex: 1, requiredLevel: 1, goldCost: 40, webpUrl: '/assets/shoes/shoes-black.webp' },
  { name: 'Aero Walkers', itemType: 'shoes', zIndex: 1, requiredLevel: 3, goldCost: 90, webpUrl: '/assets/shoes/shoes-sky.webp' },

  // Weapons
  { name: 'Cerulean Blade', itemType: 'weapon', zIndex: 4, requiredLevel: 1, goldCost: 100, webpUrl: '/assets/weapon/sword-blue.webp' },
  { name: 'Iron Heater Shield', itemType: 'weapon', zIndex: 4, requiredLevel: 2, goldCost: 120, webpUrl: '/assets/weapon/shield.webp' },
  { name: 'Aegis of the Blue', itemType: 'weapon', zIndex: 4, requiredLevel: 4, goldCost: 180, webpUrl: '/assets/weapon/shield-blue.webp' },
  { name: 'Arbalest Crossbow', itemType: 'weapon', zIndex: 4, requiredLevel: 5, goldCost: 240, webpUrl: '/assets/weapon/crossbow.webp' },
  { name: 'Flaming Broadsword', itemType: 'weapon', zIndex: 4, requiredLevel: 6, goldCost: 300, webpUrl: '/assets/weapon/sword-red.webp' },
  { name: 'Gnarled Elder Staff', itemType: 'weapon', zIndex: 4, requiredLevel: 8, goldCost: 450, webpUrl: '/assets/weapon/gnarled.webp' },
  { name: 'Reaper Scythe', itemType: 'weapon', zIndex: 4, requiredLevel: 10, goldCost: 600, webpUrl: '/assets/weapon/scythe.webp' },

  // Aura
  { name: 'Emerald Focus Crystal', itemType: 'aura', zIndex: 5, requiredLevel: 3, goldCost: 150, webpUrl: '/assets/aura/crystal-green.webp' },
  { name: 'Amber Focus Crystal', itemType: 'aura', zIndex: 5, requiredLevel: 5, goldCost: 250, webpUrl: '/assets/aura/crystal-orange.webp' },
  { name: 'Holy Radiance Aura', itemType: 'aura', zIndex: 5, requiredLevel: 7, goldCost: 400, webpUrl: '/assets/aura/magic-light.webp' },
  { name: 'Tesla Surge Aura', itemType: 'aura', zIndex: 5, requiredLevel: 9, goldCost: 550, webpUrl: '/assets/aura/magic-copper.webp' },
  { name: 'Void Singularity Aura', itemType: 'aura', zIndex: 5, requiredLevel: 10, goldCost: 750, webpUrl: '/assets/aura/magic-dark.webp' },
];

export const seedCatalogIfEmpty = async () => {
  try {
    const count = await Item.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding initial avatar item catalog into database...');
      for (const item of defaultCatalog) {
        await Item.create({
          ...item,
          frameCount: 4,
          frameWidth: 64,
          frameHeight: 64,
        });
      }
      console.log(`✓ Seeded ${defaultCatalog.length} catalog items successfully!`);
    }
  } catch (err) {
    console.error('Failed to auto-seed catalog:', err.message);
  }
};

export const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  let uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>')) {
    try {
      console.log('⚡ No external MongoDB URI specified. Launching embedded MongoDB instance for seamless local dev...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      if (!mongoServer) {
        mongoServer = await MongoMemoryServer.create();
      }
      uri = mongoServer.getUri();
    } catch (err) {
      console.error('Could not start MongoMemoryServer:', err.message);
    }
  }

  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not defined and embedded DB failed to initialize.');
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 25,
      minPoolSize: 5,
      socketTimeoutMS: 30000,
      family: 4,
    });
    isConnected = true;
    console.log(`🌿 MongoDB Connected: ${conn.connection.host}`);
    await seedCatalogIfEmpty();
    return conn;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production' && !mongoServer) {
      console.warn(`⚠️ External MongoDB connection failed (${error.message}). Falling back to embedded MongoDB...`);
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongoServer = await MongoMemoryServer.create();
        const fallbackUri = mongoServer.getUri();
        const conn = await mongoose.connect(fallbackUri);
        isConnected = true;
        console.log(`🌿 Embedded MongoDB Connected: ${conn.connection.host}`);
        await seedCatalogIfEmpty();
        return conn;
      } catch (innerError) {
        isConnected = false;
        console.error(`❌ Embedded MongoDB Error: ${innerError.message}`);
        throw innerError;
      }
    }
    isConnected = false;
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};
