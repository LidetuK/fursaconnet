import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import axios from 'axios';

@Controller('auth/google-business')
export class GoogleBusinessController {
  
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getBusinessProfile(@Req() req: Request, @Res() res: Response) {
    const user: any = (req as any).user || {};
    const userId = parseInt(user.sub.toString(), 10);
    
    console.log('Google Business profile request:', { userId });
    
    if (!userId) {
      console.error('Google Business: Not authenticated');
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    try {
      // For now, return mock data since we need to implement the actual Google Business API integration
      // In a real implementation, you would:
      // 1. Get the user's Google access token
      // 2. Use Google Business Profile API to fetch data
      // 3. Return the actual business data
      
      const mockBusinessData = {
        accountName: "Premium Promospace",
        businessName: "Premium Promospace - Digital Marketing Agency",
        address: "123 Business Street, Tech City, TC 12345",
        phone: "+1 (555) 123-4567",
        website: "https://premiumpromospace.com",
        rating: 4.8,
        reviewCount: 127,
        views: {
          total: 15420,
          search: 12350,
          maps: 2870,
          photos: 200
        },
        insights: {
          calls: 89,
          directionRequests: 156,
          websiteClicks: 234
        },
        posts: [
          {
            id: "1",
            title: "New Web Development Services",
            content: "We're excited to announce our expanded web development services!",
            publishedAt: "2024-01-15T10:00:00Z",
            views: 450,
            clicks: 23
          },
          {
            id: "2",
            title: "SEO Success Story",
            content: "How we helped a local business increase their search rankings by 300%",
            publishedAt: "2024-01-10T14:30:00Z",
            views: 320,
            clicks: 18
          },
          {
            id: "3",
            title: "Social Media Marketing Tips",
            content: "5 proven strategies to boost your social media engagement",
            publishedAt: "2024-01-05T09:15:00Z",
            views: 280,
            clicks: 15
          }
        ],
        reviews: [
          {
            id: "1",
            author: "Sarah Johnson",
            rating: 5,
            comment: "Excellent service! They helped us increase our online presence significantly.",
            date: "2024-01-20T12:00:00Z"
          },
          {
            id: "2",
            author: "Mike Chen",
            rating: 5,
            comment: "Professional team with great results. Highly recommended!",
            date: "2024-01-18T16:30:00Z"
          },
          {
            id: "3",
            author: "Emily Davis",
            rating: 4,
            comment: "Good work on our website redesign. Very responsive team.",
            date: "2024-01-15T11:45:00Z"
          }
        ]
      };
      
      console.log('Google Business: Returning mock data');
      return res.json(mockBusinessData);
      
    } catch (err: any) {
      console.error('Google Business: API error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      
      return res.status(500).json({ 
        error: 'Failed to fetch business profile', 
        details: err.response?.data || err.message 
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('insights')
  async getBusinessInsights(@Req() req: Request, @Res() res: Response) {
    const user: any = (req as any).user || {};
    const userId = parseInt(user.sub.toString(), 10);
    
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    try {
      // Mock insights data
      const mockInsights = {
        period: "last_30_days",
        metrics: {
          views: {
            total: 15420,
            search: 12350,
            maps: 2870,
            photos: 200,
            trend: "+12.5%"
          },
          actions: {
            calls: 89,
            directionRequests: 156,
            websiteClicks: 234,
            trend: "+8.3%"
          },
          engagement: {
            reviews: 12,
            photos: 8,
            posts: 5,
            trend: "+15.2%"
          }
        },
        topSearchTerms: [
          "digital marketing agency",
          "web development services",
          "SEO optimization",
          "social media marketing",
          "premium promospace"
        ],
        customerDemographics: {
          ageGroups: {
            "18-24": 15,
            "25-34": 35,
            "35-44": 28,
            "45-54": 15,
            "55+": 7
          },
          gender: {
            male: 45,
            female: 55
          }
        }
      };
      
      return res.json(mockInsights);
      
    } catch (err: any) {
      console.error('Google Business Insights: API error:', err);
      return res.status(500).json({ 
        error: 'Failed to fetch business insights', 
        details: err.message 
      });
    }
  }
} 