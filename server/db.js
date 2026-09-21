import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Vercel-Admin-auracentre:VO5jtaPh4LMfTFYO@auracentre.k37o2xv.mongodb.net/adminuser?retryWrites=true&w=majority";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Do not crash process in serverless environment
  }
};
