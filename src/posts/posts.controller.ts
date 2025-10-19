import { Controller, Get, Post, UseGuards, Req, Res, Query, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Post as PostEntity } from '../users/post.entity';

@Controller('posts')
export class PostsController {
  constructor(
    @InjectRepository(PostEntity)
    private postsRepo: Repository<PostEntity>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: {
      platform: string;
      content: string;
      status: string;
      publishedAt?: string;
      platformPostId?: string;
      errorMessage?: string;
      metadata?: any;
    }
  ) {
    const user: any = (req as any).user || {};
    const userId = parseInt(user.sub.toString(), 10);
    
    console.log('Create post request:', { 
      userId, 
      platform: body.platform,
      contentLength: body.content?.length,
      status: body.status
    });
    
    if (!userId) {
      console.error('Create post: Not authenticated');
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (!body.platform || !body.content || !body.status) {
      return res.status(400).json({ error: 'Missing required fields: platform, content, status' });
    }
    
    try {
      const post = this.postsRepo.create({
        user_id: userId,
        platform: body.platform,
        content: body.content,
        status: body.status as 'published' | 'scheduled' | 'draft' | 'failed',
        platform_post_id: body.platformPostId,
        published_at: body.publishedAt ? new Date(body.publishedAt) : new Date(),
        error_message: body.errorMessage,
        metadata: body.metadata
      });
      
      const savedPost = await this.postsRepo.save(post);
      
      console.log('Create post: Success', { 
        postId: savedPost.id,
        platform: savedPost.platform,
        status: savedPost.status
      });
      
      return res.status(201).json({
        success: true,
        post: {
          id: savedPost.id.toString(),
          platform: savedPost.platform,
          content: savedPost.content,
          status: savedPost.status,
          publishedAt: savedPost.published_at,
          createdAt: savedPost.created_at
        }
      });
    } catch (err: any) {
      console.error('Create post: Database error:', err);
      return res.status(500).json({ error: 'Failed to save post', details: err.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getPosts(
    @Req() req: Request,
    @Res() res: Response,
    @Query('status') status?: string,
    @Query('platform') platform?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    const user: any = (req as any).user || {};
    const userId = parseInt(user.sub.toString(), 10);
    
    console.log('Get posts request:', { 
      userId, 
      status, 
      platform, 
      limit, 
      offset 
    });
    
    if (!userId) {
      console.error('Get posts: Not authenticated');
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    try {
      // Build query
      const queryBuilder = this.postsRepo
        .createQueryBuilder('post')
        .where('post.user_id = :userId', { userId })
        .orderBy('post.created_at', 'DESC');
      
      // Apply filters
      if (status && status !== 'all') {
        queryBuilder.andWhere('post.status = :status', { status });
      }
      
      if (platform) {
        queryBuilder.andWhere('post.platform = :platform', { platform });
      }
      
      // Apply pagination
      const limitNum = limit ? parseInt(limit, 10) : 50;
      const offsetNum = offset ? parseInt(offset, 10) : 0;
      
      queryBuilder
        .limit(limitNum)
        .offset(offsetNum);
      
      const posts = await queryBuilder.getMany();
      
      // Get total count for pagination
      const countQueryBuilder = this.postsRepo
        .createQueryBuilder('post')
        .where('post.user_id = :userId', { userId });
      
      if (status && status !== 'all') {
        countQueryBuilder.andWhere('post.status = :status', { status });
      }
      
      if (platform) {
        countQueryBuilder.andWhere('post.platform = :platform', { platform });
      }
      
      const totalCount = await countQueryBuilder.getCount();
      
      // Transform posts for frontend
      const transformedPosts = posts.map(post => ({
        id: post.id.toString(),
        content: post.content,
        platform: post.platform,
        status: post.status,
        publishedAt: post.published_at || post.created_at,
        platformPostId: post.platform_post_id,
        errorMessage: post.error_message,
        metadata: post.metadata,
        createdAt: post.created_at,
        updatedAt: post.updated_at
      }));
      
      console.log('Get posts: Success', { 
        count: transformedPosts.length, 
        totalCount 
      });
      
      return res.json({
        posts: transformedPosts,
        pagination: {
          total: totalCount,
          limit: limitNum,
          offset: offsetNum,
          hasMore: offsetNum + limitNum < totalCount
        }
      });
    } catch (err: any) {
      console.error('Get posts: Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch posts', details: err.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getPostStats(@Req() req: Request, @Res() res: Response) {
    const user: any = (req as any).user || {};
    const userId = parseInt(user.sub.toString(), 10);
    
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    try {
      // Get counts by status
      const statusStats = await this.postsRepo
        .createQueryBuilder('post')
        .select('post.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .where('post.user_id = :userId', { userId })
        .groupBy('post.status')
        .getRawMany();
      
      // Get counts by platform
      const platformStats = await this.postsRepo
        .createQueryBuilder('post')
        .select('post.platform', 'platform')
        .addSelect('COUNT(*)', 'count')
        .where('post.user_id = :userId', { userId })
        .groupBy('post.platform')
        .getRawMany();
      
      // Get total count
      const totalCount = await this.postsRepo
        .createQueryBuilder('post')
        .where('post.user_id = :userId', { userId })
        .getCount();
      
      const stats = {
        total: totalCount,
        byStatus: statusStats.reduce((acc, stat) => {
          acc[stat.status] = parseInt(stat.count);
          return acc;
        }, {} as Record<string, number>),
        byPlatform: platformStats.reduce((acc, stat) => {
          acc[stat.platform] = parseInt(stat.count);
          return acc;
        }, {} as Record<string, number>)
      };
      
      return res.json(stats);
    } catch (err: any) {
      console.error('Get post stats: Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch post stats', details: err.message });
    }
  }
} 