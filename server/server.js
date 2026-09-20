import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import Medicine from './models/Medicine.js';
import { seedDatabase } from './seed/seed.js';

dotenv.config();

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  let dbConnected = false;
  try {
    await connectDB();
    dbConnected = true;

    // Auto-seed if database is empty or has fewer than 5000 medicines
    try {
      const medicineCount = await Medicine.countDocuments();
      if (medicineCount < 5000) {
        console.log(`🌱 Database has ${medicineCount} medicines. Populating full 5,000+ pharmaceutical catalog...`);
        await seedDatabase();
      }
    } catch (seedErr) {
      console.warn('⚠️ Seeding check skipped/failed:', seedErr.message);
    }
  } catch (error) {
    console.warn('⚠️ Server running without database connection:', error.message);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`===========================================`);
    console.log(`🏥 MediCare Pharmacy API Server Running`);
    console.log(`📡 URL: http://0.0.0.0:${PORT}`);
    console.log(`🩺 Health: http://0.0.0.0:${PORT}/api/health`);
    console.log(`🛡️ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`💾 Database Status: ${dbConnected ? 'CONNECTED' : 'DISCONNECTED (Verify MONGODB_URI)'}`);
    console.log(`===========================================`);
  });
};

startServer();
