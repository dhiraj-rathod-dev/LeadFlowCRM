const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: [true, 'Note message is required'], trim: true }
}, { timestamps: true });

NoteSchema.index({ leadId: 1 });
NoteSchema.index({ userId: 1 });

module.exports = mongoose.model('Note', NoteSchema);
