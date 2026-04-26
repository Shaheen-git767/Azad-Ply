require('dotenv').config();
const mongoose = require('mongoose');

console.log('URI:', process.env.MONGO_URI.trim());

mongoose.connect(process.env.MONGO_URI.trim())
  .then(() => {
    console.log('Successfully connected to MongoDB Cluster!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
