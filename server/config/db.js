import mongoose from 'mongoose';

// Cache connection across serverless function invocations
let isConnected = false;

export const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
    });
    isConnected = true;
    console.log(`🌿 Cozy MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`💡 Tip: Make sure your current IP address is whitelisted in MongoDB Atlas Network Access.`);
  }
};
