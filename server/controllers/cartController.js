import Cart from '../models/Cart.js';
import Medicine from '../models/Medicine.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

/**
 * Helper to compute recalculated cart totals strictly from current database values
 */
const calculateCartTotals = (items) => {
  let subtotal = 0;
  let totalDiscount = 0;
  let prescriptionRequired = false;

  const populatedItems = items.map((item) => {
    const med = item.medicine;
    const originalPrice = med.price;
    const discount = med.discount || 0;
    const finalUnitPrice = discount > 0 ? originalPrice - (originalPrice * discount) / 100 : originalPrice;
    const itemSubtotal = Math.round(finalUnitPrice * item.quantity * 100) / 100;
    const itemDiscountAmount = Math.round(((originalPrice * discount) / 100) * item.quantity * 100) / 100;

    subtotal += originalPrice * item.quantity;
    totalDiscount += itemDiscountAmount;

    if (med.prescriptionRequired) {
      prescriptionRequired = true;
    }

    return {
      _id: item._id,
      medicine: {
        _id: med._id,
        name: med.name,
        brand: med.brand,
        genericName: med.genericName,
        price: med.price,
        discount: med.discount,
        finalPrice: finalUnitPrice,
        stock: med.stock,
        image: med.image,
        prescriptionRequired: med.prescriptionRequired,
        packSize: med.packSize,
      },
      quantity: item.quantity,
      itemTotal: itemSubtotal,
    };
  });

  const discountedTotal = subtotal - totalDiscount;
  // Free delivery for orders above ₹500, else ₹40
  const deliveryFee = discountedTotal >= 500 || populatedItems.length === 0 ? 0 : 40;
  const grandTotal = Math.round((discountedTotal + deliveryFee) * 100) / 100;

  return {
    items: populatedItems,
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(totalDiscount * 100) / 100,
    deliveryFee,
    grandTotal,
    prescriptionRequired,
  };
};

export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.medicine');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Filter out deleted/inactive medicines if any
    const validItems = cart.items.filter((item) => item.medicine && item.medicine.isActive);
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const calculated = calculateCartTotals(cart.items);
    return sendSuccess(res, calculated);
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { medicineId, quantity = 1 } = req.body;

    if (!medicineId) {
      return sendError(res, 'Medicine ID is required', 400);
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      return sendError(res, 'Quantity must be at least 1', 400);
    }

    const medicine = await Medicine.findById(medicineId);
    if (!medicine || !medicine.isActive) {
      return sendError(res, 'Medicine not found or unavailable', 404);
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingIndex = cart.items.findIndex((item) => item.medicine.toString() === medicineId);

    const currentQtyInCart = existingIndex > -1 ? cart.items[existingIndex].quantity : 0;
    const desiredTotalQty = currentQtyInCart + qty;

    if (desiredTotalQty > medicine.stock) {
      return sendError(
        res,
        `Cannot add ${qty} item(s). Only ${medicine.stock} available in stock (you have ${currentQtyInCart} in cart).`,
        400
      );
    }

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity = desiredTotalQty;
    } else {
      cart.items.push({ medicine: medicineId, quantity: qty });
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.medicine');
    const calculated = calculateCartTotals(populatedCart.items);

    return sendSuccess(res, calculated, 'Item added to cart');
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      return sendError(res, 'Quantity must be at least 1', 400);
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.medicine');
    if (!cart) {
      return sendError(res, 'Cart not found', 404);
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return sendError(res, 'Cart item not found', 404);
    }

    if (qty > item.medicine.stock) {
      return sendError(res, `Only ${item.medicine.stock} units available in stock.`, 400);
    }

    item.quantity = qty;
    await cart.save();

    const calculated = calculateCartTotals(cart.items);
    return sendSuccess(res, calculated, 'Cart item updated');
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return sendError(res, 'Cart not found', 404);
    }

    const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return sendError(res, 'Cart item not found', 404);
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.medicine');
    const calculated = calculateCartTotals(populatedCart.items);

    return sendSuccess(res, calculated, 'Item removed from cart');
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    return sendSuccess(res, { items: [], subtotal: 0, discount: 0, deliveryFee: 0, grandTotal: 0 }, 'Cart cleared');
  } catch (error) {
    next(error);
  }
};
