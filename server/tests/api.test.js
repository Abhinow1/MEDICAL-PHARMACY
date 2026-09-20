import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Medicine from '../models/Medicine.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Prescription from '../models/Prescription.js';
import { ROLES, ORDER_STATUS, PAYMENT_STATUS, PRESCRIPTION_STATUS } from '../config/constants.js';

let customerToken = '';
let adminToken = '';
let customerUser = null;
let adminUser = null;
let testCategory = null;
let testOtcMedicine = null;
let testRxMedicine = null;
let testOrderId = null;
let testPrescriptionId = null;

beforeAll(async () => {
  await connectDB();

  // Clear test DB
  await User.deleteMany({});
  await Category.deleteMany({});
  await Medicine.deleteMany({});
  await Cart.deleteMany({});
  await Order.deleteMany({});
  await Prescription.deleteMany({});

  // Create test Admin
  const adminHash = await User.hashPassword('AdminTest@123');
  adminUser = await User.create({
    name: 'Admin Test',
    email: 'admintest@medicare.com',
    phone: '+919999999999',
    passwordHash: adminHash,
    role: ROLES.ADMIN,
    isActive: true,
  });

  // Create Category
  testCategory = await Category.create({
    name: 'General Health',
    slug: 'general-health',
    description: 'Wellness products',
  });

  // Create OTC Medicine
  testOtcMedicine = await Medicine.create({
    name: 'Paracetamol 500mg',
    genericName: 'Paracetamol',
    brand: 'HealthCorp',
    category: testCategory._id,
    description: 'Pain and fever relief',
    uses: ['Headache', 'Fever'],
    price: 50,
    costPrice: 30,
    discount: 10, // 10% discount -> finalPrice = 45
    stock: 100,
    lowStockThreshold: 10,
    prescriptionRequired: false,
  });

  // Create Prescription-Required Medicine
  testRxMedicine = await Medicine.create({
    name: 'Amoxicillin 500mg',
    genericName: 'Amoxicillin',
    brand: 'PharmaMax',
    category: testCategory._id,
    description: 'Antibiotic for bacterial infection',
    uses: ['Infection'],
    price: 120,
    costPrice: 80,
    discount: 0,
    stock: 50,
    lowStockThreshold: 10,
    prescriptionRequired: true,
  });
});

afterAll(async () => {
  await disconnectDB();
});

describe('1. Authentication Tests', () => {
  it('should register a new customer', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Customer',
        email: 'customer@test.com',
        phone: '+919876543210',
        password: 'Password@123',
        confirmPassword: 'Password@123',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.role).toBe(ROLES.USER);

    customerToken = res.body.data.token;
    customerUser = res.body.data.user;
  });

  it('should reject registration if passwords do not match', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Mismatch User',
        email: 'mismatch@test.com',
        phone: '+919876543211',
        password: 'Password@123',
        confirmPassword: 'WrongPassword',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should login customer with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'customer@test.com',
        password: 'Password@123',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  it('should reject login with invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'customer@test.com',
        password: 'IncorrectPassword',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should login admin via dedicated admin login endpoint', async () => {
    const res = await request(app)
      .post('/api/auth/admin-login')
      .send({
        email: 'admintest@medicare.com',
        password: 'AdminTest@123',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.admin.role).toBe(ROLES.ADMIN);

    adminToken = res.body.data.token;
  });

  it('should reject normal user from admin login endpoint', async () => {
    const res = await request(app)
      .post('/api/auth/admin-login')
      .send({
        email: 'customer@test.com',
        password: 'Password@123',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should block unauthenticated requests to protected profile route', async () => {
    const res = await request(app).get('/api/auth/profile');
    expect(res.status).toBe(401);
  });

  it('should return profile for authenticated customer', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe('customer@test.com');
  });

  it('should add customer address with valid Indian PIN code', async () => {
    const res = await request(app)
      .post('/api/auth/address')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        fullName: 'Test Customer',
        phone: '+919876543210',
        streetAddress: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        landmark: 'Near Station',
      });

    expect(res.status).toBe(201);
    expect(res.body.data.addresses.length).toBe(1);
    expect(res.body.data.addresses[0].postalCode).toBe('400001');
  });
});

