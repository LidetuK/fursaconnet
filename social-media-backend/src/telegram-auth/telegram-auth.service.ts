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
    try {
      const response = await axios.post(url, {
        chat_id: chatId,
        text,
      });
      if (response.data && response.data.ok) {
        this.logger.log(`Message sent to chatId ${chatId}`);
        return { success: true };
      } else {
        this.logger.error(`Failed to send message: ${JSON.stringify(response.data)}`);
        return { success: false, error: 'Telegram API error' };
      }
    } catch (error) {
      this.logger.error(`Error sending message to Telegram: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
} 