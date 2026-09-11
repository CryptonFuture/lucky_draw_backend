const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  draw: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Draw',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ticketNumber: {
    type: String,
    required: true
  },
  entryNumber: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'won', 'lost', 'cancelled'],
    default: 'active'
  },
  isWinner: {
    type: Boolean,
    default: false
  },
  prizeRank: {
    type: Number,
    default: null
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Compound unique: one user can have multiple entries only if allowed
entrySchema.index({ draw: 1, user: 1, entryNumber: 1 }, { unique: true });
entrySchema.index({ draw: 1, ticketNumber: 1 }, { unique: true });
entrySchema.index({ draw: 1, status: 1 });

module.exports = mongoose.model('Entry', entrySchema);