import mongoose from 'mongoose';

let mongod = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      console.log('Connecting to provided MONGODB_URI...');
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`❌ MongoDB Connection Error: ${error.message}`);
      console.error('👉 Ensure MONGODB_URI credentials are valid and IP 0.0.0.0/0 is whitelisted in Atlas.');
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
    }
  }

  console.log('No external MONGODB_URI provided. Starting in-memory MongoDB server...');
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongod = await MongoMemoryServer.create();
    const memoryUri = mongod.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`In-Memory MongoDB Connected at: ${memoryUri}`);
    return conn;
  } catch (innerError) {
    console.error('In-memory MongoDB fallback failed:', innerError.message);
    throw innerError;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  } catch (error) {
    console.error('Error disconnecting DB:', error.message);
  }
};
