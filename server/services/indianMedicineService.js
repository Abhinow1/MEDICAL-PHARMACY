/**
 * Indian Medicine Directory & Composition API Service
 * Provides Indian pharmaceutical database lookup, active salt analysis,
 * generic substitute matching, and price comparison across Indian brands.
 */

// Curated comprehensive Indian Medicine Index with composition, manufacturers, and indicative MRPs (INR)
export const INDIAN_DRUG_INDEX = [
  // Analgesics & Antipyretics
  {
    brandName: 'Dolo 650 Tablet',
    genericComposition: 'Paracetamol (650mg)',
    manufacturer: 'Micro Labs Ltd',
    packSize: '15 Tablets',
    mrp: 33.60,
    dosageForm: 'Tablet',
    therapeuticClass: 'Analgesics / Antipyretic',
    prescriptionRequired: false,
    schedule: 'OTC',
    substitutes: ['Calpol 650', 'Crocin 650', 'Pacimol 650', 'P-650', 'Pyrigesic 650']
  },
  {
    brandName: 'Calpol 650mg Tablet',
    genericComposition: 'Paracetamol (650mg)',
    manufacturer: 'GlaxoSmithKline Pharmaceuticals (GSK)',
    packSize: '15 Tablets',
    mrp: 32.50,
    dosageForm: 'Tablet',
    therapeuticClass: 'Analgesics / Antipyretic',
    prescriptionRequired: false,
    schedule: 'OTC',
    substitutes: ['Dolo 650', 'Crocin 650', 'Paracip 650']
  },
  {
    brandName: 'Crocin 650 Advance Tablet',
    genericComposition: 'Paracetamol (650mg) with Optizorb Technology',
    manufacturer: 'Haleon India / GSK',
    packSize: '15 Tablets',
    mrp: 34.00,
    dosageForm: 'Tablet',
    therapeuticClass: 'Analgesics / Antipyretic',
    prescriptionRequired: false,
    schedule: 'OTC',
    substitutes: ['Dolo 650', 'Calpol 650', 'P-650']
  },
  {
    brandName: 'Combiflam Tablet',
    genericComposition: 'Ibuprofen (400mg) + Paracetamol (325mg)',
    manufacturer: 'Sanofi India Ltd',
    packSize: '20 Tablets',
    mrp: 46.80,
    dosageForm: 'Tablet',
    therapeuticClass: 'NSAID / Analgesic',
    prescriptionRequired: false,
    schedule: 'Schedule H',
    substitutes: ['Ibugesic Plus', 'Brufen Plus', 'Flexon']
  },
  {
    brandName: 'Zerodol-SP Tablet',
    genericComposition: 'Aceclofenac (100mg) + Paracetamol (325mg) + Serratiopeptidase (15mg)',
    manufacturer: 'Ipca Laboratories Ltd',
    packSize: '10 Tablets',
    mrp: 118.00,
    dosageForm: 'Tablet',
    therapeuticClass: 'Anti-inflammatory / Proteolytic Enzyme',
    prescriptionRequired: true,
    schedule: 'Schedule H',
    substitutes: ['Hifenac-SP', 'Signoflam', 'Aceclo-SP', 'Aldigesic-SP']
  },
  {
    brandName: 'Meftal-Spas Tablet',
    genericComposition: 'Mefenamic Acid (250mg) + Dicyclomine Hydrochloride (10mg)',
    manufacturer: 'Blue Cross Laboratories Ltd',
    packSize: '10 Tablets',
    mrp: 54.00,
    dosageForm: 'Tablet',
    therapeuticClass: 'Antispasmodic / Analgesic',
    prescriptionRequired: true,
    schedule: 'Schedule H',
    substitutes: ['Colimex', 'Spasmonil', 'Cyclopam']
  },

  // Antibiotics & Antimicrobials
  {
    brandName: 'Augmentin 625 Duo Tablet',
    genericComposition: 'Amoxicillin (500mg) + Clavulanic Acid (125mg)',
    manufacturer: 'GlaxoSmithKline Pharmaceuticals (GSK)',
    packSize: '10 Tablets',
    mrp: 223.50,
    dosageForm: 'Tablet',
    therapeuticClass: 'Broad-Spectrum Penicillin Antibiotic',
    prescriptionRequired: true,
    schedule: 'Schedule H1',
    substitutes: ['Moxikind-CV 625', 'Clavam 625', 'Advent 625', 'Mega-CV 625']
  },
  {
    brandName: 'Moxikind-CV 625 Tablet',
    genericComposition: 'Amoxicillin (500mg) + Clavulanic Acid (125mg)',
    manufacturer: 'Mankind Pharma Ltd',
    packSize: '10 Tablets',
    mrp: 178.00,
    dosageForm: 'Tablet',
    therapeuticClass: 'Broad-Spectrum Penicillin Antibiotic',
    prescriptionRequired: true,
    schedule: 'Schedule H1',
    substitutes: ['Augmentin 625 Duo', 'Clavam 625', 'Sensiclav 625']
  },
  {
    brandName: 'Azithral 500 Tablet',
    genericComposition: 'Azithromycin (500mg)',
    manufacturer: 'Alembic Pharmaceuticals Ltd',
    packSize: '5 Tablets',
    mrp: 132.00,
    dosageForm: 'Tablet',
    therapeuticClass: 'Macrolide Antibiotic',
    prescriptionRequired: true,
    schedule: 'Schedule H1',
    substitutes: ['Azee 500', 'Zithrox 500', 'Azax 500', 'ATM 500']
  },
  {
    brandName: 'Taxim-O 200 Tablet',
    genericComposition: 'Cefixime (200mg)',
    manufacturer: 'Alkem Laboratories Ltd',
    packSize: '10 Tablets',
    mrp: 172.00,
    dosageForm: 'Tablet',
    therapeuticClass: 'Cephalosporin Antibiotic',
    prescriptionRequired: true,
    schedule: 'Schedule H1',
    substitutes: ['Zifi 200', 'Mahacef 200', 'Cefolac 200', 'Omnicef-O']
  },
  {
    brandName: 'Cifran 500 Tablet',
    genericComposition: 'Ciprofloxacin (500mg)',
    manufacturer: 'Sun Pharmaceutical Industries Ltd',
    packSize: '10 Tablets',
    mrp: 45.50,
    dosageForm: 'Tablet',
    therapeuticClass: 'Fluoroquinolone Antibiotic',
    prescriptionRequired: true,
    schedule: 'Schedule H1',
    substitutes: ['Ciplox 500', 'Alcipro 500', 'Ciprobid 500']
  },

  // Gastrointestinal & Antacids
  {
    brandName: 'Pan 40 Tablet',
    genericComposition: 'Pantoprazole Sodium (40mg)',
    manufacturer: 'Alkem Laboratories Ltd',
    packSize: '15 Tablets',
    mrp: 155.00,
    dosageForm: 'Enteric Coated Tablet',
    therapeuticClass: 'Proton Pump Inhibitor (PPI)',
    prescriptionRequired: true,
    schedule: 'Schedule H',
    substitutes: ['Pantocid 40', 'Pantodac 40', 'Penta 40']
  },
  {
    brandName: 'Pan-D Capsule',
    genericComposition: 'Pantoprazole (40mg) + Domperidone (30mg SR)',
    manufacturer: 'Alkem Laboratories Ltd',
    packSize: '15 Capsules',
    mrp: 215.00,
    dosageForm: 'Sustained Release Capsule',
    therapeuticClass: 'Gastroprokinetic & PPI',
    prescriptionRequired: true,
    schedule: 'Schedule H',
    substitutes: ['Pantocid-DSR', 'Dompan-SR', 'Penta-DSR']
  },
  {
    brandName: 'Omez 20 Capsule',
    genericComposition: 'Omeprazole (20mg)',
    manufacturer: 'Dr. Reddy\'s Laboratories Ltd',
    packSize: '20 Capsules',
    mrp: 68.00,
    dosageForm: 'Capsule with Pellets',
    therapeuticClass: 'Proton Pump Inhibitor (PPI)',
    prescriptionRequired: false,
    schedule: 'Schedule H',
    substitutes: ['Ocid 20', 'Omecip 20', 'Procept 20']
  },
  {
    brandName: 'Digene Antacid Oral Gel Mint',
    genericComposition: 'Magnesium Hydroxide + Aluminium Hydroxide + Simethicone',
    manufacturer: 'Abbott India Ltd',
    packSize: '200ml Bottle',
    mrp: 146.00,
    dosageForm: 'Oral Gel',
    therapeuticClass: 'Antacid / Antiflatulent',
    prescriptionRequired: false,
    schedule: 'OTC',
    substitutes: ['Gelusil MPS', 'Mucaine Gel', 'Gas-O-Fast']
  },

  // Cardiovascular & Hypertension
  {
    brandName: 'Telma 40 Tablet',
    genericComposition: 'Telmisartan (40mg)',
    manufacturer: 'Glenmark Pharmaceuticals Ltd',
    packSize: '30 Tablets',
    mrp: 235.00,
    dosageForm: 'Tablet',
    therapeuticClass: 'Angiotensin II Receptor Blocker (ARB)',
    prescriptionRequired: true,
    schedule: 'Schedule H',
    substitutes: ['Telmikind 40', 'Telpres 40', 'Telsartan 40', 'Sartel 40']
  },
  {
    brandName: 'Cilacar 10 Tablet',
    genericComposition: 'Cilnidipine (10mg)',
    manufacturer: 'J.B. Chemicals & Pharmaceuticals Ltd',
    packSize: '15 Tablets',
    mrp: 125.00,
    dosageForm: 'Tablet',
    therapeuticClass: 'Calcium Channel Blocker (CCB)',
    prescriptionRequired: true,
    schedule: 'Schedule H',
    substitutes: ['Cilaheart 10', 'Nexovas 10', 'Dilnip 10']
  },
  {
    brandName: 'Atorva 10 Tablet',
    genericComposition: 'Atorvastatin Calcium (10mg)',
    manufacturer: 'Zydus Lifesciences Ltd',
    packSize: '15 Tablets',
    mrp: 110.00,
    dosageForm: 'Tablet',
    therapeuticClass: 'HMG-CoA Reductase Inhibitor (Statin)',
    prescriptionRequired: true,
    schedule: 'Schedule H',
    substitutes: ['Storvas 10', 'Lipikind 10', 'Atocor 10', 'Tonact 10']
  },

  // Diabetes Care
  {
    brandName: 'Glycomet 500 SR Tablet',
    genericComposition: 'Metformin Hydrochloride (500mg Sustained Release)',
    manufacturer: 'USV Ltd',
    packSize: '20 Tablets',
    mrp: 48.00,
    dosageForm: 'Extended Release Tablet',
    therapeuticClass: 'Biguanide Antidiabetic',
    prescriptionRequired: true,
    schedule: 'Schedule H',
    substitutes: ['Obimet 500 SR', 'Cetapin XR 500', 'Forminal 500']
  },
  {
    brandName: 'Glycomet-GP 1 Tablet',
    genericComposition: 'Glimepiride (1mg) + Metformin (500mg SR)',
    manufacturer: 'USV Ltd',
    packSize: '15 Tablets',
    mrp: 138.00,
    dosageForm: 'Bilayer Tablet',
    therapeuticClass: 'Dual Action Antidiabetic',
    prescriptionRequired: true,
    schedule: 'Schedule H',
    substitutes: ['Amaryl-M 1', 'Glimestar-M 1', 'Zoryl-M 1']
  },
  {
    brandName: 'Forxiga 10mg Tablet',
    genericComposition: 'Dapagliflozin (10mg)',
    manufacturer: 'AstraZeneca Pharma India Ltd',
    packSize: '14 Tablets',
    mrp: 790.00,
    dosageForm: 'Film-Coated Tablet',
    therapeuticClass: 'SGLT2 Inhibitor',
    prescriptionRequired: true,
    schedule: 'Schedule H',
    substitutes: ['Oxra 10', 'Daphance 10', 'Gliflozin-D 10']
  },

  // Allergy, Cold & Respiratory
  {
    brandName: 'Montair-LC Tablet',
    genericComposition: 'Levocetirizine Hydrochloride (5mg) + Montelukast Sodium (10mg)',
    manufacturer: 'Cipla Ltd',
    packSize: '15 Tablets',
    mrp: 290.00,
    dosageForm: 'Tablet',
    therapeuticClass: 'Antihistamine & Leukotriene Receptor Antagonist',
    prescriptionRequired: true,
    schedule: 'Schedule H',
    substitutes: ['Telekast-L', 'Montek-LC', 'Levolin-M', 'Odimont-LC']
  },
  {
    brandName: 'Allegra 120mg Tablet',
    genericComposition: 'Fexofenadine Hydrochloride (120mg)',
    manufacturer: 'Sanofi India Ltd',
    packSize: '10 Tablets',
    mrp: 215.00,
    dosageForm: 'Film Coated Tablet',
    therapeuticClass: 'Second Generation Antihistamine',
    prescriptionRequired: false,
    schedule: 'OTC / Non-Sedating',
    substitutes: ['Fexova 120', 'Histafree 120', 'Fexy 120']
  },
  {
    brandName: 'Asthalin 100mcg Inhaler',
    genericComposition: 'Salbutamol / Albuterol (100mcg per puff)',
    manufacturer: 'Cipla Ltd',
    packSize: '200 Metered Doses',
    mrp: 165.00,
    dosageForm: 'Inhaler (CFC Free MDI)',
    therapeuticClass: 'Short-Acting Beta2 Agonist (SABA)',
    prescriptionRequired: true,
    schedule: 'Schedule H',
    substitutes: ['Ventorlin Inhaler', 'Derihaler', 'Aerocort']
  },

  // Vitamins, Minerals & Nutrition
  {
    brandName: 'Shelcal 500 Tablet',
    genericComposition: 'Calcium Carbonate (1250mg eq. to elemental Calcium 500mg) + Vitamin D3 (250 IU)',
    manufacturer: 'Torrent Pharmaceuticals Ltd',
    packSize: '15 Tablets',
    mrp: 135.00,
    dosageForm: 'Tablet',
    therapeuticClass: 'Calcium & Vitamin D3 Supplement',
    prescriptionRequired: false,
    schedule: 'Nutraceutical / OTC',
    substitutes: ['Gemcal', 'Calcirol-D3', 'Cipcal 500']
  },
  {
    brandName: 'Becosules Z Capsule',
    genericComposition: 'Vitamin B-Complex (B1, B2, B6, B12, Niacinamide, Folic Acid) + Vitamin C + Zinc Sulfate',
    manufacturer: 'Pfizer Ltd India',
    packSize: '20 Capsules',
    mrp: 52.00,
    dosageForm: 'Capsule',
    therapeuticClass: 'Therapeutic Multivitamin with Zinc',
    prescriptionRequired: false,
    schedule: 'OTC',
    substitutes: ['Supradyn Daily', 'Cobadex-CZS', 'Surbex-T']
  },
  {
    brandName: 'Limcee 500mg Orange Chewable',
    genericComposition: 'Ascorbic Acid (100mg) + Sodium Ascorbate (450mg eq. to Vitamin C 500mg)',
    manufacturer: 'Abbott India Ltd',
    packSize: '15 Chewable Tablets',
    mrp: 26.50,
    dosageForm: 'Chewable Tablet',
    therapeuticClass: 'Vitamin C Supplement',
    prescriptionRequired: false,
    schedule: 'OTC',
    substitutes: ['Celin 500', 'Sukcee 500', 'Chewcee']
  },
  {
    brandName: 'Neurobion Forte Tablet',
    genericComposition: 'Vitamin B1 (10mg) + B2 (10mg) + B3 (45mg) + B5 (50mg) + B6 (3mg) + B12 (15mcg)',
    manufacturer: 'Procter & Gamble Health Ltd (P&G)',
    packSize: '30 Tablets',
    mrp: 44.50,
    dosageForm: 'Sugar Coated Tablet',
    therapeuticClass: 'Neurotropic Vitamin Formulation',
    prescriptionRequired: false,
    schedule: 'OTC',
    substitutes: ['Nurokind-Forte', 'Optineuron', 'Polybion']
  },
  {
    brandName: 'Evion 400 Capsule',
    genericComposition: 'Tocopheryl Acetate (Vitamin E 400mg)',
    manufacturer: 'Merck Ltd / Procter & Gamble',
    packSize: '10 Softgels',
    mrp: 38.00,
    dosageForm: 'Soft Gelatin Capsule',
    therapeuticClass: 'Lipophilic Antioxidant Vitamin',
    prescriptionRequired: false,
    schedule: 'OTC',
    substitutes: ['Toco-E 400', 'Bio-E 400', 'Gen-E 400']
  },

  // Topical & Dermatology
  {
    brandName: 'Betadine 10% Solution',
    genericComposition: 'Povidone Iodine (10% w/v, available iodine 1%)',
    manufacturer: 'Win-Medicare Pvt Ltd',
    packSize: '100ml Bottle',
    mrp: 135.00,
    dosageForm: 'Topical Microbicidal Solution',
    therapeuticClass: 'Broad Spectrum Antiseptic',
    prescriptionRequired: false,
    schedule: 'OTC',
    substitutes: ['Cipladine 10%', 'Wokadine 10%', 'Povikind 10%']
  },
  {
    brandName: 'Candid Dusting Powder',
    genericComposition: 'Clotrimazole (1% w/w)',
    manufacturer: 'Glenmark Pharmaceuticals Ltd',
    packSize: '100g Bottle',
    mrp: 165.00,
    dosageForm: 'Topical Dusting Powder',
    therapeuticClass: 'Antifungal',
    prescriptionRequired: false,
    schedule: 'OTC',
    substitutes: ['Clocip Powder', 'Abzorb Powder', 'Canesten Powder']
  },
  {
    brandName: 'Soframycin Skin Cream',
    genericComposition: 'Framycetin Sulphate (1% w/w)',
    manufacturer: 'Sanofi India Ltd',
    packSize: '30g Tube',
    mrp: 65.00,
    dosageForm: 'Topical Cream',
    therapeuticClass: 'Aminoglycoside Antibacterial',
    prescriptionRequired: false,
    schedule: 'Schedule H',
    substitutes: ['Neosporin Ointment', 'Bactroban', 'T-Bact']
  }
];

