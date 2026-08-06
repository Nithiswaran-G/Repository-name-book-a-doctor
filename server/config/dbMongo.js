import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
dotenv.config();

// Ensure Node uses Google Public DNS to resolve MongoDB Atlas SRV records reliably on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/book-a-doc';

  try {
    console.log(`📡 Connecting to MongoDB (${mongoUri.includes('@') ? 'Cloud MongoDB Atlas' : mongoUri})...`);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`✅ MongoDB Connected Successfully to database: ${mongoose.connection.name}`);
  } catch (err) {
    console.warn(`⚠️ External MongoDB connection failed (${err.message}). Starting Fallback Memory MongoDB Server...`);
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`✅ In-Memory MongoDB Server Connected Successfully! (${uri})`);
    } catch (memErr) {
      console.error(`❌ Failed to start Fallback MongoDB Memory Server:`, memErr);
    }
  }
}

export default mongoose;
