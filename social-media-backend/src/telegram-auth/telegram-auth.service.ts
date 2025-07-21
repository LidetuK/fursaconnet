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
    this.logger.log(`Bot token preview: ${this.botToken.substring(0, 10)}...`);
    
    try {
      // First, let's try to get chat information to verify the chat exists
      const getChatUrl = `https://api.telegram.org/bot${this.botToken}/getChat`;
      this.logger.log(`Checking if chat exists: ${getChatUrl}`);
      
      const chatInfoResponse = await axios.post(getChatUrl, {
        chat_id: formattedChatId,
      });
      
      this.logger.log(`Chat info response:`, chatInfoResponse.data);
      
      // Now send the message
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
        
        // Provide specific error messages for common issues
        if (error.response.data.error_code === 400) {
          if (error.response.data.description?.includes('chat not found')) {
            return { 
              success: false, 
              error: `Chat not found: ${formattedChatId}. Please ensure: 1) The bot is added to the channel as an admin, 2) The channel username is correct, 3) The channel is public or the bot has access.` 
            };
          } else if (error.response.data.description?.includes('bot was blocked')) {
            return { 
              success: false, 
              error: `Bot was blocked by the channel. Please unblock the bot and add it as an admin.` 
            };
          } else if (error.response.data.description?.includes('not enough rights')) {
            return { 
              success: false, 
              error: `Bot doesn't have permission to send messages. Please add the bot as an admin with 'Send Messages' permission.` 
            };
          }
        }
        
        return { success: false, error: error.response.data.description || error.message };
      }
      return { success: false, error: error.message };
    }
  }

  async sendMessageWithImages(chatId: string, text: string, files: Express.Multer.File[]): Promise<{ success: boolean; error?: string }> {
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
    
    this.logger.log(`Sending message with ${files.length} images to Telegram with chatId: ${formattedChatId}`);
    
    try {
      // For multiple images, we need to send them as a media group
      if (files.length > 1) {
        const mediaGroup = files.map((file, index) => ({
          type: 'photo',
          media: `attach://photo_${index}`,
          caption: index === 0 ? text : undefined // Only add caption to first image
        }));
        
        const formData = new FormData();
        formData.append('chat_id', formattedChatId);
        formData.append('media', JSON.stringify(mediaGroup));
        
        // Add each file to the form data
        files.forEach((file, index) => {
          const blob = new Blob([file.buffer], { type: file.mimetype });
          formData.append(`photo_${index}`, blob, file.originalname || `image_${index}.jpg`);
        });
        
        const response = await axios.post(
          `https://api.telegram.org/bot${this.botToken}/sendMediaGroup`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        
        this.logger.log(`Telegram media group response:`, response.data);
        
        if (response.data && response.data.ok) {
          this.logger.log(`Message with ${files.length} images sent successfully to chatId ${formattedChatId}`);
          return { success: true };
        } else {
          this.logger.error(`Failed to send media group: ${JSON.stringify(response.data)}`);
          return { success: false, error: response.data.description || 'Telegram API error' };
        }
      } else {
        // Single image - send as photo with caption
        const formData = new FormData();
        formData.append('chat_id', formattedChatId);
        formData.append('caption', text);
        
        const blob = new Blob([files[0].buffer], { type: files[0].mimetype });
        formData.append('photo', blob, files[0].originalname || 'image.jpg');
        
        const response = await axios.post(
          `https://api.telegram.org/bot${this.botToken}/sendPhoto`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        
        this.logger.log(`Telegram photo response:`, response.data);
        
        if (response.data && response.data.ok) {
          this.logger.log(`Message with image sent successfully to chatId ${formattedChatId}`);
          return { success: true };
        } else {
          this.logger.error(`Failed to send photo: ${JSON.stringify(response.data)}`);
          return { success: false, error: response.data.description || 'Telegram API error' };
        }
      }
    } catch (error: any) {
      this.logger.error(`Error sending message with images to Telegram: ${error.message}`);
      if (error.response?.data) {
        this.logger.error(`Telegram API error details:`, error.response.data);
        return { success: false, error: error.response.data.description || error.message };
      }
      return { success: false, error: error.message };
    }
  }

  async getChatInfo(chatId: string): Promise<any> {
    const url = `https://api.telegram.org/bot${this.botToken}/getChat`;
    
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
    
    this.logger.log(`Getting chat info for: ${formattedChatId}`);
    
    try {
      const response = await axios.post(url, {
        chat_id: formattedChatId,
      });
      
      if (response.data && response.data.ok) {
        this.logger.log(`Chat info retrieved successfully:`, response.data.result);
        return response.data.result;
      } else {
        throw new Error(response.data.description || 'Failed to get chat info');
      }
    } catch (error: any) {
      this.logger.error(`Error getting chat info: ${error.message}`);
      if (error.response?.data) {
        this.logger.error(`Telegram API error details:`, error.response.data);
        throw new Error(error.response.data.description || error.message);
      }
      throw error;
    }
  }
} 