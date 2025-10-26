
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // MongoDB connection options
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI!, options);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);

    // Connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      try {
        await mongoose.connection.close();
        console.log(`\n🛑 MongoDB connection closed due to ${signal}`);
        process.exit(0);
      } catch (err) {
        console.error('❌ Error during graceful shutdown:', err);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  } catch (error: any) {
    console.error('❌ MongoDB connection error:', error.message);
    
    // More helpful error messages
    if (error.message.includes('ENOTFOUND')) {
      console.error('💡 Tip: Check your MongoDB URI in .env file');
    } else if (error.message.includes('Authentication failed')) {
      console.error('💡 Tip: Check your MongoDB username and password');
    } else if (error.message.includes('network')) {
      console.error('💡 Tip: Check your internet connection and MongoDB Atlas Network Access (IP whitelist)');
    }
    
    process.exit(1);
  }
};

export default connectDB;