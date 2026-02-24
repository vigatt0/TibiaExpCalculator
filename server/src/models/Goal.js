const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    characterName: {
      type: String,
      required: true,
      trim: true,
    },
    currentLevel: {
      type: Number,
      required: true,
      min: 1,
    },
    targetLevel: {
      type: Number,
      required: true,
      min: 2,
    },
    days: {
      type: Number,
      required: true,
      min: 1,
    },
    hoursPerDay: {
      type: Number,
      required: true,
      min: 0.1,
      max: 24,
    },
    currentExp: Number,
    targetExp: Number,
    remainingExp: Number,
    expPerDay: Number,
    expPerHour: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Goal', goalSchema);
