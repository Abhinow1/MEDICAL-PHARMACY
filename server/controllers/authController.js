import User from '../models/User.js';
import { generateToken } from '../utils/tokenUtils.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { ROLES } from '../config/constants.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (!name || !email || !phone || !password) {
      return sendError(res, 'Please provide all required fields (name, email, phone, password)', 400);
    }

    if (password !== confirmPassword) {
      return sendError(res, 'Passwords do not match', 400);
    }

    if (password.length < 6) {
      return sendError(res, 'Password must be at least 6 characters long', 400);
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendError(res, 'An account with this email already exists', 400);
    }

    const passwordHash = await User.hashPassword(password);

    // Default registration always assigns role USER (Admin accounts cannot be created publicly)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      passwordHash,
      role: ROLES.USER,
      isActive: true,
    });

    const token = generateToken({ id: user._id, role: user.role });

    return sendSuccess(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
      'Registration successful',
      201
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Please provide both email/phone and password', 400);
    }

    // Support login via email or phone
    const user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { phone: email }],
    }).select('+passwordHash');

    if (!user) {
      return sendError(res, 'Invalid email/phone or password', 401);
    }

    if (!user.isActive) {
      return sendError(res, 'Your account is deactivated. Please contact support.', 403);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid email/phone or password', 401);
    }

    const token = generateToken({ id: user._id, role: user.role });

    return sendSuccess(res, {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Please provide admin email and password', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');

    if (!user || user.role !== ROLES.ADMIN) {
      return sendError(res, 'Invalid admin credentials or unauthorized', 401);
    }

    if (!user.isActive) {
      return sendError(res, 'Admin account deactivated', 403);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid admin credentials', 401);
    }

    const token = generateToken({ id: user._id, role: user.role });

    return sendSuccess(res, {
      token,
      admin: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    }, 'Admin login successful');
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    return sendSuccess(res, { user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();
    return sendSuccess(res, { user }, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (req, res, next) => {
  try {
    const { fullName, phone, streetAddress, city, state, postalCode, landmark, isDefault } = req.body;

    if (!fullName || !phone || !streetAddress || !city || !state || !postalCode) {
      return sendError(res, 'Please provide complete address fields', 400);
    }

    // Validate 6-digit Indian PIN code format
    const pinRegex = /^[1-9][0-9]{5}$/;
    if (!pinRegex.test(postalCode.trim())) {
      return sendError(res, 'Please provide a valid 6-digit postal/PIN code', 400);
    }

    const user = await User.findById(req.user._id);

    if (isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    const newAddress = {
      fullName,
      phone,
      streetAddress,
      city,
      state,
      postalCode,
      landmark: landmark || '',
      isDefault: Boolean(isDefault || user.addresses.length === 0),
    };

    user.addresses.push(newAddress);
    await user.save();

    return sendSuccess(res, { addresses: user.addresses }, 'Address added successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const { fullName, phone, streetAddress, city, state, postalCode, landmark, isDefault } = req.body;

    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(addressId);
    if (!addr) {
      return sendError(res, 'Address not found', 404);
    }

    if (postalCode) {
      const pinRegex = /^[1-9][0-9]{5}$/;
      if (!pinRegex.test(postalCode.trim())) {
        return sendError(res, 'Please provide a valid 6-digit PIN code', 400);
      }
      addr.postalCode = postalCode;
    }

    if (isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
      addr.isDefault = true;
    }

    if (fullName) addr.fullName = fullName;
    if (phone) addr.phone = phone;
    if (streetAddress) addr.streetAddress = streetAddress;
    if (city) addr.city = city;
    if (state) addr.state = state;
    if (landmark !== undefined) addr.landmark = landmark;

    await user.save();
    return sendSuccess(res, { addresses: user.addresses }, 'Address updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);

    const addrIndex = user.addresses.findIndex((a) => a._id.toString() === addressId);
    if (addrIndex === -1) {
      return sendError(res, 'Address not found', 404);
    }

    user.addresses.splice(addrIndex, 1);
    if (user.addresses.length > 0 && !user.addresses.some((a) => a.isDefault)) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    return sendSuccess(res, { addresses: user.addresses }, 'Address deleted successfully');
  } catch (error) {
    next(error);
  }
};
