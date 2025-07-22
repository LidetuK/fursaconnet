import { Controller, Get, Post, Body, Param, UseGuards, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DataSource } from 'typeorm';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly dataSource: DataSource
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('generate-tracking-script')
  async generateTrackingScript(@Req() req: Request, @Body() body: { websiteUrl: string, trackingName: string }) {
    try {
      const user: any = (req as any).user || {};
      const userId = user.sub;
      
      if (!userId) {
        return { error: 'Not authenticated' };
      }

      // Generate unique tracking ID
      const trackingId = this.analyticsService.generateTrackingId();
      
      // Save tracking configuration to database
      await this.dataSource.query(
        `INSERT INTO analytics_tracking (user_id, tracking_id, website_url, tracking_name, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, NOW(), NOW())`,
        [userId, trackingId, body.websiteUrl, body.trackingName]
      );

      // Generate the tracking script
      const trackingScript = this.analyticsService.generateTrackingScript(trackingId);

      return {
        success: true,
        trackingId,
        trackingScript,
        message: 'Tracking script generated successfully'
      };
    } catch (err: any) {
      console.error('Error generating tracking script:', err);
      return { error: 'Failed to generate tracking script', details: err.message };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('tracking-scripts')
  async getTrackingScripts(@Req() req: Request) {
    try {
      const user: any = (req as any).user || {};
      const userId = user.sub;
      
      if (!userId) {
        return { error: 'Not authenticated' };
      }

      const scripts = await this.dataSource.query(
        `SELECT tracking_id, website_url, tracking_name, created_at, is_active 
         FROM analytics_tracking 
         WHERE user_id = $1 
         ORDER BY created_at DESC`,
        [userId]
      );

      return { success: true, scripts };
    } catch (err: any) {
      console.error('Error fetching tracking scripts:', err);
      return { error: 'Failed to fetch tracking scripts', details: err.message };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('dashboard/:trackingId')
  async getAnalyticsDashboard(@Req() req: Request, @Param('trackingId') trackingId: string) {
    try {
      const user: any = (req as any).user || {};
      const userId = user.sub;
      
      if (!userId) {
        return { error: 'Not authenticated' };
      }

      // Verify user owns this tracking ID
      const tracking = await this.dataSource.query(
        'SELECT * FROM analytics_tracking WHERE tracking_id = $1 AND user_id = $2',
        [trackingId, userId]
      );

      if (!tracking || tracking.length === 0) {
        return { error: 'Tracking ID not found or access denied' };
      }

      // Get analytics data
      const analyticsData = await this.analyticsService.getAnalyticsData(trackingId);

      return {
        success: true,
        tracking: tracking[0],
        analytics: analyticsData
      };
    } catch (err: any) {
      console.error('Error fetching analytics dashboard:', err);
      return { error: 'Failed to fetch analytics data', details: err.message };
    }
  }

  @Post('track/:trackingId')
  async trackEvent(@Param('trackingId') trackingId: string, @Body() body: any, @Req() req: Request) {
    try {
      // Validate tracking ID exists
      const tracking = await this.dataSource.query(
        'SELECT * FROM analytics_tracking WHERE tracking_id = $1 AND is_active = true',
        [trackingId]
      );

      if (!tracking || tracking.length === 0) {
        return { error: 'Invalid tracking ID' };
      }

      // Extract user agent and IP
      const userAgent = req.headers['user-agent'] || '';
      const ip = req.ip || req.connection.remoteAddress || '';
      const referrer = req.headers.referer || '';

      // Save the tracking event
      await this.dataSource.query(
        `INSERT INTO analytics_events (tracking_id, event_type, event_data, page_url, user_agent, ip_address, referrer, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [
          trackingId,
          body.eventType || 'pageview',
          JSON.stringify(body.eventData || {}),
          body.pageUrl || '',
          userAgent,
          ip,
          referrer
        ]
      );

      return { success: true };
    } catch (err: any) {
      console.error('Error tracking event:', err);
      return { error: 'Failed to track event', details: err.message };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('reports/:trackingId')
  async getAnalyticsReport(@Req() req: Request, @Param('trackingId') trackingId: string) {
    try {
      const user: any = (req as any).user || {};
      const userId = user.sub;
      
      if (!userId) {
        return { error: 'Not authenticated' };
      }

      // Verify user owns this tracking ID
      const tracking = await this.dataSource.query(
        'SELECT * FROM analytics_tracking WHERE tracking_id = $1 AND user_id = $2',
        [trackingId, userId]
      );

      if (!tracking || tracking.length === 0) {
        return { error: 'Tracking ID not found or access denied' };
      }

      // Generate comprehensive report
      const report = await this.analyticsService.generateAnalyticsReport(trackingId);

      return {
        success: true,
        report
      };
    } catch (err: any) {
      console.error('Error generating analytics report:', err);
      return { error: 'Failed to generate report', details: err.message };
    }
  }
} 