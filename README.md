# MediCare Pharmacy — Full-Stack E-Commerce & Pharmacy Management System

A production-ready, minimal, modern, and compliant online medical store and administrative operations platform built with **React (Vite), Node.js, Express, MongoDB (Mongoose), Tailwind CSS, and Recharts**.

---

## 1. Project Overview

MediCare Pharmacy delivers a seamless, accessible digital experience for ordering genuine medicines, vitamins, and chronic healthcare products. The system is architected with two distinct portals:

1. **Customer Storefront**: Fast catalog search with debouncing, department filtering, shopping cart with server-side price recalculation, prescription upload verification for Schedule H/Rx drugs, visual multi-step order tracking, AI chatbot product assistance, and official WhatsApp Click-to-Chat integration.
2. **Admin Operations Panel**: Comprehensive dashboard with real-time KPI metrics, daily and monthly sales trends, interactive Profit & Loss (P&L) statements (Gross Profit = Revenue - Product Cost; Net Profit = Gross Profit - Operating Expenses), inventory stock valuation, manual stock adjustment ledger with audit reasons, doctor prescription review queue, and customer account administration.

---

## 2. Technology Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS (custom calm pharmaceutical palette)
- **Routing**: React Router DOM (v6)
- **Icons**: Lucide React
- **Analytics Charts**: Recharts (Area, Bar, and Pie distributions)
- **HTTP Client**: Axios with JWT Bearer request and response interceptors
- **State Management**: React Context API (`AuthContext`, `CartContext`)

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js REST API
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` password hashing
- **Security**: Helmet HTTP headers, CORS whitelisting, Express Rate Limiting
- **File Uploads**: Multer with strict MIME-type (`image/jpeg`, `image/png`, `application/pdf`) and 5MB size limits
- **Testing**: Vitest + Supertest integration test suite

---

## 3. Key Architecture & Features

### Medical Safety & Statutory Compliance
- **Prescription Workflow**: If any product in an order is marked `prescriptionRequired: true`, the order requires a valid doctor prescription and enters `PRESCRIPTION_PENDING` status. Registered pharmacists must review, verify, and approve the document before dispensing.
- **Mandatory Medical Disclaimers**: Displayed across product details, cart, checkout, and footer.
- **AI Chatbot Safety Safeguards**: Automated query classifier that refuses diagnostic or prescriptive requests (e.g. "I have chest pain", "what tablet cures disease"), outputting an emergency warning and advising immediate medical doctor consultation.

### Financial P&L & Inventory Integrity
- **Server-Side Price Integrity**: Client-submitted prices are never trusted. All totals (subtotal, discounts, delivery fees, and grand totals) are computed directly against the database.
- **Historical Order Pricing**: Historical unit cost and selling price are snapshotted in order items so future price changes do not distort past financial records.
- **Accurate Profit Calculation**:
  - `Revenue = Selling Price × Quantity`
  - `Product Cost = Acquisition Cost × Quantity`
  - `Gross Profit = Revenue - Product Cost`
  - `Net Profit = Gross Profit - Total Operating Expenses`
- **Operational Expense Tracking**: Admin can log business expenses (Rent, Electricity, Courier/Delivery, Staff, Packaging, Marketing).
- **Atomic Stock Deduction**: Atomically deducted when orders are placed and restored if an eligible order is cancelled.

### WhatsApp Click-to-Chat
- Real Click-to-Chat integration using `https://wa.me/<number>?text=...` prefilled with context (general support, specific product inquiries with price, and order tracking with Order #ID).

### Payment Gateway Abstraction
- Integrated `PaymentService` supporting Razorpay with HMAC-SHA256 signature verification alongside a simulated Test Payment mode for testing without requiring real credit cards or external API keys.

---

## 4. Folder Structure

