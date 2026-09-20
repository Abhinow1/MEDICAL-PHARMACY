import chatbotService from '../services/chatbotService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const handleChatMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return sendError(res, 'Message text is required', 400);
    }

    const userId = req.user ? req.user._id : null;
    const response = await chatbotService.processQuery({ message, userId });

    return sendSuccess(res, response);
  } catch (error) {
    next(error);
  }
};
