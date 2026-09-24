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
 * Main fallback request handler for client API interceptor
 */
export const handleFallbackRequest = (config) => {
  if (!config || !config.url) return null;
  const url = config.url;

  // 1. Categories
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

  // 2. Featured Medicines (Deals & Trending)
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

  // 3. Single Medicine Detail
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

  // 4. Catalog List & Filters
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

  // 5. Health Check
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
