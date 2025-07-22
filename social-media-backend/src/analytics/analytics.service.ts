import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AnalyticsService {
  constructor(private readonly dataSource: DataSource) {}

  generateTrackingId(): string {
    // Generate a unique tracking ID (similar to Google Analytics)
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    return `GA_${timestamp}_${random}`.toUpperCase();
  }

  generateTrackingScript(trackingId: string): string {
    return `<!-- Premium Promospace Analytics Tracking Script -->
<script>
(function() {
  // Initialize analytics
  window.PremiumAnalytics = window.PremiumAnalytics || {};
  window.PremiumAnalytics.trackingId = '${trackingId}';
  window.PremiumAnalytics.endpoint = 'https://premium-promospace-production.up.railway.app/analytics/track/${trackingId}';
  
  // Track page view
  function trackPageView() {
    const eventData = {
      eventType: 'pageview',
      pageUrl: window.location.href,
      pageTitle: document.title,
      timestamp: new Date().toISOString()
    };
    
    fetch(window.PremiumAnalytics.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData)
    }).catch(console.error);
  }
  
  // Track custom events
  window.PremiumAnalytics.track = function(eventName, eventData = {}) {
    const data = {
      eventType: eventName,
      eventData: eventData,
      pageUrl: window.location.href,
      timestamp: new Date().toISOString()
    };
    
    fetch(window.PremiumAnalytics.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }).catch(console.error);
  };
  
  // Track form submissions
  document.addEventListener('submit', function(e) {
    if (e.target.tagName === 'FORM') {
      window.PremiumAnalytics.track('form_submit', {
        formId: e.target.id || e.target.className,
        formAction: e.target.action
      });
    }
  });
  
  // Track button clicks
  document.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
      window.PremiumAnalytics.track('button_click', {
        elementId: e.target.id,
        elementText: e.target.textContent?.trim(),
        elementType: e.target.tagName.toLowerCase()
      });
    }
  });
  
  // Track scroll depth
  let maxScroll = 0;
  window.addEventListener('scroll', function() {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
      if (maxScroll % 25 === 0) { // Track every 25% scroll
        window.PremiumAnalytics.track('scroll_depth', {
          depth: maxScroll
        });
      }
    }
  });
  
  // Track time on page
  let startTime = Date.now();
  window.addEventListener('beforeunload', function() {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    window.PremiumAnalytics.track('time_on_page', {
      seconds: timeOnPage
    });
  });
  
  // Initial page view
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackPageView);
  } else {
    trackPageView();
  }
})();
</script>`;
  }

  async getAnalyticsData(trackingId: string) {
    try {
      // Get basic metrics
      const pageViews = await this.dataSource.query(
        `SELECT COUNT(*) as count FROM analytics_events WHERE tracking_id = $1 AND event_type = 'pageview'`,
        [trackingId]
      );

      const uniqueVisitors = await this.dataSource.query(
        `SELECT COUNT(DISTINCT ip_address) as count FROM analytics_events WHERE tracking_id = $1`,
        [trackingId]
      );

      const recentActivity = await this.dataSource.query(
        `SELECT event_type, COUNT(*) as count 
         FROM analytics_events 
         WHERE tracking_id = $1 
         AND created_at >= NOW() - INTERVAL '24 hours'
         GROUP BY event_type`,
        [trackingId]
      );

      const topPages = await this.dataSource.query(
        `SELECT page_url, COUNT(*) as views 
         FROM analytics_events 
         WHERE tracking_id = $1 AND event_type = 'pageview'
         GROUP BY page_url 
         ORDER BY views DESC 
         LIMIT 10`,
        [trackingId]
      );

      return {
        pageViews: pageViews[0]?.count || 0,
        uniqueVisitors: uniqueVisitors[0]?.count || 0,
        recentActivity,
        topPages
      };
    } catch (error) {
      console.error('Error getting analytics data:', error);
      return {
        pageViews: 0,
        uniqueVisitors: 0,
        recentActivity: [],
        topPages: []
      };
    }
  }

  async generateAnalyticsReport(trackingId: string) {
    try {
      // Get comprehensive analytics data
      const basicMetrics = await this.getAnalyticsData(trackingId);
      
      // Get user segmentation data
      const userSegmentation = await this.dataSource.query(
        `SELECT 
           CASE 
             WHEN COUNT(*) >= 10 THEN 'Power User'
             WHEN COUNT(*) >= 5 THEN 'Regular User'
             ELSE 'New User'
           END as segment,
           COUNT(*) as user_count
         FROM (
           SELECT ip_address, COUNT(*) as event_count
           FROM analytics_events 
           WHERE tracking_id = $1
           GROUP BY ip_address
         ) user_events
         GROUP BY segment`,
        [trackingId]
      );

      // Get conversion events
      const conversions = await this.dataSource.query(
        `SELECT event_type, COUNT(*) as count
         FROM analytics_events 
         WHERE tracking_id = $1 
         AND event_type IN ('form_submit', 'button_click', 'generate_lead')
         GROUP BY event_type`,
        [trackingId]
      );

      // Get time-based data
      const hourlyData = await this.dataSource.query(
        `SELECT 
           EXTRACT(HOUR FROM created_at) as hour,
           COUNT(*) as events
         FROM analytics_events 
         WHERE tracking_id = $1 
         AND created_at >= NOW() - INTERVAL '7 days'
         GROUP BY hour
         ORDER BY hour`,
        [trackingId]
      );

      // Generate recommendations
      const recommendations = this.generateRecommendations(basicMetrics, conversions);

      return {
        basicMetrics,
        userSegmentation,
        conversions,
        hourlyData,
        recommendations,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating analytics report:', error);
      return {
        basicMetrics: { pageViews: 0, uniqueVisitors: 0, recentActivity: [], topPages: [] },
        userSegmentation: [],
        conversions: [],
        hourlyData: [],
        recommendations: [],
        generatedAt: new Date().toISOString()
      };
    }
  }

  private generateRecommendations(basicMetrics: any, conversions: any[]) {
    const recommendations: Array<{
      type: string;
      title: string;
      description: string;
      priority: string;
    }> = [];

    // Page views recommendation
    if (basicMetrics.pageViews > 0) {
      recommendations.push({
        type: 'page_views',
        title: 'Page Views Analysis',
        description: `Your website has ${basicMetrics.pageViews} total page views. Consider implementing A/B testing to improve conversion rates.`,
        priority: 'medium'
      });
    }

    // Conversion tracking recommendation
    const hasConversions = conversions.some(c => c.count > 0);
    if (!hasConversions) {
      recommendations.push({
        type: 'conversion_tracking',
        title: 'Set Up Conversion Tracking',
        description: 'No conversion events detected. Add tracking for form submissions, button clicks, and other key actions.',
        priority: 'high'
      });
    }

    // User engagement recommendation
    if (basicMetrics.uniqueVisitors > 0 && basicMetrics.pageViews / basicMetrics.uniqueVisitors < 2) {
      recommendations.push({
        type: 'engagement',
        title: 'Improve User Engagement',
        description: 'Low pages per session. Consider adding internal links and improving content to keep users engaged.',
        priority: 'medium'
      });
    }

    return recommendations;
  }
} 