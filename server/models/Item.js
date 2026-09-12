import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    category: {
      type: String,
      enum: {
        values: ['plant', 'lamp', 'poster', 'rug', 'mug', 'wallpaper'],
        message: '{VALUE} is not a valid item category',
      },
      required: true,
      index: true,
    },
    cost: {
      type: Number,
      required: [true, 'Cost is required'],
      min: [0, 'Cost cannot be negative'],
    },
    unlockLevel: {
      type: Number,
      default: 1,
      min: [1, 'Unlock level must be at least 1'],
    },
    imageKey: {
      type: String,
      required: [true, 'imageKey is required to render decoration'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model('Item', itemSchema);

export default Item;
