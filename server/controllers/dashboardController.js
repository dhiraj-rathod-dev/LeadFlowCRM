const mongoose = require('mongoose');
const Lead = require('../models/Lead');
const User = require('../models/User');
const Activity = require('../models/Activity');

exports.getDashboard = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const matchQuery = {};
    if (req.user.role === 'member') {
      matchQuery.$or = [{ assignedTo: userId }, { createdBy: userId }];
    }

    const totalLeads = await Lead.countDocuments(matchQuery);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayLeads = await Lead.countDocuments({ ...matchQuery, createdAt: { $gte: today } });
    const wonLeads = await Lead.countDocuments({ ...matchQuery, status: 'won' });
    const lostLeads = await Lead.countDocuments({ ...matchQuery, status: 'lost' });
    const wonAgg = await Lead.aggregate([
      { $match: { ...matchQuery, status: 'won' } },
      { $group: { _id: null, total: { $sum: '$budget' } } }
    ]);
    const totalRevenue = wonAgg.length > 0 ? wonAgg[0].total : 0;
    const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : 0;

    const pipeline = await Lead.aggregate([
      { $match: { ...matchQuery, isArchived: false } },
      { $group: { _id: '$status', count: { $sum: 1 }, totalBudget: { $sum: '$budget' } } }
    ]);

    const monthlyLeads = await Lead.aggregate([
      { $match: { ...matchQuery, createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const sourceBreakdown = await Lead.aggregate([
      { $match: matchQuery },
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const priorityBreakdown = await Lead.aggregate([
      { $match: matchQuery },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const recentLeads = await Lead.find(matchQuery)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    const userPerformance = await Lead.aggregate([
      { $match: { assignedTo: { $ne: null } } },
      { $group: { _id: '$assignedTo', total: { $sum: 1 }, won: { $sum: { $cond: [{ $eq: ['$status', 'won'] }, 1, 0] } } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { name: '$user.name', total: 1, won: 1 } },
      { $sort: { total: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      stats: { totalLeads, todayLeads, wonLeads, lostLeads, totalRevenue, conversionRate: parseFloat(conversionRate) },
      pipeline, monthlyLeads, sourceBreakdown, priorityBreakdown, recentLeads, userPerformance
    });
  } catch (error) {
    next(error);
  }
};
