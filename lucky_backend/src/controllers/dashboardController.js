const Draw = require('../models/Draw');
const Entry = require('../models/Entry');
const User = require('../models/User');

exports.getDashboard = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';

    if (isAdmin) {
      const [
        totalDraws,
        activeDraws,
        completedDraws,
        totalUsers,
        totalEntries,
        recentDraws,
        recentWinners
      ] = await Promise.all([
        Draw.countDocuments(),
        Draw.countDocuments({ status: 'active' }),
        Draw.countDocuments({ status: 'completed' }),
        User.countDocuments({ role: 'participant' }),
        Entry.countDocuments(),
        Draw.find().sort({ createdAt: -1 }).limit(5).populate('createdBy', 'name'),
        Entry.find({ isWinner: true })
          .populate('user', 'name email')
          .populate('draw', 'title')
          .sort({ updatedAt: -1 })
          .limit(10)
      ]);

      res.json({
        success: true,
        data: {
          overview: {
            totalDraws,
            activeDraws,
            completedDraws,
            totalUsers,
            totalEntries
          },
          recentDraws,
          recentWinners
        }
      });
    } else {
      // Participant dashboard
      const [
        myEntries,
        myWins,
        activeDraws,
        upcomingDraws
      ] = await Promise.all([
        Entry.countDocuments({ user: req.user.id }),
        Entry.countDocuments({ user: req.user.id, isWinner: true }),
        Draw.find({ status: 'active', isPublic: true }).sort({ endDate: 1 }).limit(6),
        Draw.find({ status: 'upcoming', isPublic: true }).sort({ startDate: 1 }).limit(4)
      ]);

      const recentEntries = await Entry.find({ user: req.user.id })
        .populate('draw', 'title status prizes')
        .sort({ createdAt: -1 })
        .limit(10);

      res.json({
        success: true,
        data: {
          overview: {
            myEntries,
            myWins,
            winRate: myEntries > 0 ? ((myWins / myEntries) * 100).toFixed(1) : 0
          },
          activeDraws,
          upcomingDraws,
          recentEntries
        }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};