describe('2. Medicine Catalog & Search Tests', () => {
  it('should list active medicines', async () => {
    const res = await request(app).get('/api/medicines');
    expect(res.status).toBe(200);
    expect(res.body.data.medicines.length).toBeGreaterThanOrEqual(2);
  });

  it('should search medicine by name or generic name', async () => {
    const res = await request(app).get('/api/medicines?search=paracetamol');
    expect(res.status).toBe(200);
    expect(res.body.data.medicines.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.medicines[0].name).toContain('Paracetamol');
  });

  it('should filter medicines by prescription required', async () => {
    const res = await request(app).get('/api/medicines?prescriptionRequired=true');
    expect(res.status).toBe(200);
    expect(res.body.data.medicines.length).toBe(1);
    expect(res.body.data.medicines[0].name).toContain('Amoxicillin');
  });

  it('should fetch single medicine details with related products', async () => {
    const res = await request(app).get(`/api/medicines/${testOtcMedicine._id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.medicine.name).toBe(testOtcMedicine.name);
    expect(res.body.data.related).toBeDefined();
  });
});

describe('3. Cart & Server-Side Price Integrity Tests', () => {
  it('should add item to cart and calculate discounted price server-side', async () => {
    const res = await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        medicineId: testOtcMedicine._id,
        quantity: 2,
      });

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBe(1);
    expect(res.body.data.items[0].quantity).toBe(2);
    // Price: 50 with 10% discount = 45 per item. For 2 items: 90. Delivery fee for < 500 is 40. Grand total: 130
    expect(res.body.data.subtotal).toBe(100);
    expect(res.body.data.discount).toBe(10);
    expect(res.body.data.deliveryFee).toBe(40);
    expect(res.body.data.grandTotal).toBe(130);
  });

  it('should reject adding more quantity than available stock', async () => {
    const res = await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        medicineId: testOtcMedicine._id,
        quantity: 9999,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should update cart item quantity', async () => {
    const cartRes = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${customerToken}`);

    const itemId = cartRes.body.data.items[0]._id;

    const res = await request(app)
      .put(`/api/cart/item/${itemId}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ quantity: 4 });

    expect(res.status).toBe(200);
    expect(res.body.data.items[0].quantity).toBe(4);
  });
});

describe('4. Order Placement & Stock Validation Tests', () => {
  it('should place an order and deduct stock atomically', async () => {
    const stockBefore = (await Medicine.findById(testOtcMedicine._id)).stock;

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        shippingAddress: {
          fullName: 'Test Customer',
          phone: '+919876543210',
          streetAddress: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
        },
      });

    expect(res.status).toBe(201);
    expect(res.body.data.order.orderNumber).toBeDefined();
    testOrderId = res.body.data.order._id;

    // Verify stock deduction in database
    const stockAfter = (await Medicine.findById(testOtcMedicine._id)).stock;
    expect(stockAfter).toBe(stockBefore - 4); // 4 was in cart
  });

  it('should require a prescription when purchasing prescription-required medicines', async () => {
    // Add Rx medicine to cart
    await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        medicineId: testRxMedicine._id,
        quantity: 1,
      });

    // Attempt order without prescription
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        shippingAddress: {
          fullName: 'Test Customer',
          phone: '+919876543210',
          streetAddress: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
        },
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('require a valid prescription');
  });

  it('should allow customer to cancel eligible order and restore stock', async () => {
    const stockBefore = (await Medicine.findById(testOtcMedicine._id)).stock;

    const res = await request(app)
      .post(`/api/orders/${testOrderId}/cancel`)
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.order.orderStatus).toBe(ORDER_STATUS.CANCELLED);

    // Stock should be restored
    const stockAfter = (await Medicine.findById(testOtcMedicine._id)).stock;
    expect(stockAfter).toBe(stockBefore + 4);
  });
});

describe('5. Payment & Verification Tests', () => {
  let payableOrder = null;

  beforeAll(async () => {
    // Clear user cart first
    await request(app)
      .delete('/api/cart/clear')
      .set('Authorization', `Bearer ${customerToken}`);

    // Add OTC item and create a new order to pay
    await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        medicineId: testOtcMedicine._id,
        quantity: 1,
      });

    const orderRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        shippingAddress: {
          fullName: 'Test Customer',
          phone: '+919876543210',
          streetAddress: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
        },
      });

    payableOrder = orderRes.body.data.order;
  });

  it('should create a payment intent for an order', async () => {
    const res = await request(app)
      .post('/api/payments/create-intent')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ orderId: payableOrder._id });

    expect(res.status).toBe(200);
    expect(res.body.data.razorpayOrderId).toBeDefined();
  });

  it('should verify payment and update order to PAID / PROCESSING', async () => {
    const res = await request(app)
      .post('/api/payments/verify')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        orderId: payableOrder._id,
        isTestPayment: true,
      });

    expect(res.status).toBe(200);
    expect(res.body.data.order.paymentStatus).toBe(PAYMENT_STATUS.SUCCESS);
    expect(res.body.data.order.orderStatus).toBe(ORDER_STATUS.PROCESSING);
  });
});

describe('6. Admin Authorization, Analytics & Management Tests', () => {
  it('should forbid normal customer from accessing admin analytics', async () => {
    const res = await request(app)
      .get('/api/admin/analytics/overview')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(403);
  });

  it('should permit admin to access analytics overview with accurate P&L', async () => {
    const res = await request(app)
      .get('/api/admin/analytics/overview')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.totalOrders).toBeDefined();
    expect(res.body.data.totalRevenue).toBeDefined();
    expect(res.body.data.totalGrossProfit).toBeDefined();
    expect(res.body.data.netProfit).toBeDefined();
  });

  it('should allow admin to adjust medicine stock with audit reason', async () => {
    const medBefore = await Medicine.findById(testOtcMedicine._id);
    const stockBefore = medBefore.stock;

    const res = await request(app)
      .post('/api/admin/inventory/adjust')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        medicineId: testOtcMedicine._id,
        quantityDelta: 25,
        reason: 'Received fresh manufacturer shipment batch #882',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.transaction.quantity).toBe(25);

    // Verify medicine stock updated
    const updated = await Medicine.findById(testOtcMedicine._id);
    expect(updated.stock).toBe(stockBefore + 25);
  });

  it('should allow admin to record and track operational business expenses', async () => {
    const res = await request(app)
      .post('/api/admin/expenses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Electricity Bill',
        category: 'ELECTRICITY',
        amount: 2500,
        notes: 'Monthly power consumption',
      });

    expect(res.status).toBe(201);
    expect(res.body.data.expense.amount).toBe(2500);
  });

  it('should retrieve admin audit log trail', async () => {
    const res = await request(app)
      .get('/api/admin/audit-logs')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.logs.length).toBeGreaterThanOrEqual(1);
  });
});

describe('7. Chatbot Safety & Inquiry Tests', () => {
  it('should trigger medical disclaimer warning for symptom / diagnostic query', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'I have severe chest pain what medicine should I take?' });

    expect(res.status).toBe(200);
    expect(res.body.data.action).toBe('MEDICAL_DISCLAIMER');
    expect(res.body.data.reply).toContain('IMPORTANT MEDICAL NOTICE');
    expect(res.body.data.reply).toContain('physician');
  });

  it('should answer store timing questions accurately', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'What are your store hours?' });

    expect(res.status).toBe(200);
    expect(res.body.data.reply).toContain('8:00 AM – 10:00 PM');
  });

  it('should find matching medicines in catalog', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'Do you have Paracetamol?' });

    expect(res.status).toBe(200);
    expect(res.body.data.reply).toContain('Paracetamol');
  });
});

describe('8. Indian Medicine Database & Generic Substitutes Tests', () => {
  it('should search Indian medicine directory by brand name or salt', async () => {
    const res = await request(app)
      .get('/api/external-medicines/search?query=Dolo');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.medicines.length).toBeGreaterThan(0);
    const dolo = res.body.data.medicines.find((m) => m.brandName.includes('Dolo'));
    expect(dolo).toBeDefined();
    expect(dolo.manufacturer).toBe('Micro Labs Ltd');
    expect(dolo.genericComposition).toContain('Paracetamol');
  });

  it('should find affordable generic substitutes for an active pharmaceutical salt', async () => {
    const res = await request(app)
      .get('/api/external-medicines/substitutes?generic=Paracetamol');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.substitutes.length).toBeGreaterThan(0);
    // Should be sorted by price ascending
    const prices = res.body.data.substitutes.map((s) => s.mrp);
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  });

  it('should prevent non-admin from importing Indian medicine into inventory', async () => {
    const res = await request(app)
      .post('/api/external-medicines/import')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ brandName: 'Dolo 650 Tablet' });

    expect(res.status).toBe(403);
  });

  it('should allow admin to import Indian medicine from drug directory into store catalog', async () => {
    const res = await request(app)
      .post('/api/external-medicines/import')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        brandName: 'Dolo 650 Tablet',
        initialStock: 150,
      });

    expect([200, 201]).toContain(res.status);
    expect(res.body.data.medicine.name).toBe('Dolo 650 Tablet');
    expect(res.body.data.medicine.brand).toBe('Micro Labs Ltd');
  });
});

