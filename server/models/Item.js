import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    itemType: {
      type: String,
      enum: {
        values: ['hair', 'chest', 'pants', 'shoes', 'weapon', 'aura', 'crystal'],
        message: '{VALUE} is not a valid item type',
      },
      required: [true, 'Item type is required'],
      index: true,
    },
    requiredLevel: {
      type: Number,
      default: 1,
      min: [1, 'Required level must be at least 1'],
    },
    goldCost: {
      type: Number,
      required: [true, 'Gold cost is required'],
      min: [0, 'Gold cost cannot be negative'],
    },
    webpUrl: {
      type: String,
      required: [true, 'webpUrl is required to render sprite'],
      trim: true,
    },
    frameCount: {
      type: Number,
      default: 4,
      min: 1,
    },
    frameWidth: {
      type: Number,
      default: 64,
      min: 16,
    },
    frameHeight: {
      type: Number,
      default: 64,
      min: 16,
    },
    zIndex: {
      type: Number,
      default: function () {
        const defaultZ = {
          body: 0,
          pants: 1,
          shoes: 1,
          chest: 2,
          hair: 3,
          weapon: 4,
          aura: 5,
          crystal: 5,
        };
        return defaultZ[this?.itemType] ?? 2;
      },
    },
    // Backwards-compatible aliases for legacy references if any
    slot: {
      type: String,
    },
    cost: {
      type: Number,
    },
    unlockLevel: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);
itemSchema.index({ itemType: 1, requiredLevel: 1, goldCost: 1 });

// Keep aliases synced
itemSchema.pre('save', function (next) {
  this.slot = this.itemType;
  this.cost = this.goldCost;
  this.unlockLevel = this.requiredLevel;
  next();
});

const Item = mongoose.model('Item', itemSchema);

export default Item;
