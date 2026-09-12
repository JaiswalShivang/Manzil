import mongoose from 'mongoose';

const questSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Quest title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    category: {
      type: String,
      enum: {
        values: ['intellect', 'vitality', 'discipline', 'creativity'],
        message: '{VALUE} is not a valid quest category',
      },
      default: 'intellect',
      required: true,
    },
    xpReward: {
      type: Number,
      default: 45,
      min: 10,
      max: 300,
    },
    coinReward: {
      type: Number,
      default: 25,
      min: 5,
      max: 150,
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
      index: true,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user quests filtered by status
questSchema.index({ userId: 1, status: 1 });
questSchema.index({ userId: 1, category: 1 });

const Quest = mongoose.model('Quest', questSchema);

export default Quest;
