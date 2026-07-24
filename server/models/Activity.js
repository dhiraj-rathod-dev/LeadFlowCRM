const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  action: {
    type: String,
    enum: ['created', 'updated', 'status_changed', 'assigned', 'note_added', 'deleted', 'archived', 'restored', 'login', 'logout', 'password_reset'],
    required: true
  },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  details: { type: String, default: '' },
  oldValue: { type: String, default: '' },
  newValue: { type: String, default: '' }
}, { timestamps: true });

ActivitySchema.index({ leadId: 1 });
ActivitySchema.index({ performedBy: 1 });
ActivitySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Activity', ActivitySchema);
