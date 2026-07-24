const Activity = require('../models/Activity');

exports.getActivities = async (req, res, next) => {
  try {
    const { leadId, page = 1, limit = 50 } = req.query;
    const query = {};
    if (leadId) query.leadId = leadId;
    if (req.user.role === 'member') {
      query.performedBy = req.user.id;
    }
    const total = await Activity.countDocuments(query);
    const activities = await Activity.find(query)
      .populate('performedBy', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json({ activities, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};
