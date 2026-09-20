import mongoose from 'mongoose';

let mongod = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  try {
    const uri = process.env.MONGODB_URI;

    if (uri && uri.trim() !== '') {
      console.log('Connecting to provided MONGODB_URI...');
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    }

    console.log('No MONGODB_URI provided. Starting in-memory MongoDB server for development/test...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongod = await MongoMemoryServer.create();
    const memoryUri = mongod.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`In-Memory MongoDB Connected at: ${memoryUri}`);
    return conn;
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    // If external URI failed, attempt in-memory fallback in development
    if (process.env.NODE_ENV !== 'production' && !mongod) {
      console.log('Attempting in-memory MongoDB fallback...');
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongod = await MongoMemoryServer.create();
        const memoryUri = mongod.getUri();
        const conn = await mongoose.connect(memoryUri);
        console.log(`In-Memory MongoDB Connected at: ${memoryUri}`);
        return conn;
      } catch (innerError) {
        console.error('In-memory MongoDB fallback failed:', innerError.message);
        process.exit(1);
      }
    }
    process.exit(1);
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
