const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, default: 'Unbranded' },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String },
  sizeDescription: { type: String },
  stock: { type: Number, default: 0 },
  unit: { type: String, default: 'piece' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
