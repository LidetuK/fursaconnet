import { Body, Controller, Post, Delete, Param, Req, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { TelegramAuthService } from './telegram-auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialAccount } from '../users/social-account.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { FilesInterceptor } from '@nestjs/platform-express';

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
  constructor(
    private readonly telegramService: TelegramAuthService,
    @InjectRepository(SocialAccount)
    private readonly socialAccountRepo: Repository<SocialAccount>,
    private readonly jwtService: JwtService,
  ) {}

  @Post('connect')
  async connect(@Body() body: ConnectTelegramDto) {
    console.log('Telegram connect request:', {
      userId: body.userId,
      userIdType: typeof body.userId,
      chatId: body.chatId
    });
    
    // Store in memory for backward compatibility - use string format consistently
    const userIdString = body.userId.toString();
    userTelegramChannels[userIdString] = { chatId: body.chatId };
    
    console.log('Telegram channels after connect:', Object.keys(userTelegramChannels));
    
    // Also store in database
    await this.socialAccountRepo.upsert({
      user_id: parseInt(body.userId, 10),
      platform: 'telegram',
      platform_user_id: body.chatId,
      screen_name: body.chatId,
      access_token: undefined,
      refresh_token: undefined,
      expires_at: undefined,
    }, ['user_id', 'platform']);
    
    return { success: true, message: 'Telegram channel connected.' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('disconnect')
  async disconnect(@Req() req: Request) {
    const userJwt: any = (req as any).user;
    if (!userJwt?.sub) {
      return { success: false, error: 'Unauthorized' };
    }
    
    const userId = userJwt.sub;
    const userIdString = userId.toString();
    
    console.log('Telegram disconnect request:', {
      userId: userId,
      userIdString: userIdString
    });
    
    try {
      // Remove from memory
      delete userTelegramChannels[userIdString];
      
      console.log('Telegram channels after disconnect:', Object.keys(userTelegramChannels));
      
      // Remove from database
      const result = await this.socialAccountRepo.delete({ 
        user_id: parseInt(userId.toString(), 10), 
        platform: 'telegram' 
      });
      
      if (result.affected === 0) {
        return { success: false, error: 'No Telegram connection found' };
      }
      
      return { success: true, message: 'Telegram channel disconnected.' };
    } catch (error) {
      return { success: false, error: 'Failed to disconnect Telegram' };
    }
  }

  @Post('test')
  async testConnection(@Body() body: { userId: string }) {
    console.log('Telegram test connection request:', { 
      userId: body.userId,
      userIdType: typeof body.userId
    });
    
    if (!body.userId) {
      return { success: false, error: 'Missing userId parameter' };
    }
    
    // Try to find the channel with different user ID formats
    let channel = userTelegramChannels[body.userId];
    if (!channel) {
      // Try with numeric user ID
      const numericUserId = parseInt(body.userId, 10);
      if (!isNaN(numericUserId)) {
        channel = userTelegramChannels[numericUserId.toString()];
      }
    }
    if (!channel) {
      // Try with string user ID
      const stringUserId = body.userId.toString();
      channel = userTelegramChannels[stringUserId];
    }
    
    console.log('Telegram test - channel found:', { 
      found: !!channel, 
      chatId: channel?.chatId,
      availableUserIds: Object.keys(userTelegramChannels)
    });
    
    if (!channel) {
      return { success: false, error: 'No Telegram channel connected for this user.' };
    }
    
    // Test the connection by getting chat info
    try {
      const result = await this.telegramService.getChatInfo(channel.chatId);
      return { 
        success: true, 
        chatInfo: result,
        message: 'Telegram connection is working properly.'
      };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message,
        chatId: channel.chatId
      };
    }
  }

  @Post('send')
  @UseInterceptors(FilesInterceptor('images', 10)) // Telegram allows up to 10 images
  async send(
    @Body() body: SendTelegramMessageDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    console.log('Telegram send request:', { 
      userId: body.userId, 
      userIdType: typeof body.userId,
      textLength: body.text?.length,
      hasFiles: files?.length > 0,
      fileCount: files?.length || 0
    });
    
    if (!body.userId || !body.text) {
      console.error('Telegram send: Missing required parameters');
      return { success: false, error: 'Missing userId or text parameter' };
    }
    
    // Try to find the channel with different user ID formats
    let channel = userTelegramChannels[body.userId];
    if (!channel) {
      // Try with numeric user ID
      const numericUserId = parseInt(body.userId, 10);
      if (!isNaN(numericUserId)) {
        channel = userTelegramChannels[numericUserId.toString()];
      }
    }
    if (!channel) {
      // Try with string user ID
      const stringUserId = body.userId.toString();
      channel = userTelegramChannels[stringUserId];
    }
    
    console.log('Telegram channel found:', { 
      found: !!channel, 
      chatId: channel?.chatId,
      availableUserIds: Object.keys(userTelegramChannels)
    });
    
    if (!channel) {
      console.error('Telegram send: No channel connected for user:', body.userId);
      return { success: false, error: 'No Telegram channel connected for this user.' };
    }
    
    console.log('Telegram send: Attempting to send message to chatId:', channel.chatId);
    
    // Send message with or without images
    if (files && files.length > 0) {
      const result = await this.telegramService.sendMessageWithImages(channel.chatId, body.text, files);
      console.log('Telegram send with images result:', result);
      return result;
    } else {
    const result = await this.telegramService.sendMessage(channel.chatId, body.text);
      console.log('Telegram send result:', result);
    return result;
    }
  }
} 
