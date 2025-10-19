import { useEffect, useState } from 'react';
import { RefreshCw, Check, Plus } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube,
  MessageCircle
} from 'lucide-react';
import { useSocialAccounts } from '@/hooks/social/useSocialAccounts';

interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  connected: boolean;
  username?: string;
  popular?: boolean;
}

const ConnectSocialMediaSection = () => {
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([
    {
      id: 'telegram',
      name: 'Telegram',
      icon: <MessageCircle className="w-6 h-6" />,
      color: 'bg-blue-500',
      description: 'Connect and manage your Telegram channels',
      connected: true,
      username: '@skilllink_channel'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <Linkedin className="w-6 h-6" />,
      color: 'bg-blue-600',
      description: 'Share professional updates and manage company pages',
      connected: false, // Set to false so Connect button is shown
      username: 'SkillLink Africa',
      popular: true
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: <Youtube className="w-6 h-6" />,
      color: 'bg-red-500',
      description: 'Connect and manage your YouTube channel',
      connected: false, // Set to false so Connect button is shown
      username: 'SkillLink Channel',
      popular: true
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: <Twitter className="w-6 h-6" />,
      color: 'bg-black',
      description: 'Schedule tweets and manage your Twitter presence',
      connected: true,
      username: '@skilllink_africa',
      popular: true
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook className="w-6 h-6" />,
      color: 'bg-blue-500',
      description: 'Manage your Facebook pages and content',
      connected: true,
      username: 'SkillLink Africa',
      popular: true
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram className="w-6 h-6" />,
      color: 'bg-gradient-to-r from-purple-400 to-pink-400',
      description: 'Share photos and stories, manage your Instagram presence',
      connected: true,
      username: '@skilllink_africa',
      popular: true
    }
  ]);

  const [twitterUsername, setTwitterUsername] = useState<string>('');
  const [youtubeChannel, setYoutubeChannel] = useState<string>('');
  const [linkedinName, setLinkedinName] = useState<string>('');

  const { socialAccounts, loadUserSocialAccounts } = useSocialAccounts();

  // Sync platforms state with backend socialAccounts
  useEffect(() => {
    setPlatforms(prev =>
      prev.map(p => {
        const found = socialAccounts.find(acc => acc.platform === p.id);
        return found
          ? { ...p, connected: true, username: found.platform_user_id || p.username }
          : { ...p, connected: false };
      })
    );
  }, [socialAccounts]);

  // Optionally, load social accounts on mount
  useEffect(() => {
    loadUserSocialAccounts();
  }, [loadUserSocialAccounts]);

  // Check for OAuth success parameters and refresh social accounts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const youtubeStatus = urlParams.get('youtube');
    const twitterStatus = urlParams.get('twitter');
    
    if (youtubeStatus === 'connected') {
      console.log('YouTube connected successfully, refreshing social accounts');
      loadUserSocialAccounts();
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (youtubeStatus === 'error') {
      console.log('YouTube connection failed');
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    if (twitterStatus === 'connected') {
      console.log('Twitter connected successfully, refreshing social accounts');
      loadUserSocialAccounts();
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (twitterStatus === 'error') {
      console.log('Twitter connection failed');
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [loadUserSocialAccounts]);

  useEffect(() => {
    // Fetch Twitter username from backend if connected
    const fetchTwitterUsername = async () => {
      try {
        const response = await fetch('https://premium-promospace-production.up.railway.app/user/social-accounts/twitter', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setTwitterUsername(data.username || '');
        }
      } catch (error) {
        setTwitterUsername('');
      }
    };
    // Only fetch if Twitter is connected
    const twitterPlatform = platforms.find(p => p.id === 'twitter');
    if (twitterPlatform?.connected) {
      fetchTwitterUsername();
    }
  }, [platforms]);

  useEffect(() => {
    // Fetch YouTube channel name from backend if connected
    const fetchYoutubeChannel = async () => {
      try {
        const response = await fetch('https://premium-promospace-production.up.railway.app/user/social-accounts/youtube', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setYoutubeChannel(data.channelName || '');
        }
      } catch (error) {
        setYoutubeChannel('');
      }
    };
    const youtubePlatform = platforms.find(p => p.id === 'youtube');
    if (youtubePlatform?.connected) {
      fetchYoutubeChannel();
    }
  }, [platforms]);

  useEffect(() => {
    // Fetch LinkedIn name from backend if connected
    const fetchLinkedinName = async () => {
      try {
        const response = await fetch('https://premium-promospace-production.up.railway.app/user/social-accounts/linkedin', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setLinkedinName(data.name || '');
        }
      } catch (error) {
        setLinkedinName('');
      }
    };
    const linkedinPlatform = platforms.find(p => p.id === 'linkedin');
    if (linkedinPlatform?.connected) {
      fetchLinkedinName();
    }
  }, [platforms]);

  const handleConnect = (platformId: string) => {
    if (platformId === 'twitter') {
      // Redirect to backend Twitter OAuth 2.0 endpoint
      window.location.href = 'https://premium-promospace-production.up.railway.app/auth/twitter2';
      return;
    }
    if (platformId === 'youtube') {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/signin?message=Please login to connect YouTube';
        return;
      }
      
      console.log('Starting YouTube OAuth with token:', token.substring(0, 20) + '...');
      
      // Use window.location.href directly to avoid CORS issues
      const url = `https://premium-promospace-production.up.railway.app/auth/youtube?token=${encodeURIComponent(token)}`;
      console.log('Redirecting to:', url);
      window.location.href = url;
      return;
    }
    if (platformId === 'linkedin') {
      window.location.href = 'https://premium-promospace-production.up.railway.app/auth/linkedin';
      return;
    }
    setPlatforms(platforms.map(platform => 
      platform.id === platformId 
        ? { ...platform, connected: !platform.connected }
        : platform
    ));
  };

  const handleDisconnect = async (platformId: string) => {
    if (platformId === 'twitter' || platformId === 'youtube' || platformId === 'linkedin') {
      try {
        const response = await fetch(`https://premium-promospace-production.up.railway.app/user/social-accounts/${platformId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (response.ok) {
          // Instead of just updating local state, reload from backend
          await loadUserSocialAccounts();
          if (platformId === 'twitter') setTwitterUsername('');
          if (platformId === 'youtube') setYoutubeChannel('');
          if (platformId === 'linkedin') setLinkedinName('');
        }
      } catch (error) {
        // Optionally show error feedback
      }
      return;
    }
    setPlatforms(platforms.map(platform =>
      platform.id === platformId
        ? { ...platform, connected: false, username: '' }
        : platform
    ));
  };

  const connectedCount = platforms.filter(p => p.connected).length;
  const availableCount = platforms.filter(p => !p.connected).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Connect Social Media</h1>
          <p className="text-muted-foreground">Connect and manage your social media accounts</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Connection Status */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50">
        <div className="flex items-center gap-2">
          <Check className="w-5 h-5 text-primary" />
          <span className="font-medium">Connected ({connectedCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-muted-foreground" />
          <span className="text-muted-foreground">Available ({availableCount})</span>
        </div>
      </div>

      {/* Social Media Platforms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((platform) => (
          <Card key={platform.id} className="futuristic-card hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              {/* Platform Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg ${platform.color} flex items-center justify-center text-white`}>
                    {platform.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{platform.name}</h3>
                    {platform.popular && (
                      <Badge variant="secondary" className="text-xs">Popular</Badge>
                    )}
                  </div>
                </div>
                <Badge variant={platform.connected ? "default" : "outline"} className="flex items-center gap-1">
                  {platform.connected ? (
                    <>
                      <Check className="w-3 h-3" />
                      Connected
                    </>
                  ) : (
                    "Available"
                  )}
                </Badge>
              </div>

              {/* Platform Description */}
              <p className="text-sm text-muted-foreground mb-4">
                {platform.description}
              </p>

              {/* Connection Info */}
              {platform.connected ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {platform.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {platform.id === 'twitter' ? (
                          twitterUsername ? `@${twitterUsername}` : 'Connected'
                        ) : platform.id === 'youtube' ? (
                          youtubeChannel ? youtubeChannel : 'Connected'
                        ) : platform.id === 'linkedin' ? (
                          linkedinName ? linkedinName : 'Connected'
                        ) : (
                          platform.username
                        )}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleDisconnect(platform.id)}
                  >
                    Disconnect {platform.name}
                  </Button>
                </div>
              ) : (
                <Button 
                  className="w-full btn-primary"
                  onClick={() => handleConnect(platform.id)}
                >
                  Connect {platform.name}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Connected</p>
                <p className="text-2xl font-bold text-primary">{connectedCount}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold text-primary">{availableCount}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center">
                <Plus className="w-6 h-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Platforms</p>
                <p className="text-2xl font-bold text-primary">{platforms.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-primary">100%</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConnectSocialMediaSection;