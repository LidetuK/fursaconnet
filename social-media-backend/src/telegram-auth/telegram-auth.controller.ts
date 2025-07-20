import { Body, Controller, Post } from '@nestjs/common';
import { TelegramAuthService } from './telegram-auth.service';

// Simple in-memory store for demonstration (replace with DB in production)
const userTelegramChannels: Record<string, { chatId: string }> = {};

class ConnectTelegramDto {
  userId: string;
  chatId: string;
}

class SendTelegramMessageDto {
  userId: string;
  text: string;
}

@Controller('telegram')
export class TelegramAuthController {
  constructor(private readonly telegramService: TelegramAuthService) {}

  @Post('connect')
  connect(@Body() body: ConnectTelegramDto) {
    userTelegramChannels[body.userId] = { chatId: body.chatId };
    return { success: true, message: 'Telegram channel connected.' };
  }

  @Post('send')
  async send(@Body() body: SendTelegramMessageDto) {
    const channel = userTelegramChannels[body.userId];
    if (!channel) {
      return { success: false, error: 'No Telegram channel connected for this user.' };
    }
    const result = await this.telegramService.sendMessage(channel.chatId, body.text);
    return result;
  }
} 