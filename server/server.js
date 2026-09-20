import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import Medicine from './models/Medicine.js';
import { seedDatabase } from './seed/seed.js';

dotenv.config();

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is empty or has fewer than 5000 medicines
    const medicineCount = await Medicine.countDocuments();
    if (medicineCount < 5000) {
      console.log(`🌱 Database has ${medicineCount} medicines. Populating full 5,000+ pharmaceutical catalog...`);
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`===========================================`);
      console.log(`🏥 MediCare Pharmacy API Server Running`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
      console.log(`🛡️ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`===========================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
