
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardContent from '@/components/dashboard/DashboardContent';
import AIAssistant from '@/components/AIAssistant/AIAssistant';
import { dashboardServices } from '@/components/dashboard/DashboardServices';
import { useDashboardState } from '@/hooks/useDashboardState';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user, userType } = useAuth();
  const { packageType, activeSection, setActiveSection } = useDashboardState();
  const navigate = useNavigate();

  // Debug authentication status
  console.log('Dashboard rendered - Auth status:', {
    user: user ? 'Logged in' : 'Not logged in',
    userType,
    localStorage: {
      token: localStorage.getItem('token') ? 'Present' : 'Missing',
      user: localStorage.getItem('user') ? 'Present' : 'Missing'
    },
    cookies: document.cookie
  });

  // Check for OAuth success parameters and refresh the page
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const youtubeStatus = urlParams.get('youtube');
    const twitterStatus = urlParams.get('twitter');
    const token = urlParams.get('token');
    
    // Handle token from OAuth callback
    if (token) {
      console.log('Token received from OAuth callback, storing in localStorage');
      localStorage.setItem('token', token);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Force a page refresh to update authentication state
      window.location.reload();
      return;
    }
    
    if (youtubeStatus === 'connected' || youtubeStatus === 'error') {
      console.log(`YouTube OAuth ${youtubeStatus}, refreshing page to update status`);
      // Clean up the URL first
      window.history.replaceState({}, document.title, window.location.pathname);
      // Force a page refresh to update all components
      window.location.reload();
    }
    
    if (twitterStatus === 'connected' || twitterStatus === 'error') {
      console.log(`Twitter OAuth ${twitterStatus}, refreshing page to update status`);
      // Clean up the URL first
      window.history.replaceState({}, document.title, window.location.pathname);
      // Force a page refresh to update all components
      window.location.reload();
    }
  }, []);

  // Quick fix: Sync Google access token from backend to Supabase
  useEffect(() => {
    if (user) {
      fetch('https://premium-promospace-production.up.railway.app/auth/google/get-token', {
        method: 'GET',
        credentials: 'include',
      })
        .then(res => res.json())
        .then(async data => {
          if (data.googleAccessToken) {
            await supabase.from('social_accounts').upsert({
              user_id: user.id,
              platform: 'google',
              access_token: data.googleAccessToken,
            }, { onConflict: 'user_id,platform' });
          }
        });
    }
  }, [user]);
  
  // If not authenticated, redirect to auth page
  if (!user) {
    return <Navigate to="/signin" />;
  }

  // Redirect admin users to admin dashboard
  if (userType === 'admin') {
    return <Navigate to="/admin-dashboard" />;
  }

  // Regular users can access this dashboard
  return (
    <div className="flex h-screen bg-background futuristic-grid">
      {/* Sidebar */}
      <DashboardSidebar 
        services={dashboardServices} 
        packageType="enterprise" // Temporarily set to enterprise to give all users access to all features
        onSectionChange={setActiveSection}
        activeSection={activeSection}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader packageType={packageType || "enterprise"} />
        
        <main className="flex-1 overflow-y-auto">
          <DashboardContent 
            activeSection={activeSection}
            packageType="enterprise" // Temporarily set to enterprise to give all users access to all features
          />
        </main>
      </div>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
};

export default Dashboard;