```text
medi/
├── client/                     # Frontend React + Vite application
│   ├── src/
│   │   ├── components/         # Navbar, Footer, MedicineCard, SearchBar, OrderTracker, Chatbot, WhatsApp
│   │   │   └── admin/          # AdminSidebar, AdminLayout, StatCard, PrescriptionModal, StockAdjustmentModal
│   │   ├── context/            # AuthContext.jsx, CartContext.jsx
│   │   ├── pages/              # HomePage, MedicinesPage, MedicineDetailPage, CartPage, CheckoutPage, OrdersPage, OrderDetailPage, ProfilePage, PrescriptionsPage, ContactPage, LoginPage, RegisterPage
│   │   │   └── admin/          # AdminLoginPage, AdminDashboardPage, AdminMedicinesPage, AdminMedicineFormPage, AdminOrdersPage, AdminInventoryPage, AdminAnalyticsPage, AdminPrescriptionsPage, AdminUsersPage, AdminSettingsPage
│   │   ├── services/           # api.js (Axios client with JWT interceptor)
│   │   ├── utils/              # formatters.js (currency, dates, WhatsApp links)
│   │   ├── App.jsx             # Route definitions
│   │   └── main.jsx            # React root mount
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Backend Express.js REST API
│   ├── config/                 # db.js (MongoDB + MongoMemoryServer fallback), constants.js
│   ├── controllers/            # authController, medicineController, cartController, orderController, paymentController, prescriptionController, chatController, adminController, expenseController
│   ├── middleware/             # authMiddleware, uploadMiddleware, errorMiddleware, rateLimiter
│   ├── models/                 # User, Medicine, Category, Cart, Order, Payment, Prescription, InventoryTransaction, Expense, AuditLog
│   ├── routes/                 # authRoutes, medicineRoutes, cartRoutes, orderRoutes, paymentRoutes, prescriptionRoutes, chatRoutes, adminRoutes, index.js
│   ├── services/               # paymentService, chatbotService, inventoryService, analyticsService, auditService, notificationService
│   ├── seed/                   # seed.js (Database initialization script)
│   ├── tests/                  # api.test.js (Automated integration test suite)
│   ├── app.js                  # Express app configuration
│   ├── server.js               # Server bootstrap
│   └── package.json
│
├── .env.example                # Environment variables template
├── .gitignore
├── package.json                # Root orchestrator (concurrently)
└── README.md
```

---

## 5. Environment Variables

Create a `.env` file in the root directory (or copy `.env.example`):

```env
# Server
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database (Leave blank to use automatic in-memory MongoDB in dev/test)
MONGODB_URI=

# Authentication
JWT_SECRET=super_secret_medicare_jwt_key_2026_xyz
JWT_EXPIRES_IN=7d

# Store Information
STORE_NAME=MediCare Pharmacy
STORE_PHONE=+919876543210
WHATSAPP_NUMBER=919876543210

# Payment Gateway (Optional: Real Razorpay Keys)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# AI Chatbot (Optional: Google Gemini API Key)
GEMINI_API_KEY=
```

---

## 6. Installation & Quick Start

### 1. Install Dependencies
Run from the root directory:
```bash
npm install
npm --prefix server install
npm --prefix client install
```

### 2. Seed the Database
Populates essential categories, 20+ realistic medicines, sample customer account, admin account, past 30 days of orders, and operational expenses for immediate analytics:
```bash
npm run seed
```

### 3. Run Development Server
Starts both backend (`http://localhost:5001`) and frontend (`http://localhost:5173`) concurrently:
```bash
npm run dev
```

### 4. Run Automated Tests
Executes the comprehensive backend test suite:
```bash
npm test
```

---

## 7. Pre-configured Credentials for Testing

| Portal | URL | Email | Password |
| :--- | :--- | :--- | :--- |
| **Customer Storefront** | `http://localhost:5173/login` | `customer@example.com` | `Customer@12345` |
| **Admin Operations** | `http://localhost:5173/admin/login` | `admin@medicare.com` | `Admin@12345` |

> *Note: Admin accounts cannot be created publicly via the registration form; they must be provisioned through seed scripts or authorized database administration.*

---

## 8. Production Deployment

### Frontend (Vercel / Netlify)
1. Set the root or build directory to `client`.
2. Build command: `npm run build`.
3. Output directory: `dist`.
4. Environment variable: Set `VITE_API_URL` to your backend URL (or configure reverse proxy in `vercel.json` / `netlify.toml`).

### Backend (Render / Railway / AWS EC2)
1. Root directory: `server`.
2. Start command: `npm start`.
3. Set environment variables: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `WHATSAPP_NUMBER`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`.

### Database (MongoDB Atlas)
1. Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create database user credentials and allow network access (`0.0.0.0/0`).
3. Set the connection string in `MONGODB_URI`.
