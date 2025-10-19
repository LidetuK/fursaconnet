
import { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, RefreshCw, Plus, Eye, MessageSquare, ThumbsUp, Share2 } from 'lucide-react';
import SectionChatbot from './SectionChatbot';
import { Button } from "@/components/ui/button";
import TrackingScriptModal from './TrackingScriptModal';

interface AnalyticsSectionProps {
  packageType: string;
}

const AnalyticsSection = ({ packageType }: AnalyticsSectionProps) => {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  
  // Mock data for charts
  const websiteTrafficData = [
    { name: 'Jan', visitors: 4000, pageViews: 2400 },
    { name: 'Feb', visitors: 3000, pageViews: 1398 },
    { name: 'Mar', visitors: 2000, pageViews: 9800 },
    { name: 'Apr', visitors: 2780, pageViews: 3908 },
    { name: 'May', visitors: 1890, pageViews: 4800 },
    { name: 'Jun', visitors: 2390, pageViews: 3800 },
    { name: 'Jul', visitors: 3490, pageViews: 4300 },
  ];
  
  const socialMediaData = [
    { name: 'Facebook', value: 400 },
    { name: 'Instagram', value: 300 },
    { name: 'Twitter', value: 300 },
    { name: 'LinkedIn', value: 200 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  const conversionData = [
    { name: 'Landing Page', value: 1000 },
    { name: 'Product Page', value: 700 },
    { name: 'Checkout', value: 400 },
    { name: 'Purchase', value: 200 },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#f59e3e]">Website Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your website performance with custom analytics</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-500">Real-time tracking enabled</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button 
            className="bg-[#f59e3e] hover:bg-[#e8913a] text-white"
            onClick={() => setTrackingModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate Tracking Script
          </Button>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2K</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <span className="flex items-center">↑ 8.1%</span>
              <span className="text-gray-400 ml-1">vs last month</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Users (30min)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <span className="flex items-center">↑ 2</span>
              <span className="text-gray-400 ml-1">from Nairobi</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Bounce Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">17%</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <span className="flex items-center">↓ 10.4%</span>
              <span className="text-gray-400 ml-1">vs last month</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg. Session Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2m 34s</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <span className="flex items-center">↑ 8%</span>
              <span className="text-gray-400 ml-1">vs last month</span>
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pages">Page Performance</TabsTrigger>
          <TabsTrigger value="users">User Segmentation</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Website Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Home Page Performance</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Page Views:</span>
                      <span className="font-bold">4.2K (8.1% increase)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bounce Rate:</span>
                      <span className="font-bold text-green-600">17% (10.4% decrease)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg. Time on Page:</span>
                      <span className="font-bold">2m 34s</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">User Activity</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Active Users (30min):</span>
                      <span className="font-bold">9 users</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-bold">Nairobi</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Page Views per Session:</span>
                      <span className="font-bold">3.2</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pages" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Page Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800">Home Page</h4>
                    <p className="text-2xl font-bold text-blue-600">4.2K views</p>
                    <p className="text-sm text-blue-500">↑ 8.1% increase</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800">Contact Page</h4>
                    <p className="text-2xl font-bold text-green-600">1.8K views</p>
                    <p className="text-sm text-green-500">↑ 12.3% increase</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800">About Page</h4>
                    <p className="text-2xl font-bold text-purple-600">2.1K views</p>
                    <p className="text-sm text-purple-500">↑ 5.7% increase</p>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Top Performing Pages</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">/contact</span>
                      <span className="text-sm text-gray-600">9 weekly page views - could be tracked as 'generate_lead'</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">/services</span>
                      <span className="text-sm text-gray-600">15 weekly page views - high engagement</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="conversion" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={conversionData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="engagement" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-100 rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">Most Visited Pages</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li className="flex justify-between"><span>Homepage</span> <span className="text-gray-500">8,421 views</span></li>
                    <li className="flex justify-between"><span>Product Page</span> <span className="text-gray-500">4,782 views</span></li>
                    <li className="flex justify-between"><span>About Us</span> <span className="text-gray-500">3,291 views</span></li>
                    <li className="flex justify-between"><span>Contact</span> <span className="text-gray-500">2,874 views</span></li>
                    <li className="flex justify-between"><span>Blog</span> <span className="text-gray-500">2,156 views</span></li>
                  </ol>
                </div>
                
                <div className="bg-gray-100 rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">User Behavior</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Page Scroll Depth</span>
                        <span>75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-skilllink-green h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Return Visitors</span>
                        <span>42%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-skilllink-green h-2 rounded-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Click-through Rate</span>
                        <span>3.8%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-skilllink-green h-2 rounded-full" style={{ width: '3.8%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Chatbot */}
      <SectionChatbot 
        isOpen={chatbotOpen} 
        onClose={() => setChatbotOpen(false)}
        sectionTitle="Analytics"
        apiKey="AIzaSyBXbgo0a-G93GK-SN697CTgstGsblAmO7s"
        apiType="gemini"
      />

      {/* Tracking Script Modal */}
      <TrackingScriptModal 
        isOpen={trackingModalOpen}
        onClose={() => setTrackingModalOpen(false)}
      />
    </div>
  );
};

export default AnalyticsSection;
