import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatbotWidget from './components/ChatbotWidget';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';

// Customer Pages
import HomePage from './pages/HomePage';
import MedicinesPage from './pages/MedicinesPage';
import MedicineDetailPage from './pages/MedicineDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import PrescriptionsPage from './pages/PrescriptionsPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Admin Pages & Layout
import AdminLayout from './components/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminMedicinesPage from './pages/admin/AdminMedicinesPage';
import AdminMedicineFormPage from './pages/admin/AdminMedicineFormPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminInventoryPage from './pages/admin/AdminInventoryPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminPrescriptionsPage from './pages/admin/AdminPrescriptionsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

import MobileBottomNav from './components/MobileBottomNav';

// Customer Layout Shell
const CustomerLayout = () => {
  return (
    <div className="min-h-[100dvh] flex flex-col justify-between overflow-x-hidden">
      <Navbar />
      <main className="flex-1 px-3 sm:px-6 pb-20 md:pb-6">
        <Outlet />
      </main>
      <Footer />
      {/* Floating Interactive Widgets */}
      <ChatbotWidget />
      <WhatsAppFloatingButton />
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Customer Storefront Routes */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/medicines" element={<MedicinesPage />} />
        <Route path="/medicines/:id" element={<MedicineDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/prescriptions" element={<PrescriptionsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Admin Authentication */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Workspace Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="medicines" element={<AdminMedicinesPage />} />
        <Route path="medicines/add" element={<AdminMedicineFormPage />} />
        <Route path="medicines/edit/:id" element={<AdminMedicineFormPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="inventory" element={<AdminInventoryPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="prescriptions" element={<AdminPrescriptionsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
