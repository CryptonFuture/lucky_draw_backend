const mongoose = require('mongoose');

const prizeSchema = new mongoose.Schema({
  rank: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  value: {
    type: String,
    default: ''
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  winnerEntry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entry',
    default: null
  }
});

const drawSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Draw title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['draft', 'upcoming', 'active', 'drawing', 'completed', 'cancelled'],
    default: 'draft'
  },
  maxParticipants: {
    type: Number,
    default: 0 // 0 = unlimited
  },
  entryFee: {
    type: Number,
    default: 0 // free by default
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  drawDate: {
    type: Date,
    default: null
  },
  prizes: [prizeSchema],
  totalEntries: {
    type: Number,
    default: 0
  },
  allowMultipleEntries: {
    type: Boolean,
    default: false
  },
  maxEntriesPerUser: {
    type: Number,
    default: 1
  },
  rules: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  drawnBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  drawMethod: {
    type: String,
    enum: ['python-secure', 'node-random'],
    default: 'python-secure'
  },
  seed: {
    type: String,
    default: null // for transparency / verification
  }
}, {
  timestamps: true
});

drawSchema.index({ status: 1, startDate: 1, endDate: 1 });
drawSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Draw', drawSchema);