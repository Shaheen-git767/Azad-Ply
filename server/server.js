//  require('dotenv').config();//original

require('dotenv').config({
  path: require('path').join(__dirname, '../.env')
});
require('dns').setDefaultResultOrder('ipv4first'); //changes

console.log("MONGO_URI:", process.env.MONGO_URI);//temperory

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Import DB Models
const User = require('./models/User');
const Cart = require('./models/Cart');
const Order = require('./models/Order');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Setting = require('./models/Setting');
// Admin Middleware
const isAdmin = async (req, res, next) => {
  try {
    const uid = req.headers['x-user-id'];
    if (!uid) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const user = await User.findById(uid);
    if (user && user.role === 'admin') {
      req.adminUser = user;
      next();
    } else {
      res.status(403).json({ success: false, message: 'Forbidden: Admins only' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

// Connect to MongoDB with improved error logging
// mongoose.connect(process.env.MONGO_URI).then(async () => {
//     console.log('Successfully connected to MongoDB Cluster!');  //original




// Connect to MongoDB with improved error logging
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  family: 4
})
.then(async () => {
  console.log('MongoDB Connected ');
    // Auto-migrate hardcoded products to DB if empty
    const count = await Product.countDocuments();
    if (count === 0) {
      const products = [
        { name: 'Green Ply 18mm Commercial', price: 1800, category: 'Green Ply', image: '/assets/images/cat_plywood_1777179257274.png', sizeDescription: '8x4 sqft' },
        { name: 'Green Ply 19mm Marine (BWP)', price: 2450, category: 'Green Ply', image: '/assets/images/cat_plywood_1777179257274.png', sizeDescription: '8x4 sqft' },
        { name: 'Green Ply 12mm Commercial', price: 1200, category: 'Green Ply', image: '/assets/images/cat_plywood_1777179257274.png', sizeDescription: '8x4 sqft' },
        { name: 'Green Ply 6mm Flexible', price: 850, category: 'Green Ply', image: '/assets/images/cat_plywood_1777179257274.png', sizeDescription: '8x4 sqft' },
        { name: 'Century Ply 18mm Marine', price: 2600, category: 'Ply', image: '/assets/images/cat_plywood_1777179257274.png', sizeDescription: '8x4 sqft' },
        { name: 'Century Ply 12mm BWP', price: 1500, category: 'Ply', image: '/assets/images/cat_plywood_1777179257274.png', sizeDescription: '8x4 sqft' },
        { name: 'Local Plywood 18mm MR', price: 1400, category: 'Ply', image: '/assets/images/cat_plywood_1777179257274.png', sizeDescription: '8x4 sqft' },
        { name: 'Block Board 19mm Pine', price: 1950, category: 'Ply', image: '/assets/images/cat_plywood_1777179257274.png', sizeDescription: '8x4 sqft' },
        { name: 'MDF Board 18mm', price: 1100, category: 'Ply', image: '/assets/images/cat_plywood_1777179257274.png', sizeDescription: '8x4 sqft' },
        { name: 'Particle Board 18mm', price: 800, category: 'Ply', image: '/assets/images/cat_plywood_1777179257274.png', sizeDescription: '8x4 sqft' },
        { name: 'Merino 1mm High Gloss Laminate', price: 1250, category: 'Mica', image: '/assets/images/cat_mica_1777179353524.png', sizeDescription: '8x4 sqft' },
        { name: 'Merino 1mm Matte Finish Laminate', price: 1100, category: 'Mica', image: '/assets/images/cat_mica_1777179353524.png', sizeDescription: '8x4 sqft' },
        { name: 'Greenlam 1mm Texture Laminate', price: 1350, category: 'Mica', image: '/assets/images/cat_mica_1777179353524.png', sizeDescription: '8x4 sqft' },
        { name: 'Greenlam 0.8mm Wood Grain', price: 850, category: 'Mica', image: '/assets/images/cat_mica_1777179353524.png', sizeDescription: '8x4 sqft' },
        { name: 'Sunmica 1mm Solid Color', price: 950, category: 'Mica', image: '/assets/images/cat_mica_1777179353524.png', sizeDescription: '8x4 sqft' },
        { name: 'Sunmica 0.8mm White', price: 700, category: 'Mica', image: '/assets/images/cat_mica_1777179353524.png', sizeDescription: '8x4 sqft' },
        { name: 'CenturyLaminates 1mm Metallic', price: 1500, category: 'Mica', image: '/assets/images/cat_mica_1777179353524.png', sizeDescription: '8x4 sqft' },
        { name: 'CenturyLaminates 0.8mm Fabric', price: 900, category: 'Mica', image: '/assets/images/cat_mica_1777179353524.png', sizeDescription: '8x4 sqft' },
        { name: 'Virgo 1mm Digital Print', price: 1800, category: 'Mica', image: '/assets/images/cat_mica_1777179353524.png', sizeDescription: '8x4 sqft' },
        { name: 'Virgo 0.8mm Gloss', price: 800, category: 'Mica', image: '/assets/images/cat_mica_1777179353524.png', sizeDescription: '8x4 sqft' },
        { name: 'Fevicol SH Marine 1kg', price: 420, category: 'Fevicol', image: '/assets/images/fevicol_1777180710788.png', sizeDescription: '1 Kg Bucket' },
        { name: 'Fevicol SH Marine 5kg', price: 1950, category: 'Fevicol', image: '/assets/images/fevicol_1777180710788.png', sizeDescription: '5 Kg Bucket' },
        { name: 'Fevicol HeatX 1L', price: 550, category: 'Fevicol', image: '/assets/images/fevicol_1777180710788.png', sizeDescription: '1 Litre Tin' },
        { name: 'Fevicol SR 998 1L', price: 480, category: 'Fevicol', image: '/assets/images/fevicol_1777180710788.png', sizeDescription: '1 Litre Tin' },
        { name: 'Fevicol Probond 1kg', price: 380, category: 'Fevicol', image: '/assets/images/fevicol_1777180710788.png', sizeDescription: '1 Kg Pack' },
        { name: 'Clear Toughened Glass 12mm', price: 150, category: 'Glass', image: '/assets/images/cat_glass_1777179301984.png', sizeDescription: 'Per Sqft' },
        { name: 'Clear Toughened Glass 10mm', price: 120, category: 'Glass', image: '/assets/images/cat_glass_1777179301984.png', sizeDescription: 'Per Sqft' },
        { name: 'Frosted Glass 8mm', price: 90, category: 'Glass', image: '/assets/images/cat_glass_1777179301984.png', sizeDescription: 'Per Sqft' },
        { name: 'Tinted Grey Glass 10mm', price: 140, category: 'Glass', image: '/assets/images/cat_glass_1777179301984.png', sizeDescription: 'Per Sqft' },
        { name: 'Mirror Glass 5mm', price: 70, category: 'Glass', image: '/assets/images/cat_glass_1777179301984.png', sizeDescription: 'Per Sqft' },
        { name: 'Aluminium Sliding Track 2 Track', price: 150, category: 'Aluminium', image: '/assets/images/cat_alum_1777179318925.png', sizeDescription: 'Per Running Ft' },
        { name: 'Aluminium Sliding Track 3 Track', price: 200, category: 'Aluminium', image: '/assets/images/cat_alum_1777179318925.png', sizeDescription: 'Per Running Ft' },
        { name: 'Aluminium Partition Section', price: 120, category: 'Aluminium', image: '/assets/images/cat_alum_1777179318925.png', sizeDescription: 'Per Running Ft' },
        { name: 'Aluminium Window Interlock', price: 80, category: 'Aluminium', image: '/assets/images/cat_alum_1777179318925.png', sizeDescription: 'Per Running Ft' },
        { name: 'Aluminium Handle Section', price: 90, category: 'Aluminium', image: '/assets/images/cat_alum_1777179318925.png', sizeDescription: 'Per Running Ft' },
        { name: 'Niva Solid Teak Wood Door', price: 12500, category: 'Niva Door', image: '/assets/images/cat_doors_1777179276618.png', sizeDescription: 'Standard 7x3 ft' },
        { name: 'Milenium Flush Door 30mm', price: 4500, category: 'Milenium Door', image: '/assets/images/cat_doors_1777179276618.png', sizeDescription: 'Standard 7x3 ft' },
        { name: 'Membrane Door Carved', price: 5500, category: 'Door', image: '/assets/images/cat_doors_1777179276618.png', sizeDescription: 'Standard 7x3 ft' },
        { name: 'Laminated Flush Door', price: 5000, category: 'Door', image: '/assets/images/cat_doors_1777179276618.png', sizeDescription: 'Standard 7x3 ft' },
        { name: 'PVC Bathroom Door', price: 2200, category: 'Door', image: '/assets/images/cat_doors_1777179276618.png', sizeDescription: 'Standard 7x2.5 ft' },
        { name: 'Tesa Mortise Lock & Handle Set', price: 1850, category: 'Tesa Handle', image: '/assets/images/door_handle_1777180690929.png', sizeDescription: 'Per Set' },
        { name: 'Europa Main Door Lock', price: 2400, category: 'Handle', image: '/assets/images/door_handle_1777180690929.png', sizeDescription: 'Per Piece' },
        { name: 'Godrej Navtal Padlock', price: 850, category: 'Handle', image: '/assets/images/door_handle_1777180690929.png', sizeDescription: 'Per Piece' },
        { name: 'SS Pull Handle 12 inch', price: 600, category: 'Handle', image: '/assets/images/door_handle_1777180690929.png', sizeDescription: 'Per Pair' },
        { name: 'Brass Antique Mortise Handle', price: 2200, category: 'Handle', image: '/assets/images/door_handle_1777180690929.png', sizeDescription: 'Per Set' },
        { name: 'Jaguar Pillar Cock Tap', price: 1250, category: 'Taps', image: '/assets/images/door_handle_1777180690929.png', sizeDescription: 'Per Piece' },
        { name: 'Cera Wall Mixer Set', price: 3500, category: 'Taps', image: '/assets/images/door_handle_1777180690929.png', sizeDescription: 'Per Set' },
        { name: 'Hindware Bib Cock', price: 650, category: 'Taps', image: '/assets/images/door_handle_1777180690929.png', sizeDescription: 'Per Piece' },
        { name: 'Plumber Angle Valve', price: 350, category: 'Taps', image: '/assets/images/door_handle_1777180690929.png', sizeDescription: 'Per Piece' },
        { name: 'Health Faucet Gun with Pipe', price: 800, category: 'Taps', image: '/assets/images/door_handle_1777180690929.png', sizeDescription: 'Per Set' }
      ];
      await Product.insertMany(products);
      console.log('Migrated hardcoded products to MongoDB!');
    }

    // Ensure admin users actually exist in the DB!
    const adminEmails = ['azadplyfurniture@gmail.com', 'shaheenazadskd@gmail.com', 'shahinazadskd@gmail.com'];
    for (let email of adminEmails) {
      const user = await User.findOne({ email });
      if (!user) {
        await User.create({
          firstName: 'Admin',
          lastName: 'User',
          phone: Math.floor(1000000000 + Math.random() * 9000000000).toString(), // Random 10 digit
          email: email,
          password: 'admin', // Default password
          role: 'admin',
          isVerified: true
        });
      } else {
        user.role = 'admin';
        user.isVerified = true;
        await user.save();
      }
    }
  })
  .catch((err) => {
    console.error('CRITICAL: MongoDB connection failed!');
    console.error('Error Details:', err.message);
    if (err.name === 'MongooseServerSelectionError') {
      console.error('Possible causes:');
      console.error('1. Your IP address is not whitelisted in MongoDB Atlas.');
      console.error('2. Your network firewall is blocking port 27017.');
      console.error('3. The MongoDB Atlas cluster is currently paused or down.');
      
      // Attempt to fetch public IP to help the user
      require('https').get('https://api.ipify.org', (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          console.log('\nACTION REQUIRED: Please ensure this IP is whitelisted in Atlas:', data);
          console.log('Whitelist Link: https://cloud.mongodb.com/v2/your-cluster-id#security/network/whitelist');
        });
      }).on('error', () => {});
    }
  });

// Configure Email Transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail',                                                            previous
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });



