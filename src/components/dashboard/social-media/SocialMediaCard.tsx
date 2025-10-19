
import { useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

interface SocialMediaCardProps {
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin';
  connected: boolean;
  username: string;
  loading?: boolean;
  onConnect: (platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin') => void;
  onDisconnect: (platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin') => void;
}

export const SocialMediaCard = ({ 
  platform, 
  connected, 
  username, 
  loading, 
  onConnect, 
  onDisconnect 
}: SocialMediaCardProps) => {
  
  const getPlatformIcon = (platform: string, size = 20) => {
    switch (platform) {
      case 'facebook':
        return <Facebook size={size} className="text-[#4267B2]" />;
      case 'instagram':
        return <Instagram size={size} className="text-[#E1306C]" />;
      case 'twitter':
        return <Twitter size={size} className="text-[#1DA1F2]" />;
      case 'linkedin':
        return <Linkedin size={size} className="text-[#0077B5]" />;
      default:
        return null;
    }
  };

  return (
    <Card key={platform} className="overflow-hidden">
      <CardHeader className={`py-3 ${connected ? 'bg-green-50' : 'bg-gray-50'}`}>
        <div className="flex items-center space-x-2">
          {getPlatformIcon(platform)}
          <span className="font-medium capitalize">{platform}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col h-24 justify-between">
          <div>
            {connected ? (
              <div className="text-sm mb-2">
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium mb-1">
                  Connected
                </span>
                <p className="text-gray-700">
                  Connected as <span className="font-medium">{username}</span>
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-2">Not connected</p>
            )}
          </div>
          
          <Button 
            variant={connected ? "outline" : "default"}
            size="sm"
            className={connected ? "border-red-300 text-red-700 hover:bg-red-50" : "bg-skilllink-green hover:bg-skilllink-dark-green"}
            onClick={() => connected ? onDisconnect(platform) : onConnect(platform)}
            disabled={loading}
          >
            {loading ? "Connecting..." : connected ? "Disconnect" : "Connect"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
