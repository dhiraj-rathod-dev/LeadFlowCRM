const Note = require('../models/Note');
const Activity = require('../models/Activity');

exports.getNotes = async (req, res, next) => {
  try {
    const { leadId, page = 1, limit = 50 } = req.query;
    const query = {};
    if (leadId) query.leadId = leadId;
    const total = await Note.countDocuments(query);
    const notes = await Note.find(query)
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json({ notes, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

exports.createNote = async (req, res, next) => {
  try {
    const { leadId, message } = req.body;
    const note = await Note.create({ leadId, userId: req.user.id, message });
    const populated = await Note.findById(note._id).populate('userId', 'name email avatar');
    await Activity.create({
      leadId,
      action: 'note_added',
      performedBy: req.user.id,
      details: `Note added: "${message.substring(0, 50)}..."`
    });
    res.status(201).json({ note: populated });
  } catch (error) {
    next(error);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    if (note.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to edit this note' });
    }
    note.message = req.body.message || note.message;
    await note.save();
    const populated = await Note.findById(note._id).populate('userId', 'name email avatar');
    res.json({ note: populated });
  } catch (error) {
    next(error);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    if (note.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this note' });
    }
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
};
