const Lead = require('../models/Lead');
const Note = require('../models/Note');
const Activity = require('../models/Activity');

exports.getLeads = async (req, res, next) => {
  try {
    const {
      page = 1, limit = 25, search, status, priority, source,
      assignedTo, country, industry, sortBy = 'createdAt', sortOrder = 'desc',
      dateFrom, dateTo, isArchived
    } = req.query;
    const query = {};
    if (req.user.role === 'member') {
      query.$or = [{ assignedTo: req.user.id }, { createdBy: req.user.id }];
    }
    if (search) {
      query.$and = query.$or ? [query, { $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ]}] : { $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ]};
    }
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (source) query.source = source;
    if (assignedTo) query.assignedTo = assignedTo;
    if (country) query.country = { $regex: country, $options: 'i' };
    if (industry) query.industry = { $regex: industry, $options: 'i' };
    if (isArchived !== undefined) query.isArchived = isArchived === 'true';
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort(sort)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    res.json({ leads, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

exports.getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    const notes = await Note.find({ leadId: lead._id }).populate('userId', 'name email').sort({ createdAt: -1 });
    const activities = await Activity.find({ leadId: lead._id }).populate('performedBy', 'name email').sort({ createdAt: -1 }).limit(50);
    res.json({ lead, notes, activities });
  } catch (error) {
    next(error);
  }
};

exports.createLead = async (req, res, next) => {
  try {
    const leadData = { ...req.body, createdBy: req.user.id };
    const lead = await Lead.create(leadData);
    await Activity.create({
      leadId: lead._id,
      action: 'created',
      performedBy: req.user.id,
      details: `Lead "${lead.name}" was created`
    });
    const populated = await Lead.findById(lead._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    res.status(201).json({ lead: populated });
  } catch (error) {
    next(error);
  }
};

exports.updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    const oldStatus = lead.status;
    Object.assign(lead, req.body);
    await lead.save();
    const changes = [];
    for (const key of Object.keys(req.body)) {
      if (key !== 'status' && lead[key] !== undefined) {
        changes.push(`${key}: "${lead[key]}"`);
      }
    }
    await Activity.create({
      leadId: lead._id,
      action: 'updated',
      performedBy: req.user.id,
      details: changes.length > 0 ? `Updated ${changes.join(', ')}` : 'Lead updated',
      oldValue: oldStatus,
      newValue: lead.status
    });
    const populated = await Lead.findById(lead._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    res.json({ lead: populated });
  } catch (error) {
    next(error);
  }
};

exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    await Activity.create({
      leadId: lead._id,
      action: 'deleted',
      performedBy: req.user.id,
      details: `Lead "${lead.name}" was deleted`
    });
    await Note.deleteMany({ leadId: lead._id });
    await Activity.deleteMany({ leadId: lead._id });
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { leadId, status } = req.body;
    const lead = await Lead.findById(leadId);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    const oldStatus = lead.status;
    lead.status = status;
    await lead.save();
    await Activity.create({
      leadId: lead._id,
      action: 'status_changed',
      performedBy: req.user.id,
      details: `Status changed from "${oldStatus}" to "${status}"`,
      oldValue: oldStatus,
      newValue: status
    });
    res.json({ lead });
  } catch (error) {
    next(error);
  }
};

exports.assignLead = async (req, res, next) => {
  try {
    const { leadId, assignedTo } = req.body;
    const lead = await Lead.findById(leadId);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    lead.assignedTo = assignedTo;
    await lead.save();
    const populated = await Lead.findById(lead._id).populate('assignedTo', 'name email');
    await Activity.create({
      leadId: lead._id,
      action: 'assigned',
      performedBy: req.user.id,
      details: `Lead assigned to ${populated.assignedTo ? populated.assignedTo.name : 'Unassigned'}`,
      newValue: assignedTo
    });
    res.json({ lead: populated });
  } catch (error) {
    next(error);
  }
};

exports.archiveLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    lead.isArchived = !lead.isArchived;
    lead.status = lead.isArchived ? 'archived' : 'new';
    await lead.save();
    await Activity.create({
      leadId: lead._id,
      action: lead.isArchived ? 'archived' : 'restored',
      performedBy: req.user.id,
      details: lead.isArchived ? 'Lead archived' : 'Lead restored'
    });
    res.json({ lead });
  } catch (error) {
    next(error);
  }
};

exports.pipeline = async (req, res, next) => {
  try {
    const pipeline = await Lead.aggregate([
      { $match: { isArchived: false } },
      { $group: { _id: '$status', count: { $sum: 1 }, totalBudget: { $sum: '$budget' } } },
      { $sort: { _id: 1 } }
    ]);
    res.json({ pipeline });
  } catch (error) {
    next(error);
  }
};