class IndianMedicineService {
  /**
   * Search Indian Medicine Database by keyword (brand, salt, or manufacturer)
   * @param {string} query - Search term
   * @param {number} limit - Maximum results
   */
  searchMedicines(query, limit = 20) {
    if (!query || query.trim() === '') {
      return INDIAN_DRUG_INDEX.slice(0, limit);
    }

    const q = query.trim().toLowerCase();

    return INDIAN_DRUG_INDEX.filter((med) => {
      return (
        med.brandName.toLowerCase().includes(q) ||
        med.genericComposition.toLowerCase().includes(q) ||
        med.manufacturer.toLowerCase().includes(q) ||
        med.therapeuticClass.toLowerCase().includes(q)
      );
    }).slice(0, limit);
  }

  /**
   * Find cheaper generic substitutes for any active molecule in India
   * @param {string} genericQuery - Active chemical name or brand (e.g. "Paracetamol 650mg" or "Augmentin")
   */
  findSubstitutes(genericQuery) {
    if (!genericQuery) return [];
    const raw = genericQuery.trim().toLowerCase();

    // 1. Direct match first (query in composition or brand, or brand in query)
    let matches = INDIAN_DRUG_INDEX.filter((med) => {
      const comp = med.genericComposition.toLowerCase();
      const brand = med.brandName.toLowerCase();
      return comp.includes(raw) || brand.includes(raw) || raw.includes(brand);
    });

    // 2. If no direct match, extract key active pharmaceutical ingredient (API) tokens
    if (matches.length === 0) {
      // Strip brackets, symbols, and dosages (mg, ml, g, etc.)
      const cleaned = raw
        .replace(/[(),+\-\/]/g, ' ')
        .replace(/\b\d+(\.\d+)?(mg|mcg|ml|g|iu|au|%|w\/v|w\/w)?\b/gi, '')
        .trim();

      const stopWords = new Set([
        'tablet', 'tablets', 'capsule', 'capsules', 'syrup', 'drops', 
        'gel', 'cream', 'ointment', 'injection', 'inhaler', 'solution',
        'forte', 'plus', 'duo', 'advance', 'chewable', 'powder', 'with'
      ]);

      const tokens = cleaned
        .split(/\s+/)
        .filter((tok) => tok.length >= 4 && !stopWords.has(tok));

      if (tokens.length > 0) {
        matches = INDIAN_DRUG_INDEX.filter((med) => {
          const comp = med.genericComposition.toLowerCase();
          const brand = med.brandName.toLowerCase();
          return tokens.some((t) => comp.includes(t) || brand.includes(t));
        });
      }
    }

    // Sort by indicative MRP ascending to showcase most affordable generics first
    return matches.sort((a, b) => a.mrp - b.mrp);
  }

  /**
   * Get drug information details with CDSCO schedule and indicative price
   * @param {string} brandName 
   */
  getMedicineDetails(brandName) {
    if (!brandName) return null;
    const q = brandName.trim().toLowerCase();
    return INDIAN_DRUG_INDEX.find(
      (med) => med.brandName.toLowerCase() === q || med.brandName.toLowerCase().startsWith(q)
    ) || null;
  }
}

export default new IndianMedicineService();
