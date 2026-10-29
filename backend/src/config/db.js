import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let mongodInstance = null;

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/premium_vierp';
    
    // Try connecting to primary MongoDB URI with short timeout
    try {
      const conn = await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 2000,
      });
      console.log(`[Database] MongoDB Connected to host: ${conn.connection.host}`);
      return conn;
    } catch (primaryErr) {
      console.warn(`[Database] Local/External MongoDB not reachable (${primaryErr.message}). Initializing embedded In-Memory MongoDB...`);
      
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const memoryUri = mongodInstance.getUri();
      
      const conn = await mongoose.connect(memoryUri);
      console.log(`[Database] In-Memory MongoDB successfully initialized & connected: ${memoryUri}`);
      return conn;
    }
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    process.exit(1);
  }
};
