/**
 * Comprehensive 5000+ Pharmaceutical Medicine Catalog Generator
 * Generates clinically accurate, diverse medicines spanning all pharmacy departments.
 * Uses 100% genuine medical imagery (zero toys, zero vegetables, zero unrelated items).
 */

export const PHARMA_IMAGES = [
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80', // amber bottle with pills
  'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&auto=format&fit=crop&q=80', // blister pack
  'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=80', // capsules in glass bottle
  'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80', // antibiotic capsules
  'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=500&auto=format&fit=crop&q=80', // pharmacy dropper bottle
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&auto=format&fit=crop&q=80', // prescription medicine bottle
  'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=500&auto=format&fit=crop&q=80', // vitamin capsule container
  'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=500&auto=format&fit=crop&q=80', // dispenser bottle / antiseptic
  'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80', // clinical tablets
  'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500&auto=format&fit=crop&q=80', // medical dropper bottle
  'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=500&auto=format&fit=crop&q=80', // medicine tablets
  'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&auto=format&fit=crop&q=80', // pills blister strip
  'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=500&auto=format&fit=crop&q=80', // white pill bottles
];

const BRANDS = [
  'Sun Pharma',
  'Cipla',
  'Dr. Reddy\'s',
  'Abbott India',
  'Mankind Pharma',
  'Torrent Pharmaceuticals',
  'Alkem Laboratories',
  'Zydus Lifesciences',
  'GlaxoSmithKline (GSK)',
  'Sanofi India',
  'Micro Labs',
  'USV Ltd',
  'Glenmark Pharmaceuticals',
  'Intas Pharmaceuticals',
  'Ipca Laboratories',
  'Alembic Pharmaceuticals',
  'Macleods Pharmaceuticals',
  'Aristo Pharmaceuticals',
  'Hetero Healthcare',
  'Lupin Ltd'
];