const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
const info = await transporter.sendMail(mailOptions);   //added
console.log("MAIL SENT:", info.response);



// GET Public Products from MongoDB
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    // Map _id to id so frontend doesn't break
    const mapped = products.map(p => ({
      id: p._id.toString(),
      name: p.name,
      price: p.price,
      category: p.category,
      image: p.image,
      description: p.description,
      sizeDescription: p.sizeDescription
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json([]);
  }
});

// AUTHENTICATION APIs
app.post('/api/register', async (req, res) => {
  try {
    const { firstName, lastName, phone, email, accountType, password } = req.body;

    // Check if user exists
    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      if (existing.password === password) {
        if (!existing.isVerified) {
          return res.status(403).json({ success: false, message: 'Please check your email to verify your account first.' });
        }
        const cartInfo = await Cart.findOne({ user: existing._id });
        return res.json({
          success: true,
          message: `User already exists. Logged you in instead! Welcome back, ${existing.firstName}!`,
          user: { _id: existing._id, firstName: existing.firstName, email: existing.email },
          cartItems: cartInfo ? cartInfo.items : []
        });
      }
      return res.status(400).json({ success: false, message: 'User with this email or phone already exists. If this is you, please use the Sign In tab.' });
    }

    // Create User Document
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = new User({ firstName, lastName, phone, email, accountType, password, verificationToken, isVerified: false });
    await user.save();

    // Seed an empty Cart Document for them
    const newCart = new Cart({ user: user._id, items: [], totalAmount: 0 });
    await newCart.save();

    // Send Verification Email
    // const verifyLink = `http://localhost:${PORT}/api/verify?token=${verificationToken}`;

    const verifyLink = `${process.env.BASE_URL}/api/verify?token=${verificationToken}`;
    const mailOptions = {
      // from: process.env.EMAIL_USER,
      from: `"Azad Ply" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your Azad Ply Account',
      html: `
        <div style="text-align: center; font-family: sans-serif; padding: 20px;">
          <h2>Welcome to Azad Ply, ${firstName}!</h2>
          <p>Please confirm that this is you by clicking the button below to verify your account.</p>
          <a href="${verifyLink}" style="display:inline-block; margin-top:20px; padding:15px 30px; background-color:#c99f69; color:#fff; text-decoration:none; font-weight:bold; border-radius:5px;">Yes, this is me</a>
          <p style="margin-top:20px; color:#888;">If you didn't request this, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Account created! Please check your email to verify your account before logging in.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database error', error: err.message });
  }
});

