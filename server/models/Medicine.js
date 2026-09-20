import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide medicine name'],
      trim: true,
      index: true,
    },
    genericName: {
      type: String,
      required: [true, 'Please provide generic / chemical name'],
      trim: true,
      index: true,
    },
    brand: {
      type: String,
      required: [true, 'Please provide manufacturer/brand name'],
      trim: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please assign a category'],
    },
    description: {
      type: String,
      required: [true, 'Please provide description'],
    },
    uses: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: [true, 'Please provide selling price'],
      min: [0, 'Price cannot be negative'],
    },
    costPrice: {
      type: Number,
      required: [true, 'Please provide purchase/cost price'],
      min: [0, 'Cost price cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount percentage cannot be negative'],
      max: [100, 'Discount percentage cannot exceed 100'],
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 15,
      min: 0,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60',
    },
    prescriptionRequired: {
      type: Boolean,
      default: false,
    },
    dosageForm: {
      type: String,
      default: 'Tablet', // Tablet, Syrup, Capsule, Ointment, Injection, Drops, etc.
    },
    strength: {
      type: String,
      default: '', // e.g. 500mg, 10ml, etc.
    },
    packSize: {
      type: String,
      default: '10 Tablets',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for fuzzy/comprehensive search
medicineSchema.index({
  name: 'text',
  genericName: 'text',
  brand: 'text',
  description: 'text',
  uses: 'text',
});

// Virtual for discounted price
medicineSchema.virtual('finalPrice').get(function () {
  if (this.discount > 0) {
    const discounted = this.price - (this.price * this.discount) / 100;
    return Math.round(discounted * 100) / 100;
  }
  return this.price;
});

medicineSchema.set('toJSON', { virtuals: true });
medicineSchema.set('toObject', { virtuals: true });

const Medicine = mongoose.model('Medicine', medicineSchema);
export default Medicine;
