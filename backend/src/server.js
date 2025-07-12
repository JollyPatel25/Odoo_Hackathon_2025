import dotenv from 'dotenv';
dotenv.config();

import app from './app.js'; // ✅ Note: .js is required with ES modules
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });
