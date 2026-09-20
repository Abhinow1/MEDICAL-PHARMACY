class NotificationService {
  async notifyOrderPlaced(order) {
    console.log(`[Notification] Order Placed: #${order.orderNumber} for User ${order.user}`);
  }

  async notifyPaymentSuccess(order, payment) {
    console.log(`[Notification] Payment Successful: #${order.orderNumber}, Amount: ₹${order.total}`);
  }

  async notifyPrescriptionApproved(order, prescription) {
    console.log(`[Notification] Prescription Approved for Order #${order.orderNumber}`);
  }

  async notifyPrescriptionRejected(order, prescription, reason) {
    console.log(`[Notification] Prescription Rejected for Order #${order.orderNumber}. Reason: ${reason}`);
  }

  async notifyOrderStatusUpdated(order, newStatus) {
    console.log(`[Notification] Order #${order.orderNumber} status changed to ${newStatus}`);
  }
}

export default new NotificationService();
