const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: String },
  name: { type: String },
  price: { type: Number }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  orderMethod: { type: String, enum: ['System', 'WhatsApp'], required: true },
  status: { type: String, default: 'Pending Validation' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
