
import { useState } from 'react';
import { 
  BarChart, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Download, Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import SectionChatbot from './SectionChatbot';

interface AnalyticsReportingSectionProps {
  packageType: string;
}

const AnalyticsReportingSection = ({ packageType }: AnalyticsReportingSectionProps) => {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  
  // Mock data for charts
  const websitePerformanceData = [
    { name: 'Jan', visitors: 4000, conversions: 240, revenue: 5600 },
    { name: 'Feb', visitors: 3000, conversions: 198, revenue: 4200 },
    { name: 'Mar', visitors: 5000, conversions: 350, revenue: 7800 },
    { name: 'Apr', visitors: 4780, conversions: 308, revenue: 6900 },
    { name: 'May', visitors: 5890, conversions: 480, revenue: 9200 },
    { name: 'Jun', visitors: 6390, conversions: 580, revenue: 10800 },
  ];
  
  const marketingChannelData = [
    { name: 'Organic Search', value: 40 },
    { name: 'Direct', value: 25 },
    { name: 'Social Media', value: 20 },
    { name: 'Referral', value: 10 },
    { name: 'Email', value: 5 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Analytics & Reporting</h1>
          <p className="text-gray-500">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            <span>Export</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 size={16} />
            <span>Share</span>
          </Button>
          <Button 
            onClick={() => setChatbotOpen(true)}
            className="flex items-center gap-2 bg-skilllink-green hover:bg-skilllink-dark-green"
          >
            <MessageCircle size={16} />
            <span>Analytics Assistant</span>
          </Button>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,289</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <span className="flex items-center">↑ 15%</span>
              <span className="text-gray-400 ml-1">vs last month</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2%</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <span className="flex items-center">↑ 1.2%</span>
              <span className="text-gray-400 ml-1">vs last month</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">New Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">587</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <span className="flex items-center">↑ 12%</span>
              <span className="text-gray-400 ml-1">vs last month</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg. Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$78.52</div>
            <p className="text-xs text-red-500 flex items-center mt-1">
              <span className="flex items-center">↓ 2.5%</span>
              <span className="text-gray-400 ml-1">vs last month</span>
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Reports */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-5">
          <TabsTrigger value="performance">Website Performance</TabsTrigger>
          <TabsTrigger value="marketing">Marketing Channels</TabsTrigger>
          <TabsTrigger value="content">Content Performance</TabsTrigger>
          <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Website Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={websitePerformanceData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="visitors" stroke="#8884d8" name="Visitors" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="conversions" stroke="#82ca9d" name="Conversions" />
                    <Line type="monotone" dataKey="revenue" stroke="#ffc658" name="Revenue ($100s)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-medium mb-4">Page Performance</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Homepage</span>
                        <span className="font-medium">92/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Product Pages</span>
                        <span className="font-medium">87/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Blog</span>
                        <span className="font-medium">76/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '76%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Contact Page</span>
                        <span className="font-medium">95/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Checkout Process</span>
                        <span className="font-medium">68/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">Key Metrics</h3>
                  <table className="min-w-full">
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="py-2 text-sm">Avg. Page Load Time</td>
                        <td className="py-2 text-sm font-medium text-right">1.8s</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-sm">Bounce Rate</td>
                        <td className="py-2 text-sm font-medium text-right">32.7%</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-sm">Session Duration</td>
                        <td className="py-2 text-sm font-medium text-right">3m 42s</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-sm">Pages Per Session</td>
                        <td className="py-2 text-sm font-medium text-right">3.5</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-sm">Return Visitor Rate</td>
                        <td className="py-2 text-sm font-medium text-right">45.2%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="marketing" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Channel Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={marketingChannelData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {marketingChannelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">Channel Performance</h3>
                  <div className="space-y-4">
                    {marketingChannelData.map((channel, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="flex items-center">
                            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                            {channel.name}
                          </span>
                          <span className="font-medium">{channel.value}%</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div className="bg-gray-100 p-2 rounded">
                            <span className="block text-gray-500">Visitors</span>
                            <span className="font-medium">{Math.round(5890 * (channel.value / 100)).toLocaleString()}</span>
                          </div>
                          <div className="bg-gray-100 p-2 rounded">
                            <span className="block text-gray-500">Conv. Rate</span>
                            <span className="font-medium">{(5 + Math.random() * 5).toFixed(1)}%</span>
                          </div>
                          <div className="bg-gray-100 p-2 rounded">
                            <span className="block text-gray-500">Cost</span>
                            <span className="font-medium">${(500 + Math.random() * 1500).toFixed(0)}</span>
                          </div>
                          <div className="bg-gray-100 p-2 rounded">
                            <span className="block text-gray-500">ROI</span>
                            <span className="font-medium">{(100 + Math.random() * 300).toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {packageType !== "enterprise" && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5 text-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800">Advanced Marketing Analytics</h4>
                      <p className="text-sm text-blue-600 mt-1">
                        Upgrade to {packageType === "starter" ? "Professional" : "Enterprise"} for access to advanced marketing analytics,
                        including campaign attribution, ROI tracking, and multi-channel funnel analysis.
                      </p>
                      <Button className="mt-3 bg-skilllink-green hover:bg-skilllink-dark-green">
                        Upgrade Now
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {packageType === "starter" ? (
                <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
                  <BarChart className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Content Performance Analytics</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Upgrade to Professional or Enterprise package to access detailed content performance analytics,
                    including engagement metrics, conversion tracking, and content effectiveness analysis.
                  </p>
                  <div className="mt-6">
                    <Button className="bg-skilllink-green hover:bg-skilllink-dark-green">
                      Upgrade Your Package
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="font-medium text-lg">Top Performing Content</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content Title</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Time</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion Rate</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement Score</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">10 Ways to Improve Your Website SEO</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Blog Post</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3,245</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4m 12s</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8.2%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <span className="mr-2 font-medium">92</span>
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">How to Choose the Right Digital Agency</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Guide</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2,871</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5m 47s</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12.5%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <span className="mr-2 font-medium">88</span>
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Social Media Marketing Strategy Template</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Template</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2,156</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3m 28s</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15.7%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <span className="mr-2 font-medium">86</span>
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '86%' }}></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ecommerce" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>E-commerce Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              {packageType === "starter" ? (
                <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
                  <BarChart className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">E-commerce Analytics</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Upgrade to Professional or Enterprise package to access detailed e-commerce analytics,
                    including sales tracking, product performance, and customer behavior analysis.
                  </p>
                  <div className="mt-6">
                    <Button className="bg-skilllink-green hover:bg-skilllink-dark-green">
                      Upgrade Your Package
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">1,254</div>
                        <p className="text-xs text-green-500 flex items-center mt-1">
                          <span className="flex items-center">↑ 8.7%</span>
                          <span className="text-gray-400 ml-1">vs last month</span>
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Cart Abandonment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">62.8%</div>
                        <p className="text-xs text-red-500 flex items-center mt-1">
                          <span className="flex items-center">↑ 2.3%</span>
                          <span className="text-gray-400 ml-1">vs last month</span>
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Repeat Purchase Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">38.5%</div>
                        <p className="text-xs text-green-500 flex items-center mt-1">
                          <span className="flex items-center">↑ 4.2%</span>
                          <span className="text-gray-400 ml-1">vs last month</span>
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <h3 className="font-medium text-lg">Top Selling Products</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion Rate</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Premium Website Package</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Web Development</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">87</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$13,050</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">9.8%</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">SEO Starter Pack</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">SEO</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">64</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$9,600</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">7.5%</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Social Media Management</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Social Media</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">58</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$8,700</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">6.2%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="custom" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {packageType === "enterprise" ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg">Saved Reports</h3>
                    <Button className="bg-skilllink-green hover:bg-skilllink-dark-green">
                      Create New Report
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Monthly Performance Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-500 mb-3">Comprehensive overview of website and marketing performance metrics for the current month.</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Last updated: 2 days ago</span>
                          <span>Scheduled: Monthly</span>
                        </div>
                      </CardContent>
                      <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-between">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Campaign ROI Analysis</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-500 mb-3">Detailed analysis of return on investment for all active marketing campaigns.</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Last updated: 4 days ago</span>
                          <span>Scheduled: Weekly</span>
                        </div>
                      </CardContent>
                      <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-between">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Custom Multi-Channel Report</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-500 mb-3">Cross-channel performance metrics for social media, email, and web performance.</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Last updated: 1 day ago</span>
                          <span>Scheduled: Daily</span>
                        </div>
                      </CardContent>
                      <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-between">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
                  <BarChart className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Custom Reports</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {packageType === "starter" ? 
                      "Upgrade to Professional or Enterprise package to access custom reporting features." :
                      "Upgrade to Enterprise package to create and schedule custom reports with your specific metrics and KPIs."}
                  </p>
                  <div className="mt-6">
                    <Button className="bg-skilllink-green hover:bg-skilllink-dark-green">
                      Upgrade Your Package
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Chatbot */}
      <SectionChatbot 
        isOpen={chatbotOpen} 
        onClose={() => setChatbotOpen(false)}
        sectionTitle="Analytics & Reporting"
        apiKey="AIzaSyBXbgo0a-G93GK-SN697CTgstGsblAmO7s"
        apiType="gemini"
      />
    </div>
  );
};

export default AnalyticsReportingSection;
