/**
 * Resilient Client-Side Fallback Catalog for St Mary's Pharmacy
 * Ensures the storefront renders authentic Indian medicines immediately
 * even if deployed on static hosts (like Vercel) prior to backend linking.
 */

export const FALLBACK_CATEGORIES = [
  { _id: 'cat-1', name: 'Pain Relief', slug: 'pain-relief', icon: 'Pill', color: 'bg-rose-50 border-rose-200 text-rose-700' },
  { _id: 'cat-2', name: 'Cold & Immunity', slug: 'cold-immunity', icon: 'Shield', color: 'bg-amber-50 border-amber-200 text-amber-700' },
  { _id: 'cat-3', name: 'Diabetes Care', slug: 'diabetes-care', icon: 'HeartPulse', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { _id: 'cat-4', name: 'Cardiac & BP', slug: 'cardiac-bp', icon: 'Activity', color: 'bg-red-50 border-red-200 text-red-700' },
  { _id: 'cat-5', name: 'Gastro & Acidity', slug: 'gastro-acidity', icon: 'Sparkles', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  { _id: 'cat-6', name: 'Vitamins & Supplements', slug: 'vitamins-supplements', icon: 'Apple', color: 'bg-orange-50 border-orange-200 text-orange-700' },
  { _id: 'cat-7', name: 'Skin & Dermatology', slug: 'skin-dermatology', icon: 'Smile', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { _id: 'cat-8', name: 'Antibiotics & Rx', slug: 'antibiotics', icon: 'FileText', color: 'bg-teal-50 border-teal-200 text-teal-700' },
];

export const FALLBACK_MEDICINES = [
  {
    _id: 'med-101',
    name: 'Dolo 650 Tablet',
    genericName: 'Paracetamol (650mg)',
    brand: 'Micro Labs Ltd',
    category: 'pain-relief',
    categoryName: 'Pain Relief',
    price: 33,
    mrp: 38,
    discountPercent: 13,
    prescriptionRequired: false,
    stock: 250,
    dosageForm: 'Tablet',
    strength: '650mg',
    packageSize: 'Strip of 15 tablets',
    rating: 4.9,
    ratingCount: 1240,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
    description: 'Fast-acting antipyretic and analgesic for fever, headache, body ache, and mild inflammatory pain.',
    uses: ['Fever', 'Headache', 'Body Pain', 'Mild Arthritis'],
    sideEffects: ['Nausea', 'Gastric irritation in rare cases'],
    safetyAdvice: { alcohol: 'Avoid alcohol while taking paracetamol.', pregnancy: 'Generally considered safe under medical advice.', driving: 'Does not affect driving ability.' }
  },
  {
    _id: 'med-102',
    name: 'Augmentin 625 Duo Tablet',
    genericName: 'Amoxicillin (500mg) + Clavulanic Acid (125mg)',
    brand: 'GlaxoSmithKline (GSK)',
    category: 'antibiotics',
    categoryName: 'Antibiotics & Rx',
    price: 204,
    mrp: 235,
    discountPercent: 13,
    prescriptionRequired: true,
    stock: 120,
    dosageForm: 'Tablet',
    strength: '625mg',
    packageSize: 'Strip of 10 tablets',
    rating: 4.8,
    ratingCount: 890,
    imageUrl: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&auto=format&fit=crop&q=80',
    description: 'Broad-spectrum antibiotic used to treat bacterial infections of the lungs, sinus, ear, urinary tract, and skin.',
    uses: ['Respiratory Infections', 'Sinusitis', 'Urinary Tract Infections', 'Skin Infections'],
    sideEffects: ['Loose stools', 'Nausea', 'Abdominal discomfort'],
    safetyAdvice: { alcohol: 'Avoid consumption during antibiotic therapy.', pregnancy: 'Consult your doctor before starting.', driving: 'Safe to drive unless feeling dizzy.' }
  },
  {
    _id: 'med-103',
    name: 'Pan-D Capsule',
    genericName: 'Pantoprazole (40mg) + Domperidone (30mg SR)',
    brand: 'Alkem Laboratories',
    category: 'gastro-acidity',
    categoryName: 'Gastro & Acidity',
    price: 199,
    mrp: 228,
    discountPercent: 12,
    prescriptionRequired: true,
    stock: 180,
    dosageForm: 'Capsule',
    strength: '40mg/30mg',
    packageSize: 'Strip of 15 capsules',
    rating: 4.7,
    ratingCount: 760,
    imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=80',
    description: 'Relieves symptoms of gastroesophageal reflux disease (acid reflux), heartburn, nausea, and indigestion.',
    uses: ['Acidity', 'Heartburn', 'GERD', 'Nausea associated with acid dyspepsia'],
    sideEffects: ['Dry mouth', 'Headache', 'Flatulence'],
    safetyAdvice: { alcohol: 'Alcohol stimulates gastric acid and reduces effectiveness.', pregnancy: 'Consult doctor before use.', driving: 'Safe to drive.' }
  },
  {
    _id: 'med-104',
    name: 'Shelcal 500 Tablet',
    genericName: 'Calcium (500mg) + Vitamin D3 (250 IU)',
    brand: 'Torrent Pharmaceuticals',
    category: 'vitamins-supplements',
    categoryName: 'Vitamins & Supplements',
    price: 144,
    mrp: 165,
    discountPercent: 12,
    prescriptionRequired: false,
    stock: 210,
    dosageForm: 'Tablet',
    strength: '500mg',
    packageSize: 'Strip of 15 tablets',
    rating: 4.9,
    ratingCount: 1540,
    imageUrl: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=500&auto=format&fit=crop&q=80',
    description: 'Promotes healthy bone density, joint strength, and prevents calcium deficiency and osteoporosis.',
    uses: ['Bone Strength', 'Calcium Deficiency', 'Osteoporosis Prevention', 'Joint Support'],
    sideEffects: ['Constipation with excessive dose', 'Mild upset stomach'],
    safetyAdvice: { alcohol: 'No known interaction.', pregnancy: 'Safe and often recommended under doctor guidance.', driving: 'Safe.' }
  },
  {
    _id: 'med-105',
    name: 'Combiflam Tablet',
    genericName: 'Ibuprofen (400mg) + Paracetamol (325mg)',
    brand: 'Sanofi India',
    category: 'pain-relief',
    categoryName: 'Pain Relief',
    price: 45,
    mrp: 52,
    discountPercent: 13,
    prescriptionRequired: false,
    stock: 300,
    dosageForm: 'Tablet',
    strength: '400mg/325mg',
    packageSize: 'Strip of 20 tablets',
    rating: 4.8,
    ratingCount: 1980,
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80',
    description: 'Dual-action analgesic and anti-inflammatory formulation for rapid relief from dental, muscle, and joint pain.',
    uses: ['Toothache', 'Muscle Sprains', 'Joint Pain', 'Headache & Fever'],
    sideEffects: ['Heartburn', 'Nausea', 'Gastric discomfort'],
    safetyAdvice: { alcohol: 'Avoid alcohol to prevent gastric irritation.', pregnancy: 'Not recommended in 3rd trimester.', driving: 'Safe.' }
  },
  {
    _id: 'med-106',
    name: 'Azithral 500 Tablet',
    genericName: 'Azithromycin (500mg)',
    brand: 'Alembic Pharmaceuticals',
    category: 'antibiotics',
    categoryName: 'Antibiotics & Rx',
    price: 132,
    mrp: 148,
    discountPercent: 10,
    prescriptionRequired: true,
    stock: 140,
    dosageForm: 'Tablet',
    strength: '500mg',
    packageSize: 'Strip of 5 tablets',
    rating: 4.7,
    ratingCount: 620,
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&auto=format&fit=crop&q=80',
    description: 'Macrolide antibiotic commonly prescribed for throat infections, pneumonia, bronchitis, and skin infections.',
    uses: ['Tonsillitis', 'Bronchitis', 'Pneumonia', 'Ear & Sinus Infections'],
    sideEffects: ['Diarrhea', 'Abdominal cramps', 'Mild nausea'],
    safetyAdvice: { alcohol: 'Avoid alcohol during medication course.', pregnancy: 'Consult doctor.', driving: 'Safe.' }
  },
  {
    _id: 'med-107',
    name: 'Becosules Z Capsules',
    genericName: 'Vitamin B-Complex + Vitamin C + Zinc',
    brand: 'Pfizer Ltd',
    category: 'vitamins-supplements',
    categoryName: 'Vitamins & Supplements',
    price: 56,
    mrp: 62,
    discountPercent: 9,
    prescriptionRequired: false,
    stock: 350,
    dosageForm: 'Capsule',
    strength: 'Standard Formula',
    packageSize: 'Strip of 20 capsules',
    rating: 4.9,
    ratingCount: 2200,
    imageUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80',
    description: 'Essential multivitamin complex for healing mouth ulcers, boosting physical energy, and enhancing immunity.',
    uses: ['Mouth Ulcers', 'Daily Immunity', 'Energy & Stamina', 'Skin Health'],
    sideEffects: ['Harmless bright yellow urine discoloration', 'Mild nausea if taken empty stomach'],
    safetyAdvice: { alcohol: 'Safe, moderate intake.', pregnancy: 'Safe under medical supervision.', driving: 'Safe.' }
  },
  {
    _id: 'med-108',
    name: 'Telma 40 Tablet',
    genericName: 'Telmisartan (40mg)',
    brand: 'Glenmark Pharmaceuticals',
    category: 'cardiac-bp',
    categoryName: 'Cardiac & BP',
    price: 220,
    mrp: 245,
    discountPercent: 10,
    prescriptionRequired: true,
    stock: 190,
    dosageForm: 'Tablet',
    strength: '40mg',
    packageSize: 'Strip of 30 tablets',
    rating: 4.8,
    ratingCount: 1100,
    imageUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&auto=format&fit=crop&q=80',
    description: 'Angiotensin receptor blocker (ARB) used for the long-term management of hypertension and cardiovascular risk reduction.',
    uses: ['High Blood Pressure', 'Hypertension Prevention', 'Cardiovascular Risk Reduction'],
    sideEffects: ['Dizziness when standing up suddenly', 'Fatigue'],
    safetyAdvice: { alcohol: 'Alcohol lowers blood pressure further and may cause dizziness.', pregnancy: 'Strictly contraindicated in pregnancy.', driving: 'Caution if feeling dizzy.' }
  },
  {
    _id: 'med-109',
    name: 'Glycomet-GP 1 Tablet',
    genericName: 'Glimepiride (1mg) + Metformin (500mg SR)',
    brand: 'USV Ltd',
    category: 'diabetes-care',
    categoryName: 'Diabetes Care',
    price: 110,
    mrp: 125,
    discountPercent: 12,
    prescriptionRequired: true,
    stock: 160,
    dosageForm: 'Tablet',
    strength: '1mg/500mg',
    packageSize: 'Strip of 15 tablets',
    rating: 4.8,
    ratingCount: 840,
    imageUrl: 'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=500&auto=format&fit=crop&q=80',
    description: 'Effective combination antidiabetic therapy for Type 2 diabetes mellitus to achieve optimal glycemic control.',
    uses: ['Type 2 Diabetes Mellitus', 'Blood Glucose Management', 'Insulin Sensitivity'],
    sideEffects: ['Hypoglycemia (low blood sugar)', 'Nausea', 'Metallic taste'],
    safetyAdvice: { alcohol: 'Avoid alcohol as it increases risk of severe hypoglycemia.', pregnancy: 'Consult endocrinologist.', driving: 'Carry glucose sweets while driving.' }
  },
  {
    _id: 'med-110',
    name: 'Volini Pain Relief Gel 55g',
    genericName: 'Diclofenac Diethylamine + Methyl Salicylate + Menthol',
    brand: 'Sun Pharma',
    category: 'pain-relief',
    categoryName: 'Pain Relief',
    price: 160,
    mrp: 180,
    discountPercent: 11,
    prescriptionRequired: false,
    stock: 220,
    dosageForm: 'Gel',
    strength: '55g Tube',
    packageSize: '55g Tube',
    rating: 4.9,
    ratingCount: 1650,
    imageUrl: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=500&auto=format&fit=crop&q=80',
    description: 'Deep penetrating pain relief formula for quick action against backache, neck pain, sprains, and joint stiffness.',
    uses: ['Back Pain', 'Neck Stiffness', 'Sports Sprains', 'Knee Joint Pain'],
    sideEffects: ['Local mild tingling or redness'],
    safetyAdvice: { alcohol: 'Safe.', pregnancy: 'Consult doctor for large surface application.', driving: 'Safe.' }
  },
  {
    _id: 'med-111',
    name: 'Allegra 120mg Tablet',
    genericName: 'Fexofenadine Hydrochloride (120mg)',
    brand: 'Sanofi India',
    category: 'cold-immunity',
    categoryName: 'Cold & Immunity',
    price: 215,
    mrp: 238,
    discountPercent: 9,
    prescriptionRequired: false,
    stock: 175,
    dosageForm: 'Tablet',
    strength: '120mg',
    packageSize: 'Strip of 10 tablets',
    rating: 4.8,
    ratingCount: 710,
    imageUrl: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=500&auto=format&fit=crop&q=80',
    description: 'Non-sedating antihistamine for rapid relief from seasonal allergic rhinitis, sneezing, runny nose, and hives.',
    uses: ['Allergic Rhinitis', 'Sneezing & Runny Nose', 'Skin Allergy & Urticaria'],
    sideEffects: ['Headache', 'Drowsiness in rare individuals'],
    safetyAdvice: { alcohol: 'Safe, avoid excessive alcohol.', pregnancy: 'Consult doctor.', driving: 'Non-drowsy formulation.' }
  },
  {
    _id: 'med-112',
    name: 'Candid-B Cream 20g',
    genericName: 'Clotrimazole (1% w/w) + Beclomethasone (0.025% w/w)',
    brand: 'Glenmark Pharmaceuticals',
    category: 'skin-dermatology',
    categoryName: 'Skin & Dermatology',
    price: 140,
    mrp: 155,
    discountPercent: 10,
    prescriptionRequired: true,
    stock: 140,
    dosageForm: 'Cream',
    strength: '20g Tube',
    packageSize: '20g Tube',
    rating: 4.7,
    ratingCount: 520,
    imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500&auto=format&fit=crop&q=80',
    description: 'Dual antifungal and anti-inflammatory cream for fungal skin infections associated with redness and severe itching.',
    uses: ['Ringworm', 'Jock Itch', 'Athlete\'s Foot', 'Fungal Skin Infections with Itching'],
    sideEffects: ['Mild local burning sensation'],
    safetyAdvice: { alcohol: 'Safe.', pregnancy: 'Consult dermatologist.', driving: 'Safe.' }
  }
];

/**
 * Parses query params from an API URL and filters fallback medicines accordingly
 */
export const filterFallbackMedicines = (url) => {
  try {
    const urlObj = new URL(url, 'http://localhost');
    const search = (urlObj.searchParams.get('search') || '').toLowerCase().trim();
    const category = urlObj.searchParams.get('category') || 'all';
    const rx = urlObj.searchParams.get('prescriptionRequired');
    const minPrice = parseFloat(urlObj.searchParams.get('minPrice')) || 0;
    const maxPrice = parseFloat(urlObj.searchParams.get('maxPrice')) || Infinity;
    const sort = urlObj.searchParams.get('sort') || 'popularity';
    const page = parseInt(urlObj.searchParams.get('page')) || 1;
    const limit = parseInt(urlObj.searchParams.get('limit')) || 12;

    let filtered = [...FALLBACK_MEDICINES];

    if (search) {
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(search) ||
          m.genericName.toLowerCase().includes(search) ||
          m.brand.toLowerCase().includes(search) ||
          (m.uses && m.uses.some((u) => u.toLowerCase().includes(search)))
      );
    }

    if (category && category !== 'all') {
      filtered = filtered.filter((m) => m.category === category);
    }

    if (rx !== null && rx !== undefined && rx !== '') {
      filtered = filtered.filter((m) => m.prescriptionRequired === (rx === 'true'));
    }

    if (minPrice > 0) {
      filtered = filtered.filter((m) => m.price >= minPrice);
    }

    if (maxPrice < Infinity) {
      filtered = filtered.filter((m) => m.price <= maxPrice);
    }

    if (sort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedMedicines = filtered.slice(startIndex, startIndex + limit);

    return {
      medicines: paginatedMedicines,
      pagination: {
        total,
        totalPages,
        page,
        limit,
      },
    };
  } catch (err) {
    console.error('Fallback filter error:', err);
    return {
      medicines: FALLBACK_MEDICINES,
      pagination: {
        total: FALLBACK_MEDICINES.length,
        totalPages: 1,
        page: 1,
        limit: 12,
      },
    };
  }
};

/**
 * Helper to safely parse Axios request data
 */
const parseBody = (data) => {
  if (!data) return {};
  if (typeof data === 'object') return data;
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
};

/**
 * Mock data helpers for storage-backed offline/preview demo
 */
const DEFAULT_CUSTOMER = {
  _id: 'usr-customer-101',
  name: 'Rahul Sharma',
  email: 'customer@example.com',
  phone: '+919812345678',
  role: 'USER',
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
};

const DEFAULT_ADMIN = {
  _id: 'usr-admin-001',
  name: 'Dr. Sarah Jenkins (Pharmacist Admin)',
  email: 'admin@stmarys.com',
  phone: '+919876543210',
  role: 'ADMIN',
  isActive: true,
};

const getMockCart = () => {
  try {
    const raw = localStorage.getItem('mock_pharmacy_cart');
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    items: [],
    subtotal: 0,
    discount: 0,
    deliveryFee: 0,
    grandTotal: 0,
    prescriptionRequired: false,
  };
};

const saveMockCart = (cart) => {
  let subtotal = 0;
  let discount = 0;
  let rxReq = false;

  (cart.items || []).forEach((item) => {
    const orig = (item.medicine?.mrp || item.medicine?.price || 50) * item.quantity;
    const discPct = item.medicine?.discountPercent || item.medicine?.discount || 0;
    const finalPrice = Math.round((orig - (orig * discPct) / 100) * 100) / 100;
    subtotal += orig;
    discount += orig - finalPrice;
    if (item.medicine?.prescriptionRequired) rxReq = true;
  });

  const discounted = Math.round((subtotal - discount) * 100) / 100;
  const deliveryFee = cart.items.length === 0 || discounted >= 500 ? 0 : 40;
  const grandTotal = Math.round((discounted + deliveryFee) * 100) / 100;

  const updated = {
    items: cart.items,
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    deliveryFee,
    grandTotal,
    prescriptionRequired: rxReq,
  };

  localStorage.setItem('mock_pharmacy_cart', JSON.stringify(updated));
  return updated;
};

/**
 * Main fallback request handler for client API interceptor
 */
export const handleFallbackRequest = (config) => {
  if (!config || !config.url) return null;
  const url = config.url;
  const method = (config.method || 'get').toLowerCase();

  // 1. Authentication: Login
  if (url.includes('/auth/login') && method === 'post') {
    const body = parseBody(config.data);
    let matchedUser = DEFAULT_CUSTOMER;
    try {
      const users = JSON.parse(localStorage.getItem('mock_users_db') || '[]');
      const found = users.find((u) => u.email?.toLowerCase() === body.email?.toLowerCase());
      if (found) matchedUser = found;
    } catch {}

    if (body.email && body.email !== 'customer@example.com') {
      matchedUser = {
        ...DEFAULT_CUSTOMER,
        email: body.email,
        name: body.email.split('@')[0],
      };
    }

    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        data: {
          token: 'mock-jwt-customer-' + Date.now(),
          user: matchedUser,
        },
        message: 'Login successful',
      },
    });
  }

  // 2. Authentication: Admin Login
  if (url.includes('/auth/admin-login') && method === 'post') {
    const body = parseBody(config.data);
    const adminUser = {
      ...DEFAULT_ADMIN,
      email: body.email || 'admin@stmarys.com',
    };

    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        data: {
          token: 'mock-jwt-admin-' + Date.now(),
          admin: adminUser,
        },
        message: 'Admin login successful',
      },
    });
  }

  // 3. Authentication: Register
  if (url.includes('/auth/register') && method === 'post') {
    const body = parseBody(config.data);
    const newUser = {
      _id: 'usr-' + Date.now(),
      name: body.name || 'New Customer',
      email: body.email || 'customer@example.com',
      phone: body.phone || '+919876543210',
      role: 'USER',
      addresses: [],
      isActive: true,
    };

    try {
      const users = JSON.parse(localStorage.getItem('mock_users_db') || '[]');
      users.push(newUser);
      localStorage.setItem('mock_users_db', JSON.stringify(users));
    } catch {}

    return Promise.resolve({
      status: 201,
      data: {
        success: true,
        data: {
          token: 'mock-jwt-customer-' + Date.now(),
          user: newUser,
        },
        message: 'Registration successful',
      },
    });
  }

  // 4. Authentication: Profile
  if (url.includes('/auth/profile')) {
    let currentUser = DEFAULT_CUSTOMER;
    try {
      const stored = localStorage.getItem('medicare_user');
      if (stored) currentUser = JSON.parse(stored);
    } catch {}

    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        data: { user: currentUser },
      },
    });
  }

  // 5. Authentication: Address Add
  if (url.includes('/auth/address') && method === 'post') {
    const body = parseBody(config.data);
    let currentUser = DEFAULT_CUSTOMER;
    try {
      const stored = localStorage.getItem('medicare_user');
      if (stored) currentUser = JSON.parse(stored);
    } catch {}

    currentUser.addresses = currentUser.addresses || [];
    currentUser.addresses.push({
      ...body,
      isDefault: currentUser.addresses.length === 0,
    });

    localStorage.setItem('medicare_user', JSON.stringify(currentUser));

    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        data: { addresses: currentUser.addresses },
        message: 'Address saved successfully',
      },
    });
  }

  // 6. Shopping Cart: Add
  if (url.includes('/cart/add') && method === 'post') {
    const body = parseBody(config.data);
    const med = FALLBACK_MEDICINES.find((m) => m._id === body.medicineId) || FALLBACK_MEDICINES[0];
    const cart = getMockCart();
    const existing = cart.items.find((i) => i.medicine?._id === med._id);

    if (existing) {
      existing.quantity += body.quantity || 1;
    } else {
      cart.items.push({
        _id: 'ci-' + Date.now(),
        medicine: med,
        quantity: body.quantity || 1,
      });
    }

    const updated = saveMockCart(cart);
    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        data: updated,
        message: 'Item added to cart',
      },
    });
  }

  // 7. Shopping Cart: Update Quantity
  if (url.includes('/cart/item/') && (method === 'put' || method === 'patch')) {
    const body = parseBody(config.data);
    const cart = getMockCart();
    const itemId = url.split('/cart/item/')[1]?.split('?')[0];
    const item = cart.items.find((i) => i._id === itemId || i.medicine?._id === itemId);

    if (item) {
      item.quantity = body.quantity;
    }

    const updated = saveMockCart(cart);
    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        data: updated,
      },
    });
  }

  // 8. Shopping Cart: Delete Item
  if (url.includes('/cart/item/') && method === 'delete') {
    const cart = getMockCart();
    const itemId = url.split('/cart/item/')[1]?.split('?')[0];
    cart.items = cart.items.filter((i) => i._id !== itemId && i.medicine?._id !== itemId);
    const updated = saveMockCart(cart);
    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        data: updated,
      },
    });
  }

  // 9. Shopping Cart: Clear
  if (url.includes('/cart/clear') || (url.endsWith('/cart') && method === 'delete')) {
    const updated = saveMockCart({ items: [] });
    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        data: updated,
      },
    });
  }

  // 10. Shopping Cart: Get
  if (url.includes('/cart') && method === 'get') {
    const cart = getMockCart();
    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        data: cart,
      },
    });
  }

  // 11. Orders: Create / Place Order
  if (url.includes('/orders') && method === 'post') {
    const body = parseBody(config.data);
    const cart = getMockCart();
    const orderNumber = 'STM-' + Math.floor(100000 + Math.random() * 900000);

    const newOrder = {
      _id: 'ord-' + Date.now(),
      orderNumber,
      createdAt: new Date().toISOString(),
      items: cart.items.map((i) => ({
        medicine: i.medicine,
        name: i.medicine?.name || 'Medicine',
        price: i.medicine?.price || 50,
        costPrice: Math.round((i.medicine?.price || 50) * 0.65),
        quantity: i.quantity,
        subtotal: (i.medicine?.price || 50) * i.quantity,
      })),
      shippingAddress: body.shippingAddress || DEFAULT_CUSTOMER.addresses[0],
      subtotal: cart.subtotal || 250,
      discount: cart.discount || 25,
      deliveryFee: cart.deliveryFee || 0,
      total: cart.grandTotal || 225,
      orderStatus: body.prescriptionId ? 'PRESCRIPTION_PENDING' : 'PROCESSING',
      paymentMethod: body.paymentMethod || 'TEST',
      paymentStatus: 'PAID',
    };

    try {
      const orders = JSON.parse(localStorage.getItem('mock_orders_db') || '[]');
      orders.unshift(newOrder);
      localStorage.setItem('mock_orders_db', JSON.stringify(orders));
    } catch {}

    saveMockCart({ items: [] }); // clear cart

    return Promise.resolve({
      status: 201,
      data: {
        success: true,
        data: { order: newOrder },
        message: 'Order placed successfully',
      },
    });
  }

  // 12. Orders: List User Orders
  if (url.includes('/orders') && method === 'get' && !url.includes('/admin/')) {
    let orders = [];
    try {
      orders = JSON.parse(localStorage.getItem('mock_orders_db') || '[]');
    } catch {}

    if (orders.length === 0) {
      orders = [
        {
          _id: 'ord-mock-sample-1',
          orderNumber: 'STM-834921',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          items: [
            {
              medicine: FALLBACK_MEDICINES[0],
              name: 'Dolo 650 Tablet',
              price: 33,
              quantity: 2,
              subtotal: 66,
            },
          ],
          total: 106,
          orderStatus: 'DELIVERED',
        },
      ];
    }

    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        data: { orders },
      },
    });
  }

  // 13. Prescriptions: Upload
  if (url.includes('/prescriptions') && method === 'post') {
    const rx = {
      _id: 'rx-' + Date.now(),
      status: 'PENDING',
      fileUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500',
      createdAt: new Date().toISOString(),
    };

    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        data: { prescription: rx },
        message: 'Prescription uploaded successfully',
      },
    });
  }

  // 14. Prescriptions: Get
  if (url.includes('/prescriptions') && method === 'get' && !url.includes('/admin/')) {
    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        data: { prescriptions: [] },
      },
    });
  }

  // 15. AI Chatbot
  if (url.includes('/chat') && method === 'post') {
    const body = parseBody(config.data);
    const msg = (body.message || '').toLowerCase();
    let reply = "Hello! I am your St Mary's Pharmacy Assistant. We provide genuine medicines, express delivery, and doctor prescription verification.";

    if (msg.includes('chest') || msg.includes('pain') || msg.includes('diagnos')) {
      reply = "⚠️ Important Medical Notice: As an automated pharmacy assistant, I cannot diagnose conditions. If you are experiencing chest pain or an acute emergency, please call 112 / 102 or visit the nearest hospital.";
    } else if (msg.includes('delivery') || msg.includes('charge')) {
      reply = "🚚 Free delivery on all orders above ₹500! A nominal ₹40 fee applies for smaller orders. Standard delivery takes 24-48 hours.";
    } else if (msg.includes('time') || msg.includes('hour')) {
      reply = "🕒 Physical Dispensary Hours: Monday–Saturday 8:00 AM – 10:00 PM, Sunday 9:00 AM – 6:00 PM. Online ordering is available 24/7!";
    }

    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        data: { reply },
      },
    });
  }

  // 16. Indian Medicine Search & Substitutes
  if (url.includes('/external-medicines')) {
    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        data: {
          medicines: FALLBACK_MEDICINES,
          substitutes: [
            { brandName: 'Calpol 650', genericComposition: 'Paracetamol (650mg)', mrp: 32.5, manufacturer: 'GSK' },
            { brandName: 'Crocin 650', genericComposition: 'Paracetamol (650mg)', mrp: 34.0, manufacturer: 'Haleon' },
            { brandName: 'Pacimol 650', genericComposition: 'Paracetamol (650mg)', mrp: 29.0, manufacturer: 'Ipca' },
          ],
        },
      },
    });
  }

  // 17. Admin Analytics & Management
  if (url.includes('/admin/analytics/overview')) {
    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        data: {
          todaySales: 12450,
          todayGrossProfit: 4320,
          monthlySales: 348200,
          monthlyGrossProfit: 121870,
          monthlyExpenses: 42000,
          monthlyNetProfit: 79870,
          totalOrders: 1420,
          pendingOrders: 18,
          totalCustomers: 856,
          lowStockCount: 4,
          pendingPrescriptionsCount: 6,
          totalRevenue: 348200,
          totalProductCost: 226330,
          totalGrossProfit: 121870,
          totalExpenses: 42000,
          netProfit: 79870,
          averageOrderValue: 245,
        },
      },
    });
  }

  if (url.includes('/admin/analytics/sales')) {
    const days = 30;
    const trend = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      trend.push({
        date: d.toISOString().split('T')[0],
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: Math.round(9000 + Math.sin(i) * 3500 + Math.random() * 2000),
        cost: Math.round(5500 + Math.sin(i) * 2000),
        grossProfit: Math.round(3500 + Math.sin(i) * 1500),
        expenses: 1400,
        netProfit: Math.round(2100 + Math.sin(i) * 1500),
        ordersCount: Math.round(25 + Math.random() * 15),
      });
    }
    return Promise.resolve({
      status: 200,
      data: { success: true, data: { trend } },
    });
  }

  if (url.includes('/admin/analytics/top-products')) {
    const topProducts = FALLBACK_MEDICINES.slice(0, 5).map((m, idx) => ({
      id: m._id,
      name: m.name,
      brand: m.brand,
      totalQuantity: 240 - idx * 35,
      totalRevenue: (240 - idx * 35) * m.price,
      grossProfit: Math.round((240 - idx * 35) * m.price * 0.35),
    }));
    return Promise.resolve({
      status: 200,
      data: { success: true, data: { topProducts } },
    });
  }

  if (url.includes('/admin/medicines')) {
    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        data: {
          medicines: FALLBACK_MEDICINES,
          pagination: { total: FALLBACK_MEDICINES.length, page: 1, limit: 20, totalPages: 1 },
        },
      },
    });
  }

  if (url.includes('/admin/orders')) {
    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        data: {
          orders: [
            {
              _id: 'ord-adm-1',
              orderNumber: 'STM-99214',
              user: { name: 'Rahul Sharma', email: 'customer@example.com' },
              total: 340,
              grossProfit: 120,
              orderStatus: 'PENDING',
              paymentStatus: 'PAID',
              prescriptionRequired: true,
              createdAt: new Date().toISOString(),
            },
            {
              _id: 'ord-adm-2',
              orderNumber: 'STM-99180',
              user: { name: 'Ananya Verma', email: 'ananya@example.com' },
              total: 580,
              grossProfit: 210,
              orderStatus: 'PROCESSING',
              paymentStatus: 'PAID',
              prescriptionRequired: false,
              createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
            },
          ],
          pagination: { total: 2, page: 1, limit: 20, totalPages: 1 },
        },
      },
    });
  }

  if (url.includes('/admin/inventory')) {
    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        data: {
          inventory: FALLBACK_MEDICINES,
          summary: {
            totalItems: FALLBACK_MEDICINES.length,
            totalStockUnits: 1840,
            retailStockValuation: 248900,
            costStockValuation: 161785,
            lowStockCount: 2,
            outOfStockCount: 0,
          },
          history: [],
        },
      },
    });
  }

  if (url.includes('/admin/expenses')) {
    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        data: {
          expenses: [
            { _id: 'exp-1', title: 'Monthly Pharmacy Rent', category: 'RENT', amount: 25000, date: new Date().toISOString() },
            { _id: 'exp-2', title: 'Commercial Electricity Bill', category: 'ELECTRICITY', amount: 6500, date: new Date().toISOString() },
            { _id: 'exp-3', title: 'Courier Delivery Partner', category: 'COURIER', amount: 4800, date: new Date().toISOString() },
          ],
        },
      },
    });
  }

  if (url.includes('/admin/prescriptions')) {
    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        data: {
          prescriptions: [
            {
              _id: 'rx-rev-1',
              user: { name: 'Rahul Sharma', email: 'customer@example.com' },
              status: 'PENDING',
              fileUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500',
              createdAt: new Date().toISOString(),
            },
          ],
        },
      },
    });
  }

  if (url.includes('/admin/users')) {
    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        data: {
          users: [
            DEFAULT_CUSTOMER,
            { _id: 'usr-102', name: 'Ananya Verma', email: 'ananya@example.com', phone: '+919833445566', role: 'USER', isActive: true },
          ],
          pagination: { total: 2, page: 1, limit: 20, totalPages: 1 },
        },
      },
    });
  }

  // 18. Storefront Catalog: Categories
  if (url.includes('/medicines/categories')) {
    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        data: { categories: FALLBACK_CATEGORIES },
        message: 'Loaded from pharmacy catalog',
      },
    });
  }

  // 19. Storefront Catalog: Featured Medicines
  if (url.includes('/medicines/featured')) {
    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        data: { medicines: FALLBACK_MEDICINES },
        message: 'Loaded from pharmacy catalog',
      },
    });
  }

  // 20. Storefront Catalog: Single Medicine Detail
  const singleMatch = url.match(/\/medicines\/([a-zA-Z0-9_-]+)(?:\?|$)/);
  if (singleMatch && !url.includes('categories') && !url.includes('featured') && !url.includes('external')) {
    const medId = singleMatch[1];
    const med = FALLBACK_MEDICINES.find((m) => m._id === medId) || FALLBACK_MEDICINES[0];
    const relatedMedicines = FALLBACK_MEDICINES.filter((m) => m._id !== med._id).slice(0, 4);
    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        data: {
          medicine: med,
          relatedMedicines,
        },
        message: 'Loaded medicine detail',
      },
    });
  }

  // 21. Storefront Catalog: List & Filters
  if (url.includes('/medicines')) {
    const result = filterFallbackMedicines(url);
    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        data: result,
        message: 'Loaded from pharmacy catalog',
      },
    });
  }

  // 22. Health Check
  if (url.includes('/health')) {
    return Promise.resolve({
      status: 200,
      data: {
        status: 'online',
        timestamp: new Date().toISOString(),
        service: "St Mary's Pharmacy Client Engine",
      },
    });
  }

  return null;
};
