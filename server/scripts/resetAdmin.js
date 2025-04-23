const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env file');
  process.exit(1);
}

const resetAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing admin users
    await User.deleteMany({ role: { $in: ['admin', 'superadmin'] } });
    console.log('All admin users deleted');

    // Create new superadmin
    const admin = new User({
      name: 'مدير النظام',
      username: 'admin',
      email: 'admin@voursa.com',
      password: 'Admin123!',
      phone: '+22212345678',
      whatsapp: '+22212345678',
      role: 'superadmin',
      isActive: true
    });

    await admin.save();
    console.log('New superadmin created successfully');
    console.log('Email: admin@voursa.com');
    console.log('Username: admin');
    console.log('Password: Admin123!');
    console.log('Phone: +22212345678');
    console.log('WhatsApp: +22212345678');

  } catch (error) {
    console.error('Error resetting admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

resetAdmin(); 