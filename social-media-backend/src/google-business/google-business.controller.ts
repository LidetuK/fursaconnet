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
      // Get Google access token from JWT
      const googleAccessToken = user.googleAccessToken;
      if (!googleAccessToken) {
        return res.status(400).json({ error: 'No Google access token found. Please re-authenticate.' });
      }

      console.log('Fetching Google Business Profile data with token:', googleAccessToken.substring(0, 20) + '...');
      
      // First, try to get user's business accounts
      let businessData = null;
      
      try {
        // Use the newer Business Profile API
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
          console.log('Locations response data:', locationsResponse.data);

          if (locationsResponse.data.locations && locationsResponse.data.locations.length > 0) {
            const location = locationsResponse.data.locations[0];
            console.log('Found location:', location.name);

            // Get reviews
            let reviews = [];
            try {
              const reviewsResponse = await axios.get(`https://mybusinessbusinessinformation.googleapis.com/v1/${location.name}/reviews`, {
                headers: {
                  'Authorization': `Bearer ${googleAccessToken}`,
                  'Content-Type': 'application/json',
                },
              });
              
              console.log('Reviews API response status:', reviewsResponse.status);
              
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
            let posts = [];
            try {
              const postsResponse = await axios.get(`https://mybusinessbusinessinformation.googleapis.com/v1/${location.name}/localPosts`, {
                headers: {
                  'Authorization': `Bearer ${googleAccessToken}`,
                  'Content-Type': 'application/json',
                },
              });
              
              console.log('Posts API response status:', postsResponse.status);
              
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

            // Try to get insights using the correct API
            let insights = { calls: 0, directionRequests: 0, websiteClicks: 0 };
            try {
              // Use the Business Profile API for insights
              const insightsResponse = await axios.get(`https://mybusinessbusinessinformation.googleapis.com/v1/${location.name}/insights`, {
                headers: {
                  'Authorization': `Bearer ${googleAccessToken}`,
                  'Content-Type': 'application/json',
                },
                params: {
                  locationNames: location.name,
                  basicRequest: {
                    metricRequests: [
                      { metric: 'QUERIES_DIRECT' },
                      { metric: 'QUERIES_INDIRECT' },
                      { metric: 'VIEWS_MAPS' },
                      { metric: 'VIEWS_SEARCH' },
                      { metric: 'ACTIONS_WEBSITE' },
                      { metric: 'ACTIONS_PHONE' },
                      { metric: 'ACTIONS_DRIVING_DIRECTIONS' }
                    ],
                    timeRange: {
                      startTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                      endTime: new Date().toISOString()
                    }
                  }
                }
              });
              
              console.log('Insights API response status:', insightsResponse.status);
              
              if (insightsResponse.data.locationMetrics && insightsResponse.data.locationMetrics.length > 0) {
                const metrics = insightsResponse.data.locationMetrics[0].metricValues;
                insights = {
                  calls: metrics.find((m: any) => m.metric === 'ACTIONS_PHONE')?.dimensionalValues?.[0]?.value || 0,
                  directionRequests: metrics.find((m: any) => m.metric === 'ACTIONS_DRIVING_DIRECTIONS')?.dimensionalValues?.[0]?.value || 0,
                  websiteClicks: metrics.find((m: any) => m.metric === 'ACTIONS_WEBSITE')?.dimensionalValues?.[0]?.value || 0
                };
              }
            } catch (insightsError) {
              console.log('Failed to fetch insights:', insightsError.response?.data || insightsError.message);
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
              insights: insights,
              posts: posts,
              reviews: reviews
            };

            console.log('Successfully fetched real business data:', businessData);
          } else {
            console.log('No locations found for account');
            throw new Error('No business locations found');
          }
        } else {
          console.log('No business accounts found');
          throw new Error('No business accounts found');
        }
      } catch (apiError: any) {
        console.error('Google Business API error:', {
          status: apiError.response?.status,
          data: apiError.response?.data,
          message: apiError.message
        });
        
        // Return error with details for debugging
        return res.status(500).json({ 
          error: 'Failed to fetch business profile from Google API', 
          details: apiError.response?.data || apiError.message,
          apiStatus: apiError.response?.status
        });
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