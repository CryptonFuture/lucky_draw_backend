const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Draw = require('./models/Draw');
const Entry = require('./models/Entry');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lucky_draw');
  console.log('MongoDB Connected for seeding...');
};

const seedData = async () => {
  try {
    await connectDB();

    await Promise.all([
      User.deleteMany(),
      Draw.deleteMany(),
      Entry.deleteMany()
    ]);
    console.log('Cleared existing data');

    // Users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@luckydraw.com',
      password: 'admin123',
      role: 'admin'
    });

    const participants = await User.insertMany([
      { name: 'Ali Khan', email: 'ali@example.com', password: 'pass123', role: 'participant', phone: '03001234567' },
      { name: 'Sara Ahmed', email: 'sara@example.com', password: 'pass123', role: 'participant', phone: '03009876543' },
      { name: 'Bilal Hassan', email: 'bilal@example.com', password: 'pass123', role: 'participant' },
      { name: 'Fatima Zahra', email: 'fatima@example.com', password: 'pass123', role: 'participant' },
      { name: 'Usman Malik', email: 'usman@example.com', password: 'pass123', role: 'participant' },
      { name: 'Ayesha Noor', email: 'ayesha@example.com', password: 'pass123', role: 'participant' },
      { name: 'Hamza Ali', email: 'hamza@example.com', password: 'pass123', role: 'participant' },
      { name: 'Zainab Khan', email: 'zainab@example.com', password: 'pass123', role: 'participant' }
    ]);

    console.log('Users created');

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    // Active Draw
    const activeDraw = await Draw.create({
      title: '🎉 Grand iPhone 16 Giveaway',
      description: 'Win the latest iPhone 16 Pro Max! Enter now for your chance to win this amazing prize. Free entry for everyone.',
      status: 'active',
      maxParticipants: 100,
      entryFee: 0,
      startDate: twoDaysAgo,
      endDate: nextWeek,
      prizes: [
        { rank: 1, title: 'iPhone 16 Pro Max 256GB', description: 'Latest flagship phone', value: 'Rs. 450,000' },
        { rank: 2, title: 'AirPods Pro 2', description: 'Premium wireless earbuds', value: 'Rs. 65,000' },
        { rank: 3, title: 'Amazon Gift Card', description: 'Rs. 10,000 gift card', value: 'Rs. 10,000' }
      ],
      allowMultipleEntries: false,
      maxEntriesPerUser: 1,
      rules: '1. One entry per person\n2. Must be 18+\n3. Winner will be contacted via email\n4. Decision is final',
      createdBy: admin._id,
      isPublic: true
    });

    // Upcoming Draw
    const upcomingDraw = await Draw.create({
      title: '🏍️ Motorcycle Lucky Draw',
      description: 'Win a brand new Honda CG 125! Limited slots available.',
      status: 'upcoming',
      maxParticipants: 50,
      entryFee: 0,
      startDate: tomorrow,
      endDate: twoWeeks,
      prizes: [
        { rank: 1, title: 'Honda CG 125', description: 'Brand new motorcycle', value: 'Rs. 250,000' }
      ],
      allowMultipleEntries: true,
      maxEntriesPerUser: 3,
      rules: 'Up to 3 entries per person allowed.',
      createdBy: admin._id,
      isPublic: true
    });

    // Completed Draw
    const completedDraw = await Draw.create({
      title: '📱 Samsung Galaxy S24 Giveaway',
      description: 'Previous giveaway - completed',
      status: 'completed',
      maxParticipants: 0,
      startDate: weekAgo,
      endDate: twoDaysAgo,
      drawDate: twoDaysAgo,
      prizes: [
        { rank: 1, title: 'Samsung Galaxy S24', description: 'Flagship Android phone', value: 'Rs. 280,000', winner: participants[0]._id },
        { rank: 2, title: 'Galaxy Buds', value: 'Rs. 25,000', winner: participants[2]._id }
      ],
      totalEntries: 5,
      createdBy: admin._id,
      drawnBy: admin._id,
      isPublic: true,
      seed: 'abc123def456'
    });

    console.log('Draws created');

    // Entries for active draw
    const crypto = require('crypto');
    const activeEntries = [];
    for (let i = 0; i < participants.length; i++) {
      const entry = await Entry.create({
        draw: activeDraw._id,
        user: participants[i]._id,
        ticketNumber: 'TKT-' + crypto.randomBytes(4).toString('hex').toUpperCase(),
        entryNumber: 1
      });
      activeEntries.push(entry);
      await User.findByIdAndUpdate(participants[i]._id, { $inc: { totalEntries: 1 } });
    }
    activeDraw.totalEntries = participants.length;
    await activeDraw.save();

    // Entries for completed draw
    for (let i = 0; i < 5; i++) {
      const isWin = i === 0 || i === 2;
      await Entry.create({
        draw: completedDraw._id,
        user: participants[i]._id,
        ticketNumber: 'TKT-' + crypto.randomBytes(4).toString('hex').toUpperCase(),
        entryNumber: 1,
        status: isWin ? 'won' : 'lost',
        isWinner: isWin,
        prizeRank: i === 0 ? 1 : (i === 2 ? 2 : null)
      });
    }

    // Update winner refs
    completedDraw.prizes[0].winnerEntry = (await Entry.findOne({ draw: completedDraw._id, user: participants[0]._id }))._id;
    completedDraw.prizes[1].winnerEntry = (await Entry.findOne({ draw: completedDraw._id, user: participants[2]._id }))._id;
    await completedDraw.save();

    await User.findByIdAndUpdate(participants[0]._id, { totalWins: 1 });
    await User.findByIdAndUpdate(participants[2]._id, { totalWins: 1 });

    console.log('Entries created');
    console.log('\n✅ Seed completed successfully!');
    console.log('=====================================');
    console.log('Admin Login:');
    console.log('  Email: admin@luckydraw.com');
    console.log('  Password: admin123');
    console.log('');
    console.log('Participant Login examples:');
    console.log('  Email: ali@example.com / pass123');
    console.log('  Email: sara@example.com / pass123');
    console.log('=====================================');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();