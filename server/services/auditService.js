import AuditLog from '../models/AuditLog.js';

class AuditService {
  async log({ adminId, adminEmail, action, entity, entityId, previousValue = null, newValue = null, ipAddress = '' }) {
    try {
      await AuditLog.create({
        admin: adminId,
        adminEmail,
        action,
        entity,
        entityId: entityId.toString(),
        previousValue,
        newValue,
        ipAddress,
      });
    } catch (error) {
      console.error('Audit log failed:', error.message);
    }
  }

  async getRecentLogs(limit = 50) {
    return await AuditLog.find().sort({ createdAt: -1 }).limit(limit).populate('admin', 'name email');
  }
}

export default new AuditService();