app.get('/api/verify', async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.send('<h1 style="text-align:center; margin-top:50px;">Invalid or expired verification link</h1>');

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.send('<h1 style="text-align:center; margin-top:50px; color:green;">Account successfully verified! You can now close this tab and log in on the website.</h1>');
  } catch (err) {
    res.send('<h1 style="text-align:center; margin-top:50px; color:red;">Verification failed.</h1>');
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find User in MongoDB
    const user = await User.findOne({ email, password });
    if (user) {
      if (!user.isVerified) {
        return res.status(403).json({ success: false, message: 'Please check your email to verify your account first.' });
      }
      // Also fetch their remote cart
      const cartInfo = await Cart.findOne({ user: user._id });
      res.json({ success: true, message: `Welcome back, ${user.firstName}!`, user: { _id: user._id, firstName: user.firstName, email: user.email, role: user.role }, cartItems: cartInfo ? cartInfo.items : [] });
    } else {
      res.status(400).json({ success: false, message: 'Invalid credentials or User not found.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with that email address.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // const resetLink = `http://localhost:${PORT}/reset-password.html?token=${resetToken}`;
 const resetLink = `${process.env.BASE_URL}/reset-password.html?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Azad Ply - Password Recovery',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Password Recovery</h2>
          <p>Hello ${user.firstName},</p>
          <p>You requested to recover your password. Please click the button below to set a new password:</p>
          <a href="${resetLink}" style="display:inline-block; margin-top:20px; padding:15px 30px; background-color:#c99f69; color:#fff; text-decoration:none; font-weight:bold; border-radius:5px;">Reset My Password</a>
          <p style="margin-top:20px; color:#888;">If you didn't request this, please ignore this email. The link will expire in 1 hour.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'A secure password reset link has been sent to your email address!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to process request.' });
  }
});

app.post('/api/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Password reset token is invalid or has expired.' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Your password has been successfully updated! You can now log in.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to reset password.' });
  }
});

// CART SYNC API
app.post('/api/cart/sync', async (req, res) => {
  try {
    const { userId, cart } = req.body;
    if (!userId) return res.json({ success: false, message: "Not logged in" });

    let total = cart.reduce((acc, item) => acc + item.price, 0);

    await Cart.findOneAndUpdate(
      { user: userId },
      { items: cart, totalAmount: total },
      { upsert: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Sync failed' });
  }
});

// CHECKOUT API (Order Creation)
app.post('/api/checkout', async (req, res) => {
  try {
    const { userId, cart, orderMethod } = req.body;
    if (cart && cart.length > 0) {
      let total = cart.reduce((acc, item) => acc + item.price, 0);

      const orderData = {
        items: cart,
        totalAmount: total,
        orderMethod: orderMethod || 'System'
      };

      if (userId) {
        orderData.user = userId;
        // Clear the active cart in DB
        await Cart.findOneAndUpdate({ user: userId }, { items: [], totalAmount: 0 });
      }

      // We still store Orders for Anonymous Users if no userId is provided (Mongoose schema needs to allow it or we skip saving to DB. We made user required, so let's check!)
      if (userId) {
        const newOrder = new Order(orderData);
        await newOrder.save();
        res.json({ success: true, orderId: newOrder._id, message: `Order successfully placed and secured in MongoDB!` });
      } else {
        res.json({ success: true, message: "Guest order placed. (Log in next time to track!)" });
      }

    } else {
      res.status(400).json({ success: false, message: 'Cart is empty' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Checkout DB Error', err: err.message });
  }
});

// Routes for HTML pages
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'munmunazad14@gmail.com',
      replyTo: email,
      subject: `New Website Inquiry: ${subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr/>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Your message has been sent successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to send message', error: err.message });
  }
});

// Routes for HTML pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'about.html')));
app.get('/products', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'products.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'contact.html')));
app.get('/shipping', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'shipping.html')));
app.get('/returns', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'returns.html')));
app.get('/terms', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'terms.html')));
app.get('/privacy', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'privacy.html')));
app.get('/reset-password.html', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'reset-password.html')));
app.get('/admin.html', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'admin.html')));

// --- ADMIN ROUTES ---

// Admin Stats
app.get('/api/admin/stats', isAdmin, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'firstName lastName phone email');
    res.json({ success: true, stats: { totalProducts, totalOrders }, recentOrders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin Products CRUD
app.post('/api/admin/products', isAdmin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({ success: true, message: 'Product added successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add product' });
  }
});

app.put('/api/admin/products/:id', isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.json({ success: true, message: 'Product updated successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
});

app.delete('/api/admin/products/:id', isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
});

// Admin Orders
app.get('/api/admin/orders', isAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'firstName lastName phone email');
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/admin/orders/:id', isAdmin, async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.json({ success: true, message: 'Order status updated!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

// Admin Customers
app.get('/api/admin/customers', isAdmin, async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password -resetPasswordToken -resetPasswordExpires');
    res.json({ success: true, customers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
