
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Calendar, BarChart3, Zap } from 'lucide-react';

const SocialMediaFeatureExplanation = () => {
  const features = [
    {
      icon: <MessageCircle className="h-8 w-8 text-blue-500" />,
      title: "Content Creation",
      description: "Generate engaging posts with AI assistance for all your social media platforms."
    },
    {
      icon: <Calendar className="h-8 w-8 text-green-500" />,
      title: "Post Scheduling",
      description: "Schedule your posts in advance and maintain consistent social media presence."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-500" />,
      title: "Analytics & Insights",
      description: "Track your performance across all platforms with detailed analytics and reports."
    },
    {
      icon: <Zap className="h-8 w-8 text-orange-500" />,
      title: "Quick Publishing",
      description: "Publish content instantly to multiple platforms with just one click."
    }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Social Media Management Features</CardTitle>
        <CardDescription>
          Streamline your social media workflow with our comprehensive suite of tools
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 rounded-lg border bg-gray-50">
              {feature.icon}
              <div>
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMediaFeatureExplanation;
