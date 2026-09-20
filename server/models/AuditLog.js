import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    adminEmail: {
      type: String,
      default: '',
    },
    action: {
      type: String,
      required: true, // e.g. MEDICINE_PRICE_CHANGED, ORDER_STATUS_UPDATED, PRESCRIPTION_APPROVED
    },
    entity: {
      type: String,
      required: true, // Medicine, Order, Prescription, User, etc.
    },
    entityId: {
      type: String,
      required: true,
    },
    previousValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    newValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
