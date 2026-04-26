const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  accountType: { type: String, default: 'Individual / Homeowner' },
  password: { type: String, required: true },
  termsAgreed: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  role: { type: String, default: 'customer', enum: ['customer', 'admin'] }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
