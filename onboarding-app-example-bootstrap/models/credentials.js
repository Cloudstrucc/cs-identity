const mongoose = require('mongoose');

const credentialSessionSchema = new mongoose.Schema({
	  sessionId: { type: String, required: true, unique: true },
	  userId: { type: String, required: true },
	  status: { type: String, enum: ['pending', 'issued', 'failed'], default: 'pending' },
	  credentialId: { type: String },
	  createdAt: { type: Date, default: Date.now },
	  expiresAt: { type: Date, required: true }
});

// Auto-expire sessions after 1 hour
credentialSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
module.exports = mongoose.model('CredentialSession', credentialSessionSchema);
