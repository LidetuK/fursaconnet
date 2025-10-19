
import { Heart, MessageCircle, Share2 } from 'lucide-react';

interface SocialPostProps {
  platform: string;
  imageUrl: string;
  content: string;
  author: string;
  date: string;
  likes: number;
  link: string;
}

const SocialPost = ({ platform, imageUrl, content, author, date, likes, link }: SocialPostProps) => {
  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return 'text-blue-600';
      case 'instagram':
        return 'text-pink-600';
      case 'twitter':
        return 'text-blue-400';
      case 'linkedin':
        return 'text-blue-700';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square w-full">
        <img 
          src={imageUrl} 
          alt={`${platform} post`}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-semibold ${getPlatformColor(platform)}`}>
              {platform}
            </span>
            <span className="text-gray-500 text-sm">•</span>
            <span className="text-gray-500 text-sm">{date}</span>
          </div>
        </div>
        
        <p className="text-gray-800 text-sm mb-3 line-clamp-3">{content}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Heart size={16} className="text-red-500" />
              <span className="text-sm text-gray-600">{likes}</span>
            </div>
            <MessageCircle size={16} className="text-gray-500" />
            <Share2 size={16} className="text-gray-500" />
          </div>
          
          <a 
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-skilllink-green hover:text-skilllink-dark-green text-sm font-medium"
          >
            View Post
          </a>
        </div>
      </div>
    </div>
  );
};

export default SocialPost;
