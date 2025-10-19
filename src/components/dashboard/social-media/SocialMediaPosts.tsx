
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Eye, Heart, MessageCircle } from 'lucide-react';

const SocialMediaPosts = () => {
  const recentPosts = [
    {
      id: 1,
      content: "Excited to share our latest web development project! 🚀",
      platform: "Twitter",
      publishedAt: "2 hours ago",
      metrics: {
        views: 1250,
        likes: 45,
        comments: 8,
        shares: 12
      },
      status: "published"
    },
    {
      id: 2,
      content: "Check out our comprehensive guide to SEO optimization...",
      platform: "LinkedIn",
      publishedAt: "1 day ago",
      metrics: {
        views: 2100,
        likes: 78,
        comments: 15,
        shares: 23
      },
      status: "published"
    },
    {
      id: 3,
      content: "Behind the scenes of our latest digital marketing campaign",
      platform: "Instagram",
      publishedAt: "3 days ago",
      metrics: {
        views: 890,
        likes: 156,
        comments: 24,
        shares: 8
      },
      status: "published"
    }
  ];

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter':
        return 'bg-blue-500';
      case 'linkedin':
        return 'bg-blue-700';
      case 'instagram':
        return 'bg-pink-500';
      case 'facebook':
        return 'bg-blue-600';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Recent Posts & Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentPosts.map((post) => (
            <div key={post.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <Badge className={`${getPlatformColor(post.platform)} text-white`}>
                    {post.platform}
                  </Badge>
                  <span className="text-sm text-gray-500">{post.publishedAt}</span>
                </div>
                <Badge variant="outline" className="text-green-600">
                  {post.status}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-800 mb-3">{post.content}</p>
              
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4 text-gray-500" />
                  <span>{post.metrics.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span>{post.metrics.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  <span>{post.metrics.comments}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">↗</span>
                  <span>{post.metrics.shares}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMediaPosts;
