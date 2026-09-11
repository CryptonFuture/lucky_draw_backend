const Draw = require('../models/Draw');
const Entry = require('../models/Entry');
const User = require('../models/User');
const axios = require('axios');
const crypto = require('crypto');

// Generate unique ticket number
const generateTicketNumber = () => {
  return 'TKT-' + crypto.randomBytes(4).toString('hex').toUpperCase();
};

// @desc    Get all draws
// @route   GET /api/draws
exports.getDraws = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 12 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Non-admins only see public + non-draft
    if (req.user?.role !== 'admin') {
      query.isPublic = true;
      query.status = { $nin: ['draft'] };
    }

    const draws = await Draw.find(query)
      .populate('createdBy', 'name')
      .populate('prizes.winner', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Draw.countDocuments(query);

    res.json({
      success: true,
      count: draws.length,
      total,
      pages: Math.ceil(total / limit),
      data: draws
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single draw
// @route   GET /api/draws/:id
exports.getDraw = async (req, res) => {
  try {
    const draw = await Draw.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('prizes.winner', 'name email phone')
      .populate('drawnBy', 'name');

    if (!draw) {
      return res.status(404).json({ success: false, message: 'Draw not found' });
    }

    // Get entry count and user's entries
    const entryCount = await Entry.countDocuments({ draw: draw._id, status: { $ne: 'cancelled' } });
    let userEntries = [];
    if (req.user) {
      userEntries = await Entry.find({ draw: draw._id, user: req.user.id });
    }

    res.json({
      success: true,
      data: {
        ...draw.toObject(),
        entryCount,
        userEntries
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create draw
// @route   POST /api/draws
exports.createDraw = async (req, res) => {
  try {
    const draw = await Draw.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json({ success: true, data: draw });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update draw
// @route   PUT /api/draws/:id
exports.updateDraw = async (req, res) => {
  try {
    let draw = await Draw.findById(req.params.id);
    if (!draw) {
      return res.status(404).json({ success: false, message: 'Draw not found' });
    }

    if (draw.status === 'completed' || draw.status === 'drawing') {
      return res.status(400).json({ success: false, message: 'Cannot update a completed or ongoing draw' });
    }

    draw = await Draw.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: draw });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete draw
// @route   DELETE /api/draws/:id
exports.deleteDraw = async (req, res) => {
  try {
    const draw = await Draw.findById(req.params.id);
    if (!draw) {
      return res.status(404).json({ success: false, message: 'Draw not found' });
    }

    if (draw.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Cannot delete a completed draw' });
    }

    await Entry.deleteMany({ draw: draw._id });
    await draw.deleteOne();

    res.json({ success: true, message: 'Draw deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Join a draw (create entry)
// @route   POST /api/draws/:id/join
exports.joinDraw = async (req, res) => {
  try {
    const draw = await Draw.findById(req.params.id);
    if (!draw) {
      return res.status(404).json({ success: false, message: 'Draw not found' });
    }

    if (draw.status !== 'active' && draw.status !== 'upcoming') {
      return res.status(400).json({ success: false, message: 'This draw is not open for entries' });
    }

    const now = new Date();
    if (now < draw.startDate) {
      return res.status(400).json({ success: false, message: 'Draw has not started yet' });
    }
    if (now > draw.endDate) {
      return res.status(400).json({ success: false, message: 'Draw entry period has ended' });
    }

    // Check max participants
    if (draw.maxParticipants > 0 && draw.totalEntries >= draw.maxParticipants) {
      return res.status(400).json({ success: false, message: 'Maximum participants reached' });
    }

    // Check existing entries
    const existingEntries = await Entry.countDocuments({
      draw: draw._id,
      user: req.user.id,
      status: { $ne: 'cancelled' }
    });

    if (!draw.allowMultipleEntries && existingEntries >= 1) {
      return res.status(400).json({ success: false, message: 'You have already joined this draw' });
    }

    if (existingEntries >= draw.maxEntriesPerUser) {
      return res.status(400).json({ success: false, message: `Maximum ${draw.maxEntriesPerUser} entries allowed per user` });
    }

    const entryNumber = existingEntries + 1;
    const ticketNumber = generateTicketNumber();

    const entry = await Entry.create({
      draw: draw._id,
      user: req.user.id,
      ticketNumber,
      entryNumber
    });

    // Update counts
    draw.totalEntries += 1;
    await draw.save();

    await User.findByIdAndUpdate(req.user.id, { $inc: { totalEntries: 1 } });

    const populated = await Entry.findById(entry._id).populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Successfully joined the draw!',
      data: populated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get entries for a draw
// @route   GET /api/draws/:id/entries
exports.getEntries = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const entries = await Entry.find({ draw: req.params.id, status: { $ne: 'cancelled' } })
      .populate('user', 'name email phone')
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Entry.countDocuments({ draw: req.params.id, status: { $ne: 'cancelled' } });

    res.json({
      success: true,
      count: entries.length,
      total,
      data: entries
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Conduct the lucky draw (select winners)
// @route   POST /api/draws/:id/conduct
exports.conductDraw = async (req, res) => {
  try {
    const draw = await Draw.findById(req.params.id);
    if (!draw) {
      return res.status(404).json({ success: false, message: 'Draw not found' });
    }

    if (draw.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Draw already completed' });
    }

    if (draw.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Draw is cancelled' });
    }

    const entries = await Entry.find({ draw: draw._id, status: 'active' }).populate('user', 'name email');
    
    if (entries.length === 0) {
      return res.status(400).json({ success: false, message: 'No entries to draw from' });
    }

    if (draw.prizes.length === 0) {
      return res.status(400).json({ success: false, message: 'No prizes configured for this draw' });
    }

    // Mark as drawing
    draw.status = 'drawing';
    await draw.save();

    const numWinners = Math.min(draw.prizes.length, entries.length);
    let selectedIndices = [];
    let seed = null;

    // Try Python service for secure random
    try {
      const pythonUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';
      const response = await axios.post(`${pythonUrl}/select-winners`, {
        total_entries: entries.length,
        num_winners: numWinners
      }, { timeout: 5000 });

      if (response.data.success) {
        selectedIndices = response.data.indices;
        seed = response.data.seed;
      } else {
        throw new Error('Python service failed');
      }
    } catch (err) {
      // Fallback to Node.js crypto
      console.log('Python service unavailable, using Node.js crypto fallback');
      const indices = Array.from({ length: entries.length }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = crypto.randomInt(0, i + 1);
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      selectedIndices = indices.slice(0, numWinners);
      seed = crypto.randomBytes(16).toString('hex');
    }

    // Assign winners
    const winners = [];
    for (let i = 0; i < numWinners; i++) {
      const entryIndex = selectedIndices[i];
      const entry = entries[entryIndex];
      const prize = draw.prizes[i];

      entry.isWinner = true;
      entry.status = 'won';
      entry.prizeRank = prize.rank;
      await entry.save();

      // Update other entries as lost
      prize.winner = entry.user._id;
      prize.winnerEntry = entry._id;

      await User.findByIdAndUpdate(entry.user._id, { $inc: { totalWins: 1 } });

      winners.push({
        rank: prize.rank,
        prize: prize.title,
        user: entry.user,
        ticketNumber: entry.ticketNumber,
        entryNumber: entry.entryNumber
      });
    }

    // Mark remaining as lost
    await Entry.updateMany(
      { draw: draw._id, status: 'active' },
      { status: 'lost' }
    );

    draw.status = 'completed';
    draw.drawDate = new Date();
    draw.drawnBy = req.user.id;
    draw.seed = seed;
    await draw.save();

    res.json({
      success: true,
      message: 'Lucky draw conducted successfully!',
      data: {
        winners,
        totalEntries: entries.length,
        seed,
        drawDate: draw.drawDate
      }
    });
  } catch (error) {
    // Reset status on error
    await Draw.findByIdAndUpdate(req.params.id, { status: 'active' });
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my entries
// @route   GET /api/draws/my-entries
exports.getMyEntries = async (req, res) => {
  try {
    const entries = await Entry.find({ user: req.user.id })
      .populate('draw', 'title status prizes drawDate')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: entries.length, data: entries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};