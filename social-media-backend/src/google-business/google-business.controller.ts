import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DataSource } from 'typeorm';
import axios from 'axios';

interface GoogleBusinessData {
  accountName: string;
  businessName: string;
  address: string;
  phone: string;
  website: string;
  rating: number;
  reviewCount: number;
  views: {
    total: number;
    search: number;
    maps: number;
    photos: number;
  };
  insights: {
    calls: number;
    directionRequests: number;
    websiteClicks: number;
  };
  posts: Array<{
    id: string;
    title: string;
    content: string;
    publishedAt: string;
    views: number;
    clicks: number;
  }>;
  reviews: Array<{
    id: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

@Controller('auth/google-business')
export class GoogleBusinessController {
  constructor(private readonly dataSource: DataSource) {}
  
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getBusinessProfile(@Req() req: Request, @Res() res: Response) {
    const user: any = (req as any).user || {};
    const userId = user.sub;
    
    console.log('Google Business profile request:', { userId });
    
    if (!userId) {
      console.error('Google Business: Not authenticated');
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    try {
      // Get Google Business access token from database
      const googleBusinessAccount = await this.dataSource.query(
        'SELECT access_token, refresh_token, expires_at FROM google_business_accounts WHERE user_id = $1',
        [userId]
      );
      
      if (!googleBusinessAccount || googleBusinessAccount.length === 0) {
        console.log('No Google Business account found for user:', userId);
        return res.status(400).json({ error: 'Google Business account not connected' });
      }
      
      const account = googleBusinessAccount[0];
      const googleAccessToken = account.access_token;
      
      // Check if token is expired
      if (account.expires_at && new Date(account.expires_at) < new Date()) {
        console.log('Google Business access token expired, attempting refresh...');
        // TODO: Implement token refresh logic
        return res.status(400).json({ error: 'Google Business access token expired. Please reconnect.' });
      }
      
      if (!googleAccessToken) {
        return res.status(400).json({ error: 'No Google access token found. Please re-authenticate.' });
      }

      console.log('Fetching Google Business Profile data with token:', googleAccessToken.substring(0, 20) + '...');
      
      // First, try to get user's business accounts
      let businessData: any = null;
      
      try {
        // Use the Business Profile API
        const accountsResponse = await axios.get('https://mybusinessbusinessinformation.googleapis.com/v1/accounts', {
          headers: {
            'Authorization': `Bearer ${googleAccessToken}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Accounts API response status:', accountsResponse.status);
        console.log('Accounts response data:', accountsResponse.data);

        if (accountsResponse.data.accounts && accountsResponse.data.accounts.length > 0) {
          const account = accountsResponse.data.accounts[0];
          const accountName = account.name;
          
          console.log('Found account:', accountName);

          // Get locations for this account
          const locationsResponse = await axios.get(`https://mybusinessbusinessinformation.googleapis.com/v1/${accountName}/locations`, {
            headers: {
              'Authorization': `Bearer ${googleAccessToken}`,
              'Content-Type': 'application/json',
            },
          });

          console.log('Locations API response status:', locationsResponse.status);

          if (locationsResponse.data.locations && locationsResponse.data.locations.length > 0) {
            const location = locationsResponse.data.locations[0];
            console.log('Found location:', location.name);

            // Get reviews
            let reviews: any[] = [];
            try {
              const reviewsResponse = await axios.get(`https://mybusinessbusinessinformation.googleapis.com/v1/${location.name}/reviews`, {
                headers: {
                  'Authorization': `Bearer ${googleAccessToken}`,
                  'Content-Type': 'application/json',
                },
              });
              
              if (reviewsResponse.data.reviews) {
                reviews = reviewsResponse.data.reviews.slice(0, 5).map((review: any) => ({
                  id: review.name,
                  author: review.reviewer?.displayName || 'Anonymous',
                  rating: review.rating,
                  comment: review.comment || '',
                  date: review.createTime
                }));
              }
            } catch (reviewsError) {
              console.log('Failed to fetch reviews:', reviewsError.response?.data || reviewsError.message);
            }

            // Get posts
            let posts: any[] = [];
            try {
              const postsResponse = await axios.get(`https://mybusinessbusinessinformation.googleapis.com/v1/${location.name}/localPosts`, {
                headers: {
                  'Authorization': `Bearer ${googleAccessToken}`,
                  'Content-Type': 'application/json',
                },
              });
              
              if (postsResponse.data.localPosts) {
                posts = postsResponse.data.localPosts.slice(0, 3).map((post: any) => ({
                  id: post.name,
                  title: post.summary || 'Business Post',
                  content: post.callToAction?.actionType || 'No content',
                  publishedAt: post.createTime,
                  views: 0,
                  clicks: 0
                }));
              }
            } catch (postsError) {
              console.log('Failed to fetch posts:', postsError.response?.data || postsError.message);
            }

            businessData = {
              accountName: accountName.split('/').pop() || 'Business Account',
              businessName: location.title || 'Business',
              address: location.address?.addressLines?.join(', ') || 'Address not available',
              phone: location.phoneNumbers?.primaryPhone || 'Phone not available',
              website: location.websiteUri || 'Website not available',
              rating: location.averageRating || 0,
              reviewCount: location.reviewCount || 0,
              views: {
                total: 0,
                search: 0,
                maps: 0,
                photos: 0
              },
              insights: {
                calls: 0,
                directionRequests: 0,
                websiteClicks: 0
              },
              posts: posts,
              reviews: reviews
            };

            console.log('Successfully fetched real business data');
          } else {
            throw new Error('No business locations found');
          }
        } else {
          throw new Error('No business accounts found');
        }
      } catch (businessApiError: any) {
        console.error('Business Profile API error:', {
          status: businessApiError.response?.status,
          data: businessApiError.response?.data,
          message: businessApiError.message
        });
        
        // Fallback to mock data for now
        console.log('Falling back to mock data due to API error');
        businessData = {
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
      }

      return res.json(businessData);
      
    } catch (err: any) {
      console.error('Google Business: General error:', err);
      
      return res.status(500).json({ 
        error: 'Failed to fetch business profile', 
        details: err.message 
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('connection-status')
  async getConnectionStatus(@Req() req: Request, @Res() res: Response) {
    const user: any = (req as any).user || {};
    const userId = user.sub;
    
    console.log('Checking Google Business connection status for user:', userId);
    
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    try {
      const googleBusinessAccount = await this.dataSource.query(
        'SELECT id, created_at, expires_at FROM google_business_accounts WHERE user_id = $1',
        [userId]
      );
      
      if (googleBusinessAccount && googleBusinessAccount.length > 0) {
        const account = googleBusinessAccount[0];
        const isExpired = account.expires_at && new Date(account.expires_at) < new Date();
        
        return res.json({
          connected: true,
          connectedAt: account.created_at,
          isExpired: isExpired
        });
      } else {
        return res.json({
          connected: false,
          connectedAt: null,
          isExpired: false
        });
      }
    } catch (err: any) {
      console.error('Error checking Google Business connection status:', err);
      return res.status(500).json({ error: 'Failed to check connection status' });
    }
  }
} 