import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SocialMediaFeatureExplanation from './SocialMediaFeatureExplanation';
import { SocialMediaCard } from './SocialMediaCard';
import { useSocialMediaConnections } from '@/hooks/useSocialMediaConnections';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSocialAccounts } from '@/hooks/social/useSocialAccounts';
import SocialMediaPostSection from './SocialMediaPostSection';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { GoogleAdsConnectButton } from '@/components/google-ads/GoogleAdsConnectButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const SocialMediaConnector = () => {
  console.log('SocialMediaConnector rendered');
  const location = useLocation();
  const { socialAccounts, loadUserSocialAccounts } = useSocialAccounts();
  const {
    connectAccount,
    disconnectAccount,
    checkConnectionStatus
  } = useSocialMediaConnections();
  const { startGoogleLogin } = useGoogleAuth();
  const { user } = useAuth();
  const [telegramModalOpen, setTelegramModalOpen] = useState(false);
  const [telegramUsername, setTelegramUsername] = useState('');
  const [telegramConnecting, setTelegramConnecting] = useState(false);
  const [telegramConnected, setTelegramConnected] = useState(false); // false by default
  const [telegramUsernameDisplay, setTelegramUsernameDisplay] = useState(''); // empty by default

  // Platforms to show in the UI
  const platforms = [
    { platform: 'facebook', label: 'Facebook' },
    { platform: 'instagram', label: 'Instagram' },
    { platform: 'twitter', label: 'Twitter' },
    { platform: 'linkedin', label: 'LinkedIn' },
    { platform: 'telegram', label: 'Telegram' },
  ];

  useEffect(() => {
    if (location.hash === '#social') {
      console.log('Social hash detected, refreshing social accounts');
      loadUserSocialAccounts();
      checkConnectionStatus();
      window.history.replaceState(
        {},
        document.title,
        location.pathname
      );
    }
  }, [location.hash, loadUserSocialAccounts, checkConnectionStatus]);

  // Map backend socialAccounts to UI state for cards
  const getAccountStatus = (platform: string) => {
    if (platform === 'telegram') {
      return {
        connected: telegramConnected,
        username: telegramUsernameDisplay,
      };
    }
    const found = socialAccounts.find(acc => acc.platform === platform);
    return {
      connected: !!found,
      username: found?.platform_user_id || '',
    };
  };

  // Telegram connect handler
  const handleTelegramConnect = () => {
    console.log('Telegram Connect button clicked');
    setTelegramModalOpen(true);
  };

  // Telegram disconnect handler
  const handleTelegramDisconnect = () => {
    setTelegramConnected(false);
    setTelegramUsernameDisplay('');
    // Optionally, call backend to remove connection
  };

  // Submit Telegram username to backend
  const submitTelegramUsername = async () => {
    console.log('Submitting Telegram username:', telegramUsername);
    if (!user || !telegramUsername.trim()) return;
    setTelegramConnecting(true);
    try {
      const res = await fetch('https://fursaconnet-production.up.railway.app/telegram/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, chatId: telegramUsername.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setTelegramConnected(true);
        setTelegramUsernameDisplay(telegramUsername.trim());
        setTelegramModalOpen(false);
      } else {
        alert(data.error || 'Failed to connect Telegram');
      }
    } catch (e) {
      alert('Failed to connect Telegram');
    } finally {
      setTelegramConnecting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Social Media Integration</CardTitle>
        <CardDescription>
          Connect your social media accounts to schedule and publish content directly from our platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {platforms.map(({ platform, label }) => {
              const { connected, username } = getAccountStatus(platform);
              if (platform === 'telegram') {
                return (
                  <div key={platform} className="flex flex-col items-center justify-between border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" alt="Telegram" className="w-6 h-6" />
                      <span className="font-medium">Telegram</span>
                    </div>
                    {connected ? (
                      <div className="text-sm mb-2 text-green-700">Connected as <span className="font-medium">{username}</span></div>
                    ) : (
                      <p className="text-sm text-gray-500 mb-2">Not connected</p>
                    )}
                    <Button
                      variant={connected ? 'outline' : 'default'}
                      size="sm"
                      className={connected ? 'border-red-300 text-red-700 hover:bg-red-50' : 'bg-skilllink-green hover:bg-skilllink-dark-green'}
                      onClick={connected ? handleTelegramDisconnect : handleTelegramConnect}
                      disabled={telegramConnecting}
                    >
                      {telegramConnecting ? 'Connecting...' : connected ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                );
              }
              return (
                <SocialMediaCard
                  key={platform}
                  platform={platform as "facebook" | "instagram" | "twitter" | "linkedin"}
                  connected={connected}
                  username={username}
                  onConnect={connectAccount}
                  onDisconnect={disconnectAccount}
                />
              );
            })}
            {/* Google Ads connect card (replaces Google login card) */}
            <div className="flex flex-col items-center justify-between border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google Ads" className="w-6 h-6" />
                <span className="font-medium">Google Ads</span>
              </div>
              <p className="text-sm text-gray-500 mb-2">Connect your Google Ads account</p>
              <GoogleAdsConnectButton />
            </div>
            {/* YouTube connect card */}
            <div className="flex flex-col items-center justify-between border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" alt="YouTube" className="w-10 h-6" />
                <span className="font-medium">YouTube</span>
              </div>
              <p className="text-sm text-gray-500 mb-2">Connect your YouTube account</p>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                onClick={async () => {
                  const token = localStorage.getItem('token');
                  if (!token) {
                    window.location.href = '/signin?message=Please login to connect YouTube';
                    return;
                  }
                  
                  console.log('Starting YouTube OAuth with token:', token.substring(0, 20) + '...');
                  
                  // Use window.location.href directly to avoid CORS issues
                  const url = `https://fursaconnet-production.up.railway.app/auth/youtube?token=${encodeURIComponent(token)}`;
                  console.log('Redirecting to:', url);
                  window.location.href = url;
                }}
              >
                Connect YouTube
              </button>
            </div>
          </div>
        {/* Removed <SocialMediaPostSection /> from here */}
      </CardContent>
      {/* Telegram Connect Modal */}
      <Dialog open={telegramModalOpen} onOpenChange={setTelegramModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Telegram Channel</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <p className="mb-2">Add <b>@skillinkpremiumbot</b> as an admin to your Telegram channel, then enter your <b>@channel_username</b> below:</p>
            <Input
              placeholder="@yourchannelusername"
              value={telegramUsername}
              onChange={e => setTelegramUsername(e.target.value)}
              disabled={telegramConnecting}
            />
          </div>
          <DialogFooter>
            <Button onClick={submitTelegramUsername} disabled={telegramConnecting || !telegramUsername.trim()}>
              {telegramConnecting ? 'Connecting...' : 'Connect'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SocialMediaConnector;
