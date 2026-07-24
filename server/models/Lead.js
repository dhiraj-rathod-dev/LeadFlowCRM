const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Lead name is required'], trim: true, maxlength: 200 },
  email: { type: String, trim: true, lowercase: true, default: '' },
  phone: { type: String, trim: true, default: '' },
  company: { type: String, trim: true, default: '' },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'won', 'lost', 'archived'],
    default: 'new'
  },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  source: {
    type: String,
    enum: ['website', 'referral', 'social_media', 'advertisement', 'cold_call', 'email', 'other'],
    default: 'website'
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, set: function(v) { return (v === '' || v === undefined || v === null) ? null : v; } },
  budget: { type: Number, default: 0, min: 0 },
  industry: { type: String, trim: true, default: '' },
  country: { type: String, trim: true, default: '' },
  city: { type: String, trim: true, default: '' },
  address: { type: String, trim: true, default: '' },
  website: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  tags: [{ type: String, trim: true }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  isArchived: { type: Boolean, default: false }
}, { timestamps: true });

LeadSchema.index({ name: 'text', email: 'text', company: 'text', phone: 'text' });
LeadSchema.index({ status: 1 });
LeadSchema.index({ assignedTo: 1 });
LeadSchema.index({ createdBy: 1 });
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ priority: 1 });
LeadSchema.index({ source: 1 });

LeadSchema.pre('validate', function(next) {
  if (this.assignedTo === '' || this.assignedTo === undefined) this.assignedTo = null;
  next();
});

module.exports = mongoose.model('Lead', LeadSchema);