const CATEGORY_BLUEPRINTS = {
  'pain-relief': {
    molecules: [
      { name: 'Paracetamol', brandBase: 'Dolo', forms: ['Tablet', 'Syrup', 'Drops'], strengths: ['500mg', '650mg', '120mg/5ml', '100mg/ml'], basePrice: 35, rx: false, uses: ['Fever', 'Headache', 'Body Pain', 'Mild Arthritis'] },
      { name: 'Ibuprofen + Paracetamol', brandBase: 'Combiflam', forms: ['Tablet', 'Syrup'], strengths: ['400mg/325mg', '100mg/162.5mg per 5ml'], basePrice: 48, rx: false, uses: ['Dental Pain', 'Muscular Aches', 'Sprains', 'Fever'] },
      { name: 'Aceclofenac + Paracetamol', brandBase: 'Zerodol-P', forms: ['Tablet'], strengths: ['100mg/325mg', '200mg/325mg SR'], basePrice: 72, rx: true, uses: ['Joint Inflammation', 'Osteoarthritis', 'Spondylitis', 'Post-Traumatic Pain'] },
      { name: 'Aceclofenac + Paracetamol + Serratiopeptidase', brandBase: 'Zerodol-SP', forms: ['Tablet'], strengths: ['100mg/325mg/15mg'], basePrice: 115, rx: true, uses: ['Severe Swelling', 'Post-Surgical Pain', 'Bone Trauma', 'Dental Extraction'] },
      { name: 'Diclofenac Diethylamine Gel', brandBase: 'Volini', forms: ['Gel', 'Spray'], strengths: ['1% w/w (30g)', '1% w/w (55g)', '55g Spray'], basePrice: 160, rx: false, uses: ['Back Pain', 'Neck Stiffness', 'Sports Sprains', 'Knee Pain'] },
      { name: 'Tramadol Hydrochloride', brandBase: 'Tramazac', forms: ['Capsule', 'Tablet', 'Injection'], strengths: ['50mg', '100mg SR', '50mg/ml'], basePrice: 140, rx: true, uses: ['Moderate to Severe Pain', 'Post-Operative Analgesia', 'Trauma Pain'] },
      { name: 'Etoricoxib', brandBase: 'Nucoxia', forms: ['Tablet'], strengths: ['60mg', '90mg', '120mg'], basePrice: 130, rx: true, uses: ['Rheumatoid Arthritis', 'Acute Gout', 'Ankylosing Spondylitis'] },
      { name: 'Mefenamic Acid + Dicyclomine', brandBase: 'Meftal-Spas', forms: ['Tablet', 'Syrup'], strengths: ['250mg/10mg', '500mg/20mg', '10mg/5ml'], basePrice: 55, rx: true, uses: ['Spasmodic Dysmenorrhea', 'Abdominal Colic', 'Intestinal Spasms'] },
      { name: 'Ketorolac Tromethamine', brandBase: 'Ketorol', forms: ['Dispersible Tablet', 'Eye Drops'], strengths: ['10mg', '0.5% w/v'], basePrice: 85, rx: true, uses: ['Acute Post-Operative Pain', 'Severe Toothache', 'Ocular Inflammation'] },
      { name: 'Naproxen', brandBase: 'Naprosyn', forms: ['Tablet'], strengths: ['250mg', '500mg'], basePrice: 65, rx: true, uses: ['Migraine Headache', 'Tendonitis', 'Bursitis', 'Dysmenorrhea'] },
      { name: 'Thiocolchicoside + Aceclofenac', brandBase: 'Hifenac-TH', forms: ['Tablet'], strengths: ['4mg/100mg', '8mg/100mg'], basePrice: 195, rx: true, uses: ['Acute Muscle Spasms', 'Lumbago', 'Sciatica', 'Cervical Spondylosis'] },
      { name: 'Trypsin + Chymotrypsin', brandBase: 'Chymoral Forte', forms: ['Tablet'], strengths: ['100,000 AU'], basePrice: 420, rx: true, uses: ['Edema Resolution', 'Post-Surgical Swelling', 'Hematoma Absorption'] },
    ],
  },
  'cold-and-flu': {
    molecules: [
      { name: 'Cetirizine Hydrochloride', brandBase: 'Cetzine', forms: ['Tablet', 'Syrup'], strengths: ['10mg', '5mg/5ml'], basePrice: 42, rx: false, uses: ['Allergic Rhinitis', 'Urticaria', 'Runny Nose', 'Watery Eyes'] },
      { name: 'Levocetirizine + Montelukast', brandBase: 'Montair-LC', forms: ['Tablet', 'Kid Syrup', 'Dispersible Tablet'], strengths: ['5mg/10mg', '2.5mg/4mg'], basePrice: 180, rx: true, uses: ['Allergic Bronchial Asthma', 'Seasonal Hay Fever', 'Nocturnal Cough'] },
      { name: 'Fexofenadine Hydrochloride', brandBase: 'Allegra', forms: ['Tablet', 'Suspension'], strengths: ['120mg', '180mg', '30mg/5ml'], basePrice: 195, rx: false, uses: ['Chronic Idiopathic Urticaria', 'Severe Pollen Allergy', 'Allergic Sneezing'] },
      { name: 'Amoxicillin + Clavulanic Acid', brandBase: 'Augmentin', forms: ['Tablet', 'Dry Syrup', 'Injection'], strengths: ['625 Duo', '1000mg', '228.5mg/5ml'], basePrice: 220, rx: true, uses: ['Lower Respiratory Infections', 'Sinusitis', 'Otitis Media', 'Tonsillitis'] },
      { name: 'Azithromycin', brandBase: 'Azithral', forms: ['Tablet', 'Liquid Suspension'], strengths: ['250mg', '500mg', '100mg/5ml', '200mg/5ml'], basePrice: 135, rx: true, uses: ['Pharyngitis', 'Pneumonia', 'Skin Structure Infections', 'Chlamydia'] },
      { name: 'Cough Formula Dextromethorphan + CPM', brandBase: 'Benadryl DR', forms: ['Syrup'], strengths: ['100ml', '150ml'], basePrice: 125, rx: false, uses: ['Dry Hacking Cough', 'Throat Tickle', 'Nocturnal Cough Paroxysms'] },
      { name: 'Ambroxol + Levosalbutamol + Guaifenesin', brandBase: 'Ascoril-LS', forms: ['Syrup', 'Drops'], strengths: ['100ml', '15ml Pediatric'], basePrice: 118, rx: true, uses: ['Productive Wet Cough', 'Bronchial Mucus Congestion', 'Bronchitis with Wheezing'] },
      { name: 'Cefixime Trihydrate', brandBase: 'Taxim-O', forms: ['Tablet', 'Dry Syrup'], strengths: ['100mg DT', '200mg', '50mg/5ml'], basePrice: 165, rx: true, uses: ['Typhoid Fever', 'Urinary Tract Infections', 'Bronchitis', 'Gonococcal Infections'] },
      { name: 'Budesonide + Formoterol Fumarate', brandBase: 'Foracort', forms: ['Inhaler', 'Rotacaps', 'Respules'], strengths: ['100mcg', '200mcg', '400mcg'], basePrice: 480, rx: true, uses: ['Asthma Maintenance', 'Chronic Obstructive Pulmonary Disease (COPD)', 'Bronchospasm'] },
      { name: 'Salbutamol Sulfate (Albuterol)', brandBase: 'Asthalin', forms: ['Inhaler', 'Syrup', 'Respules'], strengths: ['100mcg (200 MDI)', '2mg/5ml', '2.5mg/2.5ml'], basePrice: 145, rx: true, uses: ['Acute Asthmatic Attack', 'Exercise-Induced Bronchospasm', 'Wheezing Distress'] },
      { name: 'Xylometazoline Nasal Drops', brandBase: 'Otrivin Adult', forms: ['Nasal Drops', 'Nasal Spray'], strengths: ['0.1% w/v (10ml)', '0.05% Pediatric'], basePrice: 95, rx: false, uses: ['Nasal Blockage', 'Sinus Congestion', 'Eustachian Tube Block'] },
      { name: 'Strepsils Antibacterial Lozenges', brandBase: 'Strepsils', forms: ['Lozenges'], strengths: ['Honey & Lemon (Box of 24)', 'Ginger (Box of 24)'], basePrice: 65, rx: false, uses: ['Sore Throat', 'Pharyngeal Irritation', 'Hoarseness of Voice'] },
    ],
  },
  'vitamins': {
    molecules: [
      { name: 'Cholecalciferol (Vitamin D3)', brandBase: 'Uprise-D3', forms: ['Softgel Capsule', 'Oral Drops', 'Granules Sachet'], strengths: ['60,000 IU', '400 IU/ml', '60,000 IU Sachet'], basePrice: 120, rx: false, uses: ['Vitamin D Deficiency', 'Osteoporosis', 'Bone Density Support', 'Immune Modulation'] },
      { name: 'Calcium Carbonate + Vitamin D3', brandBase: 'Shelcal 500', forms: ['Tablet', 'Syrup'], strengths: ['500mg/250IU', '250mg/125IU'], basePrice: 130, rx: false, uses: ['Calcium Deficiency', 'Post-Menopausal Osteopenia', 'Pregnancy Nutrition'] },
      { name: 'Vitamin B-Complex with B12 & Zinc', brandBase: 'Becosules Z', forms: ['Capsule', 'Syrup'], strengths: ['Standard Formula', '200ml Syrup'], basePrice: 52, rx: false, uses: ['Mouth Ulcers', 'Nutritional Convalescence', 'Stamina', 'Nerve Vitality'] },
      { name: 'Ascorbic Acid (Vitamin C Chewable)', brandBase: 'Limcee', forms: ['Chewable Tablet'], strengths: ['500mg (15 Tablets)'], basePrice: 28, rx: false, uses: ['Immunity Booster', 'Collagen Synthesis', 'Antioxidant Defense', 'Wound Healing'] },
      { name: 'Methylcobalamin (Active Vitamin B12)', brandBase: 'Nurokind-Plus', forms: ['Capsule', 'Tablet', 'Injection'], strengths: ['1500mcg', '500mcg', '1000mcg/ml'], basePrice: 165, rx: false, uses: ['Diabetic Neuropathy', 'Peripheral Nerve Degeneration', 'Pernicious Anemia'] },
      { name: 'Omega-3 Fish Oil (EPA & DHA)', brandBase: 'Maxirich Omega', forms: ['Softgel Capsule'], strengths: ['1000mg (30 Softgels)', '1000mg (60 Softgels)'], basePrice: 450, rx: false, uses: ['Cardiovascular Health', 'Triglyceride Balance', 'Brain Function', 'Joint Lubrication'] },
      { name: 'Ferrous Ascorbate + Folic Acid', brandBase: 'Orofer-XT', forms: ['Tablet', 'Syrup'], strengths: ['100mg/1.5mg', '30mg/550mcg per 5ml'], basePrice: 175, rx: false, uses: ['Iron Deficiency Anemia', 'Pregnancy Hemoglobin Support', 'Fatigue Relief'] },
      { name: 'Biotin + Zinc + Amino Acids', brandBase: 'Keraglo-Men', forms: ['Tablet'], strengths: ['10,000mcg Daily'], basePrice: 580, rx: false, uses: ['Hair Fall Control', 'Nail Brittleness', 'Follicle Rejuvenation'] },
      { name: 'Coenzyme Q10 + Lycopene', brandBase: 'CoQ Forte', forms: ['Capsule'], strengths: ['100mg', '300mg'], basePrice: 850, rx: false, uses: ['Cellular Mitochondrial Energy', 'Heart Muscle Strength', 'Male Fertility'] },
      { name: 'Vitamin E (Tocopheryl Acetate)', brandBase: 'Evion', forms: ['Softgel Capsule'], strengths: ['200mg', '400mg', '600mg'], basePrice: 42, rx: false, uses: ['Antioxidant Protection', 'Skin Elasticity', 'Muscle Cramps', 'Lipid Peroxidation'] },
    ],
  },
  'diabetes-care': {
    molecules: [
      { name: 'Metformin Hydrochloride', brandBase: 'Glycomet', forms: ['Tablet', 'Extended Release Tablet'], strengths: ['500mg', '850mg', '1000mg SR'], basePrice: 45, rx: true, uses: ['Type 2 Diabetes Mellitus', 'Insulin Resistance', 'PCOS Weight Management'] },
      { name: 'Glimepiride + Metformin', brandBase: 'Glycomet-GP', forms: ['Tablet', 'Forte Tablet'], strengths: ['1mg/500mg', '2mg/500mg', '1mg/1000mg SR', '2mg/1000mg SR'], basePrice: 110, rx: true, uses: ['Uncontrolled Hyperglycemia', 'Dual Mechanism Glycemic Control'] },
      { name: 'Voglibose', brandBase: 'Volibo', forms: ['Tablet', 'Mouth Dissolving'], strengths: ['0.2mg', '0.3mg'], basePrice: 95, rx: true, uses: ['Postprandial Hyperglycemia Spike Reduction', 'Intestinal Alpha-Glucosidase Inhibition'] },
      { name: 'Teneligliptin Hydrobromide', brandBase: 'Tenepure', forms: ['Tablet'], strengths: ['20mg'], basePrice: 120, rx: true, uses: ['DPP-4 Inhibitor Glucose Regulation', 'Renal Impairment Diabetes'] },
      { name: 'Dapagliflozin Propanediol', brandBase: 'Forxiga', forms: ['Tablet'], strengths: ['5mg', '10mg'], basePrice: 420, rx: true, uses: ['SGLT2 Urinary Glucose Excretion', 'Heart Failure Protection', 'Chronic Kidney Protection'] },
      { name: 'Biphasic Isophane Human Insulin', brandBase: 'Human Mixtard 30/70', forms: ['Cartridge Penfill', 'Vial 10ml'], strengths: ['100 IU/ml (3ml)', '100 IU/ml (10ml)'], basePrice: 190, rx: true, uses: ['Insulin Dependent Diabetes', 'Gestational Diabetes', 'Intensive Glycemic Therapy'] },
      { name: 'Insulin Glargine (Long Acting Basal)', brandBase: 'Lantus SoloStar', forms: ['Pre-filled Disposable Pen', 'Vial'], strengths: ['100 units/ml (3ml)', '100 units/ml (10ml)'], basePrice: 750, rx: true, uses: ['24-Hour Peakless Basal Insulin', 'Type 1 & Advanced Type 2 Diabetes'] },
      { name: 'Blood Glucose Test Strips 50s', brandBase: 'Accu-Chek Active', forms: ['Test Strips'], strengths: ['50 Strips Pack'], basePrice: 990, rx: false, uses: ['Self-Blood Glucose Monitoring', 'Hypoglycemia Detection', 'HbA1c Tracking'] },
      { name: 'Sterile Blood Lancets 30G', brandBase: 'OneTouch Delica', forms: ['Lancets'], strengths: ['100 Sterile Lancets'], basePrice: 280, rx: false, uses: ['Virtually Painless Capillary Fingerprick Sampling'] },
      { name: 'Thyroxine Sodium', brandBase: 'Thyronorm', forms: ['Tablet'], strengths: ['25mcg', '50mcg', '75mcg', '88mcg', '100mcg', '125mcg'], basePrice: 145, rx: true, uses: ['Hypothyroidism', 'Goiter Suppression', 'Post-Thyroidectomy Hormone Replacement'] },
    ],
  },
  'skin-care': {
    molecules: [
      { name: 'Betamethasone + Neomycin', brandBase: 'Betnovate-N', forms: ['Cream', 'Ointment'], strengths: ['20g Tube', '50g Tube'], basePrice: 65, rx: true, uses: ['Infected Dermatoses', 'Eczema Flare-ups', 'Psoriatic Inflammation'] },
      { name: 'Clotrimazole 1% Topical', brandBase: 'Candid', forms: ['Cream', 'Dusting Powder', 'Lotion'], strengths: ['30g Cream', '100g Powder', '50ml Lotion'], basePrice: 110, rx: false, uses: ['Tinea Pedis (Athlete\'s Foot)', 'Ringworm', 'Prickly Heat', 'Candidiasis'] },
      { name: 'Luliconazole 1% w/w', brandBase: 'Lulifin', forms: ['Cream', 'Lotion'], strengths: ['10g', '20g', '30g', '50g'], basePrice: 280, rx: true, uses: ['Stubborn Dermatophytosis', 'Jock Itch', 'Tinea Corporis'] },
      { name: 'Mupirocin 2% w/w Ointment', brandBase: 'T-Bact', forms: ['Ointment'], strengths: ['5g', '15g'], basePrice: 135, rx: true, uses: ['Bacterial Impetigo', 'Infected Folliculitis', 'Superficial Skin Lesions'] },
      { name: 'Framycetin Sulfate 1%', brandBase: 'Soframycin', forms: ['Skin Cream'], strengths: ['30g Tube', '100g Jar'], basePrice: 58, rx: false, uses: ['Superficial Burns', 'Wound Disinfection', 'Abrasions & Scrapes'] },
      { name: 'Permethrin 5% w/w', brandBase: 'Scaboma', forms: ['Lotion', 'Medicated Soap'], strengths: ['100ml Lotion', '75g Bar'], basePrice: 115, rx: false, uses: ['Scabies Infestation', 'Crusted Itch Mites', 'Body Lice Eradication'] },
      { name: 'Adapalene + Benzoyl Peroxide', brandBase: 'Deriva-BPO', forms: ['Gel'], strengths: ['15g Tube', '30g Tube'], basePrice: 295, rx: true, uses: ['Comedonal & Inflammatory Acne Vulgaris', 'Blackheads & Pores'] },
      { name: 'Calamine + Diphenhydramine', brandBase: 'Caladryl', forms: ['Lotion'], strengths: ['120ml Bottle'], basePrice: 110, rx: false, uses: ['Insect Bites', 'Sunburn Soothing', 'Prickly Heat Relief', 'Poison Ivy Itch'] },
      { name: 'Salicylic Acid 6% Ointment', brandBase: 'Salicylix SF', forms: ['Ointment'], strengths: ['30g Tube', '50g Tube'], basePrice: 140, rx: false, uses: ['Keratolytic Calluses', 'Rough Cracked Heels', 'Scalp Psoriasis Flakes'] },
      { name: 'Gentle Skin Cleanser', brandBase: 'Cetaphil Hydrate', forms: ['Lotion / Wash'], strengths: ['125ml', '250ml', '500ml Pump'], basePrice: 340, rx: false, uses: ['Sensitive Facial Cleansing', 'Dermatitis Soap Alternative', 'Dry Skin Moisture'] },
    ],
  },
  'baby-care': {
    molecules: [
      { name: 'Pediatric Paracetamol Drops', brandBase: 'Calpol Infant', forms: ['Oral Drops'], strengths: ['100mg/ml (15ml)'], basePrice: 40, rx: false, uses: ['Infant Fever Reduction', 'Post-Immunization Soreness', 'Teething Pain'] },
      { name: 'Simethicone + Dill Oil + Fennel Oil', brandBase: 'Colimex Infant', forms: ['Oral Drops'], strengths: ['15ml with Calibrated Dropper'], basePrice: 75, rx: false, uses: ['Infant Flatulence', 'Gripe Colic Pain', 'Tummy Distension'] },
      { name: 'Oral Rehydration Salts (WHO Formula)', brandBase: 'Electral Baby Safe', forms: ['Powder Sachet', 'Ready to Drink Liquid'], strengths: ['21.8g Sachet', '200ml Tetrapack'], basePrice: 22, rx: false, uses: ['Pediatric Dehydration', 'Diarrhea Electrolyte Loss', 'Summer Heat Stroke'] },
      { name: 'Zinc Oxide Diaper Rash Cream', brandBase: 'Sebamed Diaper Guard', forms: ['Cream'], strengths: ['50g Tube', '100g Tube'], basePrice: 320, rx: false, uses: ['Diaper Erythema', 'Chafing Barrier', 'Urine Dampness Protection'] },
      { name: 'Saline Pediatric Nasal Spray', brandBase: 'Nasoclear Baby', forms: ['Nasal Mist Drops'], strengths: ['20ml Bottle'], basePrice: 85, rx: false, uses: ['Blocked Infant Stuffy Nose', 'Crust Softening', 'Gentle Aspiration'] },
      { name: 'Pediatric Vitamin D3 Drops', brandBase: 'D3 Must Baby', forms: ['Oral Drops'], strengths: ['400 IU/ml (30ml)'], basePrice: 110, rx: false, uses: ['Rickets Prevention', 'Skeletal Ossification', 'Infant Growth Milestone'] },
      { name: 'Baby Cleansing Wash & Shampoo', brandBase: 'Himalaya Gentle Baby', forms: ['Wash'], strengths: ['200ml', '400ml Bottle'], basePrice: 190, rx: false, uses: ['Tear-Free Baby Bathing', 'Cradle Cap Cleansing', 'Hypoallergenic Scalp Care'] },
      { name: 'Pediatric Ondansetron Oral Solution', brandBase: 'Vomikind Infant', forms: ['Oral Drops'], strengths: ['2mg/5ml (30ml)'], basePrice: 48, rx: true, uses: ['Pediatric Gastroenteritis Emesis', 'Persistent Nausea in Toddlers'] },
    ],
  },
  'first-aid': {
    molecules: [
      { name: 'Povidone Iodine 10% Antiseptic', brandBase: 'Betadine', forms: ['Solution', 'Ointment', 'Gargle'], strengths: ['100ml Solution', '20g Ointment', '50ml Gargle'], basePrice: 120, rx: false, uses: ['Wound Disinfection', 'Surgical Site Prep', 'Minor Abrasion Microbicide'] },
      { name: 'Aminacrine + Cetrimide Burn Care', brandBase: 'Burnol', forms: ['Ointment'], strengths: ['20g Tube', '50g Tube'], basePrice: 75, rx: false, uses: ['First Degree Burns', 'Kitchen Scalds', 'Superficial Blister Soothing'] },
      { name: 'Waterproof Medicated Plasters', brandBase: 'Hansaplast', forms: ['Strips'], strengths: ['Pack of 20 Plasters', 'Pack of 50 Plasters'], basePrice: 85, rx: false, uses: ['Papercuts', 'Scraped Knees', 'Blister Protection', 'Dirt Barrier'] },
      { name: 'Microporous Surgical Paper Tape', brandBase: '3M Micropore', forms: ['Tape Roll'], strengths: ['1 inch x 9m', '2 inch x 9m'], basePrice: 95, rx: false, uses: ['Gauze Pad Adhesion', 'Catheter Securing', 'Sensitive Skin Bandaging'] },
      { name: 'Sterile Cotton Gauze Swabs', brandBase: 'Dutex Surgical', forms: ['Gauze Pack'], strengths: ['7.5cm x 7.5cm (Pack of 10)'], basePrice: 60, rx: false, uses: ['Wound Exudate Packing', 'Sterile Hemostasis Pressure', 'Post-Op Dressing'] },
      { name: 'Elastic Crepe Bandage', brandBase: 'Dynaplast', forms: ['Roller Bandage'], strengths: ['6cm x 4m', '8cm x 4m', '10cm x 4m'], basePrice: 180, rx: false, uses: ['Joint Sprain Compression', 'Varicose Vein Support', 'Ligament Strain Relief'] },
      { name: 'Hydrogen Peroxide 3% Topical', brandBase: 'Apollo FirstAid H2O2', forms: ['Solution'], strengths: ['100ml Bottle', '400ml Bottle'], basePrice: 45, rx: false, uses: ['Deep Slough Cleaning', 'Debridement Effervescence', 'Earwax Dissolution'] },
      { name: 'Instant Ice / Hot Reusable Gel Pack', brandBase: 'Flamingo CoolPack', forms: ['Gel Pack'], strengths: ['Medium (15x20cm)', 'Large (20x30cm)'], basePrice: 240, rx: false, uses: ['Acute Sports Contusion', 'Swelling Cryotherapy', 'Muscle Stiffness Heat Therapy'] },
    ],
  },
  'personal-care': {
    molecules: [
      { name: 'Chlorhexidine Digluconate 0.2%', brandBase: 'Hexidine Mouthwash', forms: ['Mouthwash Solution'], strengths: ['150ml Bottle', '250ml Bottle'], basePrice: 130, rx: false, uses: ['Gingivitis', 'Dental Plaque Anti-bacterial', 'Post-Periodontal Surgery'] },
      { name: 'Antacid Gel Magaldrate + Simethicone', brandBase: 'Digene', forms: ['Oral Gel Suspension'], strengths: ['200ml Mint', '450ml Orange'], basePrice: 145, rx: false, uses: ['Heartburn', 'Acid Indigestion', 'Hyperacidity Gastric Belching'] },
      { name: 'Pantoprazole Sodium 40mg', brandBase: 'Pan 40', forms: ['Tablet', 'Injection'], strengths: ['40mg', '40mg IV Vial'], basePrice: 110, rx: true, uses: ['Gastroesophageal Reflux Disease (GERD)', 'Zollinger-Ellison Syndrome', 'Peptic Ulcers'] },
      { name: 'Rabeprazole + Domperidone SR', brandBase: 'Rablet-D', forms: ['Capsule'], strengths: ['20mg/30mg SR'], basePrice: 165, rx: true, uses: ['Acid Reflux with Nausea', 'Erosive Esophagitis', 'Gastric Dysmotility'] },
      { name: 'Lactulose Oral Solution USP', brandBase: 'Duphalac', forms: ['Syrup'], strengths: ['150ml Bottle', '250ml Bottle'], basePrice: 280, rx: false, uses: ['Chronic Constipation Osmotic Laxative', 'Hepatic Encephalopathy'] },
      { name: 'Instant Alcohol Hand Sanitizer 70%', brandBase: 'Dettol Instant', forms: ['Gel', 'Liquid Refill'], strengths: ['50ml Pocket', '200ml Pump', '500ml Hospital Refill'], basePrice: 55, rx: false, uses: ['99.9% Microbial Germ Kill', 'Rinse-Free Hand Asepsis'] },
      { name: 'Potassium Nitrate Desensitizing Toothpaste', brandBase: 'Sensodyne Rapid', forms: ['Dental Paste'], strengths: ['80g Tube', '150g Value Pack'], basePrice: 190, rx: false, uses: ['Dentin Hypersensitivity', 'Cold/Hot Temperature Tooth Shock'] },
      { name: 'Isabgol Natural Husk (Psyllium)', brandBase: 'Fybogel Nature', forms: ['Powder Effervescent'], strengths: ['100g Jar', '200g Jar'], basePrice: 180, rx: false, uses: ['Gentle Soluble Fiber Bowel Regularity', 'Cholesterol Support'] },
      { name: 'Loperamide Hydrochloride', brandBase: 'Imodium', forms: ['Capsule', 'Tablet'], strengths: ['2mg'], basePrice: 35, rx: false, uses: ['Acute Non-Specific Diarrhea Motility Control', 'Traveler\'s Diarrhea'] },
      { name: 'Multienzyme Digestive Tonic', brandBase: 'Aristozyme', forms: ['Liquid Syrup', 'Capsule'], strengths: ['200ml Bottle', 'Strip of 15'], basePrice: 125, rx: false, uses: ['Proteolytic & Amylolytic Digestion Support', 'Fullness After Meals'] },
    ],
  },
};

