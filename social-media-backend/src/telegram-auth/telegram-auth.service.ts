import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TelegramAuthService {
  private readonly logger = new Logger(TelegramAuthService.name);
  private readonly botToken: string;

  constructor() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      this.logger.error('TELEGRAM_BOT_TOKEN is not set in environment variables');
      throw new Error('TELEGRAM_BOT_TOKEN is required');
    }
    this.botToken = token;
  }

  async sendMessage(chatId: string, text: string): Promise<{ success: boolean; error?: string }> {
    const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
    
    // Ensure chatId is properly formatted
    let formattedChatId = chatId;
    if (chatId.startsWith('@')) {
      formattedChatId = chatId; // Keep as is for usernames
    } else if (!isNaN(Number(chatId))) {
      formattedChatId = chatId; // Keep as is for numeric IDs
    } else {
      // If it doesn't start with @ and isn't numeric, add @ prefix
      formattedChatId = chatId.startsWith('@') ? chatId : `@${chatId}`;
    }
    
    this.logger.log(`Sending message to Telegram with chatId: ${formattedChatId}`);
    
    try {
      const response = await axios.post(url, {
        chat_id: formattedChatId,
        text,
      });
      
      this.logger.log(`Telegram API response:`, response.data);
      
      if (response.data && response.data.ok) {
        this.logger.log(`Message sent successfully to chatId ${formattedChatId}`);
        return { success: true };
      } else {
        this.logger.error(`Failed to send message: ${JSON.stringify(response.data)}`);
        return { success: false, error: response.data.description || 'Telegram API error' };
      }
    } catch (error: any) {
      this.logger.error(`Error sending message to Telegram: ${error.message}`);
      if (error.response?.data) {
        this.logger.error(`Telegram API error details:`, error.response.data);
        return { success: false, error: error.response.data.description || error.message };
      }
      return { success: false, error: error.message };
    }
  }
} 