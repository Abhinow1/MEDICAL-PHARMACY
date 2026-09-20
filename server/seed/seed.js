import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Medicine from '../models/Medicine.js';
import Order from '../models/Order.js';
import Expense from '../models/Expense.js';
import { ROLES, ORDER_STATUS, PAYMENT_STATUS, PAYMENT_METHODS, EXPENSE_CATEGORIES } from '../config/constants.js';
import { generateMedicinesCatalog } from './generateMedicines.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting MediCare Database Seeding...');
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    // 1. Clear existing collections
    await User.deleteMany({});
    await Category.deleteMany({});
    await Medicine.deleteMany({});
    await Order.deleteMany({});
    await Expense.deleteMany({});
    console.log('🧹 Cleared existing database records.');

    // 2. Create Admin User & Sample Customer
    const adminPasswordHash = await User.hashPassword('Admin@12345');
    const customerPasswordHash = await User.hashPassword('Customer@12345');

    const admin = await User.create({
      name: 'Dr. Sarah Jenkins (Pharmacist Admin)',
      email: 'admin@medicare.com',
      phone: '+919876543210',
      passwordHash: adminPasswordHash,
      role: ROLES.ADMIN,
      isActive: true,
    });

    const customer = await User.create({
      name: 'Rahul Sharma',
      email: 'customer@example.com',
      phone: '+919812345678',
      passwordHash: customerPasswordHash,
      role: ROLES.USER,
      isActive: true,
      addresses: [
        {
          fullName: 'Rahul Sharma',
          phone: '+919812345678',
          streetAddress: 'Flat 402, Green Meadows, 14th Main Rd',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560034',
          landmark: 'Near Koramangala Police Station',
          isDefault: true,
        },
      ],
    });

    console.log('👤 Created Admin and Customer accounts.');

    // 3. Create Categories
    const categoriesData = [
      { name: 'Pain Relief', slug: 'pain-relief', description: 'Analgesics, anti-inflammatories and fever relievers', icon: 'ShieldAlert' },
      { name: 'Cold & Flu', slug: 'cold-and-flu', description: 'Decongestants, antihistamines, cough syrups and lozenges', icon: 'Thermometer' },
      { name: 'Vitamins & Supplements', slug: 'vitamins', description: 'Essential vitamins, minerals, omega-3 and dietary supplements', icon: 'Activity' },
      { name: 'Diabetes Care', slug: 'diabetes-care', description: 'Insulin, blood glucose monitors, lancets and oral hypoglycemics', icon: 'HeartPulse' },
      { name: 'Skin Care', slug: 'skin-care', description: 'Dermatological creams, antiseptics, moisturizers and antifungal treatments', icon: 'Sparkles' },
      { name: 'Baby Care', slug: 'baby-care', description: 'Pediatric care, baby lotions, feeding essentials and gentle formulas', icon: 'Smile' },
      { name: 'First Aid', slug: 'first-aid', description: 'Bandages, surgical gauze, antiseptics and burn treatments', icon: 'Cross' },
      { name: 'Personal Care', slug: 'personal-care', description: 'Oral hygiene, sanitizers, intimate hygiene and wellness', icon: 'UserCheck' },
    ];

    const categoryMap = {};
    for (const catData of categoriesData) {
      const cat = await Category.create(catData);
      categoryMap[cat.slug] = cat;
    }
    console.log(`📁 Seeded ${categoriesData.length} categories.`);

    // 4. Create 5000+ Genuine Pharmaceutical Medicines
    console.log('💊 Generating 5,000+ authentic pharmaceutical medicines catalog...');
    const catalogData = generateMedicinesCatalog(categoryMap);
    const seededMedicines = await Medicine.insertMany(catalogData, { ordered: false });
    console.log(`💊 Successfully seeded ${seededMedicines.length} genuine pharmaceutical medicines.`);

    // 5. Seed Historical Orders spanning past 30 days for rich Analytics
    const sampleStatuses = [
      ORDER_STATUS.DELIVERED,
      ORDER_STATUS.DELIVERED,
      ORDER_STATUS.DELIVERED,
      ORDER_STATUS.SHIPPED,
      ORDER_STATUS.PROCESSING,
      ORDER_STATUS.PAID,
      ORDER_STATUS.PRESCRIPTION_PENDING,
    ];

    const ordersToInsert = [];
    const now = new Date();

    for (let i = 0; i < 28; i++) {
      const orderDate = new Date(now);
      orderDate.setDate(now.getDate() - (28 - i));
      orderDate.setHours(9 + (i % 10), 15 + (i % 40));

      const med1 = seededMedicines[i % seededMedicines.length];
      const med2 = seededMedicines[(i + 3) % seededMedicines.length];
      const q1 = (i % 3) + 1;
      const q2 = (i % 2) + 1;

      const items = [
        {
          medicine: med1._id,
          name: med1.name,
          brand: med1.brand,
          genericName: med1.genericName,
          price: med1.price,
          costPrice: med1.costPrice,
          quantity: q1,
          subtotal: med1.price * q1,
          prescriptionRequired: med1.prescriptionRequired,
        },
        {
          medicine: med2._id,
          name: med2.name,
          brand: med2.brand,
          genericName: med2.genericName,
          price: med2.price,
          costPrice: med2.costPrice,
          quantity: q2,
          subtotal: med2.price * q2,
          prescriptionRequired: med2.prescriptionRequired,
        },
      ];

      const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
      const discount = Math.round(subtotal * 0.08);
      const deliveryFee = subtotal >= 500 ? 0 : 40;
      const total = subtotal - discount + deliveryFee;
      const totalCost = items.reduce((sum, item) => sum + item.costPrice * item.quantity, 0);
      const grossProfit = total - deliveryFee - totalCost;

      const orderStatus = sampleStatuses[i % sampleStatuses.length];
      const paymentStatus = orderStatus === ORDER_STATUS.CANCELLED ? PAYMENT_STATUS.REFUNDED : PAYMENT_STATUS.SUCCESS;

      ordersToInsert.push({
        orderNumber: `MED-2026-${1000 + i}`,
        user: customer._id,
        items,
        shippingAddress: customer.addresses[0],
        subtotal,
        discount,
        deliveryFee,
        total,
        totalCost,
        grossProfit,
        paymentMethod: PAYMENT_METHODS.TEST,
        paymentStatus,
        orderStatus,
        prescriptionRequired: items.some((it) => it.prescriptionRequired),
        statusHistory: [
          { status: ORDER_STATUS.PENDING, timestamp: orderDate, note: 'Order placed by customer.' },
          { status: orderStatus, timestamp: new Date(orderDate.getTime() + 3600000), note: `Status transitioned to ${orderStatus}.` },
        ],
        createdAt: orderDate,
        updatedAt: orderDate,
      });
    }

    await Order.insertMany(ordersToInsert);
    console.log(`📦 Seeded ${ordersToInsert.length} historical orders for analytics.`);

    // 6. Seed Operational Expenses (Rent, Delivery, Electricity, Staff)
    const expensesData = [
      {
        title: 'Store Commercial Rent (Downtown)',
        category: EXPENSE_CATEGORIES.RENT,
        amount: 25000,
        date: new Date(now.getFullYear(), now.getMonth(), 1),
        notes: 'Monthly pharmacy storefront lease',
        recordedBy: admin._id,
      },
      {
        title: 'Electricity & Cold-Storage Utilities',
        category: EXPENSE_CATEGORIES.ELECTRICITY,
        amount: 4200,
        date: new Date(now.getFullYear(), now.getMonth(), 5),
        notes: 'Includes 24/7 refrigeration power for insulin and vaccines',
        recordedBy: admin._id,
      },
      {
        title: 'Courier & Local Courier Delivery Charges',
        category: EXPENSE_CATEGORIES.DELIVERY,
        amount: 3100,
        date: new Date(now.getFullYear(), now.getMonth(), 10),
        notes: 'Hyper-local bike deliveries across city',
        recordedBy: admin._id,
      },
      {
        title: 'Staff Salary (Registered Pharmacist Assistant)',
        category: EXPENSE_CATEGORIES.STAFF,
        amount: 18000,
        date: new Date(now.getFullYear(), now.getMonth(), 1),
        notes: 'Dispensary staff payroll',
        recordedBy: admin._id,
      },
      {
        title: 'Biohazard & Pharmaceutical Packaging Supplies',
        category: EXPENSE_CATEGORIES.PACKAGING,
        amount: 1500,
        date: new Date(now.getFullYear(), now.getMonth(), 12),
        notes: 'Pill bottles, tamper-evident seals and padded envelopes',
        recordedBy: admin._id,
      },
    ];

    await Expense.insertMany(expensesData);
    console.log(`💰 Seeded ${expensesData.length} operational expense records.`);

    console.log('✅ MediCare Database Seeding Completed Successfully!');
    console.log('----------------------------------------------------');
    console.log('🔑 Credentials for Testing:');
    console.log('   Admin Login:    admin@medicare.com / Admin@12345');
    console.log('   Customer Login: customer@example.com / Customer@12345');
    console.log('----------------------------------------------------');
  } catch (error) {
    console.error('❌ Database seed error:', error);
  }
};

// Execute if run directly from CLI
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase().then(async () => {
    await disconnectDB();
    process.exit(0);
  });
}
