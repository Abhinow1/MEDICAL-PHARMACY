import Medicine from '../models/Medicine.js';
import Order from '../models/Order.js';

class ChatbotService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
  }

  /**
   * Primary entry point for chatbot interactions
   */
  async processQuery({ message, userId = null }) {
    const trimmed = (message || '').trim().toLowerCase();
    const storeWhatsApp = process.env.WHATSAPP_NUMBER || '919876543210';

    // 1. Safety Guardrail: Medical Advice & Diagnosis Detection
    const medicalAdviceKeywords = [
      'diagnose',
      'i have chest pain',
      'chest pain',
      'heart attack',
      'shortness of breath',
      'stroke',
      'what should i take for',
      'what medicine should i take',
      'which tablet to take',
      'how much dosage should i take',
      'can i take overdose',
      'cure cancer',
      'treat disease',
      'prescribe me',
      'severe bleeding',
      'suicidal',
      'poisoning',
    ];

    const triggersMedicalWarning = medicalAdviceKeywords.some((keyword) =>
      trimmed.includes(keyword)
    );

    if (triggersMedicalWarning) {
      return {
        reply: `⚠️ IMPORTANT MEDICAL NOTICE:
As an automated pharmacy assistant, I am not permitted to diagnose conditions, suggest personalized medication, or evaluate medical symptoms.

Please consult a licensed physician or healthcare professional immediately.
If this is an emergency, please call your local emergency medical service (e.g. 112 / 102) immediately.

For verified medicine availability, you can browse our catalog or connect directly with our licensed pharmacist on WhatsApp.`,
        action: 'MEDICAL_DISCLAIMER',
        whatsappUrl: `https://wa.me/${storeWhatsApp}?text=${encodeURIComponent('Hello Pharmacist, I have an urgent health query.')}`,
      };
    }

    // 2. Store Timing & Delivery Queries
    if (trimmed.includes('time') || trimmed.includes('timing') || trimmed.includes('open') || trimmed.includes('hours')) {
      return {
        reply: `🕒 Store Timings:
• Monday – Saturday: 8:00 AM – 10:00 PM
• Sunday: 9:00 AM – 6:00 PM

Our digital storefront accepts orders 24/7. Deliveries are processed daily during working hours.`,
        action: 'INFO',
      };
    }

    if (trimmed.includes('delivery') || trimmed.includes('shipping') || trimmed.includes('charges')) {
      return {
        reply: `🚚 Delivery Details:
• Standard Delivery: 24 to 48 hours across serviceable pin codes.
• Express Delivery: Same-day delivery for select local areas.
• Free Delivery on all orders above ₹500. A nominal fee of ₹40 applies for smaller orders.`,
        action: 'INFO',
      };
    }

    if (trimmed.includes('prescription') || trimmed.includes('rx')) {
      return {
        reply: `📄 Prescription Policy:
Medicines marked with a red [Rx Required] badge require a valid doctor's prescription.
You can easily upload a photo or PDF of your prescription during checkout. Our registered pharmacist will review it before dispatching your medication.`,
        action: 'INFO',
      };
    }

    // 3. Order Status Lookup
    if (trimmed.includes('order') || trimmed.includes('track') || trimmed.includes('where is my order')) {
      if (!userId) {
        return {
          reply: `To track your order status, please log in to your account and navigate to "My Orders", or provide your Order ID. You can also chat with our support team on WhatsApp.`,
          action: 'LOGIN_REQUIRED',
          whatsappUrl: `https://wa.me/${storeWhatsApp}?text=${encodeURIComponent('Hello, I would like to check my order status.')}`,
        };
      }

      // Find latest order for this user
      const latestOrder = await Order.findOne({ user: userId }).sort({ createdAt: -1 });
      if (!latestOrder) {
        return {
          reply: `You haven't placed any orders yet. Browse our catalog to find essential healthcare products!`,
          action: 'NO_ORDERS',
        };
      }

      return {
        reply: `📦 Your most recent Order #${latestOrder.orderNumber}:
• Status: ${latestOrder.orderStatus}
• Total: ₹${latestOrder.total}
• Items: ${latestOrder.items.length} product(s)
• Placed on: ${new Date(latestOrder.createdAt).toLocaleDateString()}

Visit the "Orders" page for real-time tracking details!`,
        action: 'ORDER_FOUND',
        orderId: latestOrder._id,
      };
    }

    // 4. Product Catalog Search
    // Check if user is asking about a medicine ("do you have...", "search...", or product keywords)
    const searchMatch = trimmed.match(/(?:do you have|got|have|search|find|buy|need)\s+([a-zA-Z0-9\s]+)/i) ||
      [null, trimmed.replace(/[^a-zA-Z0-9\s]/g, '').trim()];

    const queryTerm = searchMatch[1] ? searchMatch[1].trim() : trimmed;

    if (queryTerm && queryTerm.length > 2) {
      const medicines = await Medicine.find({
        isActive: true,
        $or: [
          { name: { $regex: queryTerm, $options: 'i' } },
          { genericName: { $regex: queryTerm, $options: 'i' } },
          { brand: { $regex: queryTerm, $options: 'i' } },
          { uses: { $regex: queryTerm, $options: 'i' } },
        ],
      })
        .select('name brand genericName price discount stock prescriptionRequired image')
        .limit(4);

      if (medicines.length > 0) {
        const productList = medicines
          .map(
            (m) =>
              `• ${m.name} (${m.brand}) – ₹${m.price} [${m.stock > 0 ? 'In Stock' : 'Out of Stock'}]${
                m.prescriptionRequired ? ' [Rx Required]' : ''
              }`
          )
          .join('\n');

        return {
          reply: `Here are the matching medicines found in our pharmacy:\n\n${productList}\n\nPlease note: This product listing is for reference only and does not constitute a prescription or medical endorsement.`,
          action: 'PRODUCTS_FOUND',
          products: medicines,
        };
      }
    }

    // 5. Default Friendly Fallback with WhatsApp Handoff
    return {
      reply: `Hello! I am the MediCare Pharmacy Assistant. How can I help you today?
• You can ask: "Do you have Paracetamol?"
• "What are your store hours?"
• "Tell me about delivery charges"
• "Where is my order?"

Need personalized assistance from our pharmacist? You can chat with our team on WhatsApp anytime!`,
      action: 'GENERAL_HELP',
      whatsappUrl: `https://wa.me/${storeWhatsApp}?text=${encodeURIComponent('Hello, I need help regarding medicines on MediCare.')}`,
    };
  }
}

export default new ChatbotService();