/**
 * Generate 5,200+ distinct medicines with realistic data.
 * @param {Object} categoryMap - Map of category slug to Mongoose Category document
 * @returns {Array} Array of 5,200+ medicine objects
 */
export const generateMedicinesCatalog = (categoryMap) => {
  const medicines = [];
  const targetPerCategory = 650; // 8 categories * 650 = 5,200 medicines!
  let imageCounter = 0;

  for (const [catSlug, blueprint] of Object.entries(CATEGORY_BLUEPRINTS)) {
    const categoryDoc = categoryMap[catSlug];
    if (!categoryDoc) continue;

    let categoryCount = 0;

    // Outer loop through molecules
    for (let mIdx = 0; categoryCount < targetPerCategory; mIdx++) {
      const mol = blueprint.molecules[mIdx % blueprint.molecules.length];
      const brand = BRANDS[categoryCount % BRANDS.length];
      const form = mol.forms[categoryCount % mol.forms.length];
      const strength = mol.strengths[categoryCount % mol.strengths.length];

      // Formulate unique commercial medicine name
      const modifier = Math.floor(categoryCount / (blueprint.molecules.length * BRANDS.length));
      const suffix = modifier > 0 ? ` Gen-${modifier + 1}` : '';
      const commercialName = `${mol.brandBase} ${strength} ${form}${suffix}`;

      // Calculate realistic pharmaceutical pricing
      // Base price variation based on strength and modifier
      const variance = 1 + ((categoryCount % 17) - 8) * 0.03; // +/- 24%
      const calculatedPrice = Math.max(18, Math.round(mol.basePrice * variance));
      const costMargin = 0.58 + ((categoryCount % 7) * 0.02); // 58% - 70% cost
      const costPrice = Math.max(10, Math.round(calculatedPrice * costMargin));
      const discountOptions = [0, 0, 5, 5, 10, 10, 12, 15, 20];
      const discount = discountOptions[categoryCount % discountOptions.length];

      // Stock variation (realistic inventory levels)
      let stock = 30 + ((categoryCount * 13) % 220);
      let lowStockThreshold = 15;
      if (categoryCount % 23 === 0) {
        stock = 4; // Low stock trigger
        lowStockThreshold = 10;
      } else if (categoryCount % 71 === 0) {
        stock = 0; // Out of stock trigger
      }

      // Pack size description based on form
      let packSize = '10 Tablets';
      if (form.includes('Syrup') || form.includes('Suspension') || form.includes('Wash') || form.includes('Solution') || form.includes('Lotion')) {
        packSize = form.includes('Drops') ? '15ml Dropper Bottle' : '100ml Bottle';
      } else if (form.includes('Capsule')) {
        packSize = '10 Capsules';
      } else if (form.includes('Ointment') || form.includes('Cream') || form.includes('Gel')) {
        packSize = '30g Tube';
      } else if (form.includes('Spray') || form.includes('Inhaler')) {
        packSize = '1 Device';
      } else if (form.includes('Strip') || form.includes('Plasters')) {
        packSize = 'Pack of 20';
      }

      // Pick next clean pharma image
      const image = PHARMA_IMAGES[imageCounter % PHARMA_IMAGES.length];
      imageCounter++;

      medicines.push({
        name: commercialName,
        genericName: mol.name,
        brand: brand,
        category: categoryDoc._id,
        description: `Pharmaceutical-grade ${mol.name} formulation by ${brand}. Indicated for ${mol.uses.slice(0, 2).join(', ')}. Manufactured under strict GMP standards and tested for molecular stability and bioavailability.`,
        uses: mol.uses,
        price: calculatedPrice,
        costPrice: costPrice,
        discount: discount,
        stock: stock,
        lowStockThreshold: lowStockThreshold,
        prescriptionRequired: mol.rx,
        dosageForm: form,
        strength: strength,
        packSize: packSize,
        image: image,
        isActive: true,
      });

      categoryCount++;
    }
  }

  return medicines;
};
