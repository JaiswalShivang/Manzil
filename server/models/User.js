import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { calculateXPToNextLevel } from '../utils/progression.js';

const inventoryItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  equipped: {
    type: Boolean,
    default: false,
  },
  purchasedAt: {
    type: Date,
    default: Date.now,
  },
  acquiredAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    passwordHash: {
      type: String,
      required: [true, 'Please provide a password'],
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    currentXP: {
      type: Number,
      default: 0,
      min: 0,
    },
    xpToNextLevel: {
      type: Number,
      default: function () {
        return calculateXPToNextLevel(this.level || 1);
      },
    },
    cozyCoins: {
      type: Number,
      default: 50, // Starter coins so the player can buy their first small plant!
      min: 0,
    },
    skills: {
      intellect: { type: Number, default: 0 },
      vitality: { type: Number, default: 0 },
      discipline: { type: Number, default: 0 },
      creativity: { type: Number, default: 0 },
    },
    streak: {
      count: { type: Number, default: 0 },
      lastCompletedDate: { type: Date, default: null },
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    equipped: {
      hair: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
      chest: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
      pants: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
      shoes: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
      weapon: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
      aura: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
    },
    inventory: [inventoryItemSchema],
    refreshTokenHash: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// Transform output to omit sensitive fields
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.refreshTokenHash;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;
