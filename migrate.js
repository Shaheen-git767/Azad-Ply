require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
      await Product.deleteMany({});
      console.log('Products cleared. They will be repopulated when the server starts.');
      process.exit(0);
  });
