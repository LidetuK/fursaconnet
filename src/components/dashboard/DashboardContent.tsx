
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import HashtagResearch from './HashtagResearch';
import PackageFeatures from './PackageFeatures';
import AnalyticsSection from './AnalyticsSection';
import WebDevelopmentSection from './WebDevelopmentSection';
import SEOSection from './SEOSection';
import SocialMediaSection from './SocialMediaSection';
import EmailMarketingSection from './EmailMarketingSection';
import ContentCreationSection from './ContentCreationSection';
import PhotoVideoSection from './PhotoVideoSection';
import ExpertConsultationSection from './ExpertConsultationSection';
import UserProfile from './UserProfile';
import { GoogleBusinessPerformance } from './GoogleBusinessPerformance';
import teamData from '@/components/team/teamData';
import { GoogleAdsConnectButton } from '../google-ads/GoogleAdsConnectButton';
import { YouTubePostSection } from './YouTubePostSection';
import SocialMediaPostSection from './social-media/SocialMediaPostSection';
import UploadVideosSection from './UploadVideosSection';
import UploadContentSection from './UploadContentSection';
import ConnectSocialMediaSection from './ConnectSocialMediaSection';
import MetaAdsSection from './MetaAdsSection';

interface DashboardContentProps {
  activeSection: string;
  packageType: string;
}

const DashboardContent = ({ activeSection, packageType }: DashboardContentProps) => {
  const { user } = useAuth();

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return <UserProfile />;
      case 'hashtags':
        return <HashtagResearch />;
      case 'web-dev':
        return <WebDevelopmentSection packageType={packageType} />;
      case 'seo':
        return <SEOSection packageType={packageType} />;
      case 'social':
        return <SocialMediaSection />;
      case 'email':
        return <EmailMarketingSection packageType={packageType} />;
      case 'content':
        return <ContentCreationSection packageType={packageType} />;
      case 'photo-video':
        return <PhotoVideoSection packageType={packageType} />;
      case 'consultation':
        return <ExpertConsultationSection packageType={packageType} />;
      case 'google-business':
        // Use Google access token from user object
        const googleAccessToken = user?.googleAccessToken;
        return googleAccessToken ? (
          <>
          <GoogleBusinessPerformance accessToken={googleAccessToken} />
            <div className="mt-8">
              <YouTubePostSection />
            </div>
          </>
        ) : (
          <div className="futuristic-card p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-primary">Google Account Required</h3>
                <div className="mt-2 text-sm text-muted-foreground">
                  Please connect your Google account to view business performance data.
                </div>
                <div className="mt-2 text-xs text-muted-foreground/70">
                  User ID: {user?.id} | Google Connected: {googleAccessToken ? 'Yes' : 'No'}
                </div>
              </div>
            </div>
          </div>
        );
      case 'posts':
        return <YouTubePostSection />;
      case 'upload-videos':
        return <UploadVideosSection />;
      case 'upload-content':
        return <UploadContentSection />;
      case 'connect-social-media':
        return <ConnectSocialMediaSection />;
      case 'google-ads':
        return (
          <div className="futuristic-card p-8 text-center">
            <h2 className="text-2xl font-bold gradient-text mb-4">Google Ads Management</h2>
            <p className="text-muted-foreground">Coming soon - Advanced Google Ads integration</p>
          </div>
        );
      case 'meta-ads':
        return <MetaAdsSection />;
      case 'dashboard':
        return (
          <>
            <AnalyticsSection packageType={packageType} />
            <div className="mt-8">
              <PackageFeatures packageType={packageType} />
            </div>
          </>
        );
      default:
        return (
          <>
            <AnalyticsSection packageType={packageType} />
            <div className="mt-8">
              <PackageFeatures packageType={packageType} />
            </div>
          </>
        );
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6 futuristic-grid">
      <div 
        className="glass-card p-1 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--primary))/20, hsl(var(--primary))/5)',
          boxShadow: '0 8px 32px hsl(var(--primary))/10'
        }}
      >
        <div className="bg-card/90 backdrop-blur-xl rounded-2xl p-6">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
