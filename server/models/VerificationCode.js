const mongoose = require('mongoose');

const verificationCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  code: {
    type: String,
    required: true
  },
  userData: {
    name: String,
    password: String,
    phone: String,
    whatsapp: String
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour supprimer automatiquement les documents expirés
verificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index unique sur email pour éviter les doublons
verificationCodeSchema.index({ email: 1 });

const VerificationCode = mongoose.model('VerificationCode', verificationCodeSchema);

module.exports = VerificationCode;
