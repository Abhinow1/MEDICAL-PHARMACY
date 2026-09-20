import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [prescriptionRequired, setPrescriptionRequired] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated || user?.role === 'ADMIN') {
      setItems([]);
      setSubtotal(0);
      setDiscount(0);
      setDeliveryFee(0);
      setGrandTotal(0);
      setPrescriptionRequired(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get('/cart');
      if (res.data.success) {
        const data = res.data.data;
        setItems(data.items || []);
        setSubtotal(data.subtotal || 0);
        setDiscount(data.discount || 0);
        setDeliveryFee(data.deliveryFee || 0);
        setGrandTotal(data.grandTotal || 0);
        setPrescriptionRequired(data.prescriptionRequired || false);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated, user]);

  const addToCart = async (medicineId, quantity = 1) => {
    if (!isAuthenticated) {
      return { success: false, requireAuth: true };
    }

    try {
      const res = await api.post('/cart/add', { medicineId, quantity });
      if (res.data.success) {
        const data = res.data.data;
        setItems(data.items || []);
        setSubtotal(data.subtotal || 0);
        setDiscount(data.discount || 0);
        setDeliveryFee(data.deliveryFee || 0);
        setGrandTotal(data.grandTotal || 0);
        setPrescriptionRequired(data.prescriptionRequired || false);
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add item to cart',
      };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await api.put(`/cart/item/${itemId}`, { quantity });
      if (res.data.success) {
        const data = res.data.data;
        setItems(data.items || []);
        setSubtotal(data.subtotal || 0);
        setDiscount(data.discount || 0);
        setDeliveryFee(data.deliveryFee || 0);
        setGrandTotal(data.grandTotal || 0);
        setPrescriptionRequired(data.prescriptionRequired || false);
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update quantity',
      };
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await api.delete(`/cart/item/${itemId}`);
      if (res.data.success) {
        const data = res.data.data;
        setItems(data.items || []);
        setSubtotal(data.subtotal || 0);
        setDiscount(data.discount || 0);
        setDeliveryFee(data.deliveryFee || 0);
        setGrandTotal(data.grandTotal || 0);
        setPrescriptionRequired(data.prescriptionRequired || false);
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove item',
      };
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear');
      setItems([]);
      setSubtotal(0);
      setDiscount(0);
      setDeliveryFee(0);
      setGrandTotal(0);
      setPrescriptionRequired(false);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const value = {
    items,
    itemCount,
    subtotal,
    discount,
    deliveryFee,
    grandTotal,
    prescriptionRequired,
    loading,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
