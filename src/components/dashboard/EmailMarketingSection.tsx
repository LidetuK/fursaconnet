import { useState } from "react";
import { Mail, FileText, Users, BarChart, MessageCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SectionChatbot from "./SectionChatbot";

interface EmailMarketingSectionProps {
  packageType: string;
}

const EmailMarketingSection = ({ packageType }: EmailMarketingSectionProps) => {
  const [chatbotOpen, setChatbotOpen] = useState(false);

  // Mock email templates
  const emailTemplates = [
    {
      name: "Welcome Email js",
      description: "Introduce your brand to new subscribers",
      thumbnailUrl:
        "https://53.fs1.hubspotusercontent-na1.net/hubfs/53/36_Welcome%20Email%20Templates.jpg",
      category: "Onboarding",
    },
    {
      name: "Monthly Newsletter",
      description: "Keep your audience updated with the latest news",
      thumbnailUrl:
        "https://img.freepik.com/premium-vector/white-newsletter-magazine-layout-monthly-newsletter-magazine_1130956-128.jpg",
      category: "Newsletter",
    },
    {
      name: "Product Announcement",
      description: "Launch new products or services",
      thumbnailUrl:
        "https://snov.io/blog/wp-content/uploads/2021/06/7wokfyc8ypk10wwu4ogyu8ebabraev.png",
      category: "Promotional",
    },
    {
      name: "Abandoned Cart",
      description: "Remind customers about items left in their cart",
      thumbnailUrl:
        "https://www.tidio.com/wp-content/uploads/shopify-abandoned-cart.png",
      category: "Transactional",
      proOnly: true,
    },
  ];

  // Mock campaigns
  const emailCampaigns = [
    {
      name: "June Newsletter",
      status: "Sent",
      sentDate: "Jun 5, 2023",
      recipients: 1250,
      openRate: 28.4,
      clickRate: 12.6,
    },
    {
      name: "Summer Promotion",
      status: "Draft",
      sentDate: null,
      recipients: 1875,
      openRate: null,
      clickRate: null,
    },
    {
      name: "Product Update",
      status: "Scheduled",
      sentDate: "Jun 15, 2023",
      recipients: 1500,
      openRate: null,
      clickRate: null,
    },
  ];

  // Mock subscriber segments
  const subscriberSegments = [
    {
      name: "Active Subscribers",
      count: 2450,
      description: "Subscribers who opened an email in the last 30 days",
    },
    {
      name: "Potential Customers",
      count: 1280,
      description: "Leads who haven't made a purchase yet",
    },
    {
      name: "Loyal Customers",
      count: 870,
      description: "Customers who made more than 3 purchases",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Email Marketing</h1>
          <p className="text-gray-500">
            Create, send, and analyze email campaigns
          </p>
        </div>
        <button
          onClick={() => setChatbotOpen(true)}
          className="flex items-center space-x-2 bg-skilllink-green text-white px-4 py-2 rounded-md hover:bg-skilllink-dark-green transition-colors"
        >
          <MessageCircle size={18} />
          <span>Email Marketing Assistant</span>
        </button>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="templates">
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="campaigns">
            <Mail className="h-4 w-4 mr-2" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="subscribers">
            <Users className="h-4 w-4 mr-2" />
            Subscribers
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>
                Create and manage your email templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-2 border-dashed border-gray-300 hover:border-skilllink-green transition-colors">
                  <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                    <div className="w-12 h-12 rounded-full bg-skilllink-green bg-opacity-10 flex items-center justify-center mb-3">
                      <Mail className="h-6 w-6 text-skilllink-green" />
                    </div>
                    <h3 className="font-medium text-center">
                      Create New Template
                    </h3>
                    <p className="text-sm text-gray-500 text-center mt-1">
                      Start from scratch or use AI
                    </p>
                    <Button className="mt-4 w-full bg-skilllink-green hover:bg-skilllink-dark-green">
                      Create Template
                    </Button>
                  </CardContent>
                </Card>

                {emailTemplates.map((template, index) => (
                  <Card
                    key={index}
                    className={
                      template.proOnly && packageType === "starter"
                        ? "opacity-60"
                        : ""
                    }
                  >
                    <div className="relative">
                      <img
                        src={template.thumbnailUrl}
                        alt={template.name}
                        className="w-full h-36 object-cover rounded-t-lg"
                      />
                      {template.proOnly && packageType === "starter" && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                          Premium
                        </div>
                      )}
                      <span className="absolute bottom-2 left-2 bg-gray-800 bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        {template.category}
                      </span>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {template.description}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-skilllink-green hover:bg-skilllink-dark-green"
                        disabled={template.proOnly && packageType === "starter"}
                      >
                        {template.proOnly && packageType === "starter"
                          ? "Upgrade"
                          : "Use"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="font-medium text-lg mb-4">
                  Generate Template with AI
                </h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="grid gap-4 mt-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="template-type"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Template Type
                          </label>
                          <select
                            id="template-type"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skilllink-green focus:border-skilllink-green"
                          >
                            <option value="welcome">Welcome Email</option>
                            <option value="newsletter">Newsletter</option>
                            <option value="promotion">Promotional Email</option>
                            <option value="announcement">
                              Product Announcement
                            </option>
                            <option value="follow-up">Follow-up Email</option>
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor="industry"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Industry
                          </label>
                          <Input
                            id="industry"
                            placeholder="E.g., Technology, E-commerce, Health"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="email-goal"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email Goal
                        </label>
                        <Input
                          id="email-goal"
                          placeholder="E.g., Increase website visits, Announce new product"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="key-points"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Key Points to Include
                        </label>
                        <textarea
                          id="key-points"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skilllink-green focus:border-skilllink-green"
                          placeholder="Enter the main points you want to include in your email"
                        ></textarea>
                      </div>

                      <Button className="w-full bg-skilllink-green hover:bg-skilllink-dark-green">
                        Generate Email Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Email Campaigns</CardTitle>
                  <CardDescription>
                    Create and manage your email campaigns
                  </CardDescription>
                </div>
                <Button className="bg-skilllink-green hover:bg-skilllink-dark-green">
                  New Campaign
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Campaign Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Recipients
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Open Rate
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Click Rate
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {emailCampaigns.map((campaign, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {campaign.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              campaign.status === "Sent"
                                ? "bg-green-100 text-green-800"
                                : campaign.status === "Draft"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {campaign.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {campaign.sentDate || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {campaign.recipients.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {campaign.openRate ? `${campaign.openRate}%` : "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {campaign.clickRate ? `${campaign.clickRate}%` : "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                            {campaign.status !== "Sent" && (
                              <Button
                                size="sm"
                                className="bg-skilllink-green hover:bg-skilllink-dark-green"
                              >
                                {campaign.status === "Draft" ? "Send" : "Edit"}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6">
                <h3 className="font-medium text-lg mb-4">
                  AI Subject Line Generator
                </h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="grid gap-4 mt-3">
                      <div>
                        <label
                          htmlFor="email-content"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email Content/Purpose
                        </label>
                        <textarea
                          id="email-content"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skilllink-green focus:border-skilllink-green"
                          placeholder="Briefly describe what your email is about"
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="audience"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Target Audience
                          </label>
                          <Input
                            id="audience"
                            placeholder="E.g., Small business owners, Parents"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="tone"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Tone
                          </label>
                          <select
                            id="tone"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skilllink-green focus:border-skilllink-green"
                          >
                            <option value="professional">Professional</option>
                            <option value="friendly">Friendly</option>
                            <option value="urgent">Urgent</option>
                            <option value="curious">Curiosity-driven</option>
                            <option value="promotional">Promotional</option>
                          </select>
                        </div>
                      </div>

                      <Button className="w-full bg-skilllink-green hover:bg-skilllink-dark-green">
                        Generate Subject Lines
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscribers" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Subscriber Management</CardTitle>
                  <CardDescription>
                    Manage your email subscribers and segments
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">Import</Button>
                  <Button className="bg-skilllink-green hover:bg-skilllink-dark-green">
                    Add Subscriber
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-lg">Subscriber Segments</h3>
                  <Button variant="outline">Create Segment</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {subscriberSegments.map((segment, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          {segment.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="text-2xl font-bold mb-1">
                          {segment.count.toLocaleString()}
                        </div>
                        <p className="text-sm text-gray-500">
                          {segment.description}
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          View
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-skilllink-green hover:bg-skilllink-dark-green"
                        >
                          Send Email
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>

              {packageType === "starter" ? (
                <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    Advanced Subscriber Management
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Upgrade to Professional or Enterprise package to access
                    advanced subscriber management features, including detailed
                    subscriber data, advanced segmentation, and automation.
                  </p>
                  <div className="mt-6">
                    <Button className="bg-skilllink-green hover:bg-skilllink-dark-green">
                      Upgrade Your Package
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-6">
                  <h3 className="font-medium text-lg mb-4">
                    Recent Subscribers
                  </h3>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date Added
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Source
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {/* Sample subscriber data */}
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          john.doe@example.com
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          John Doe
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Jun 10, 2023
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Contact Form
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Analytics</CardTitle>
              <CardDescription>
                Track the performance of your email campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {packageType === "starter" ? (
                <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
                  <BarChart className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    Advanced Email Analytics
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Upgrade to Professional or Enterprise package to access
                    detailed email analytics, including open rates, click rates,
                    conversion tracking, and more.
                  </p>
                  <div className="mt-6">
                    <Button className="bg-skilllink-green hover:bg-skilllink-dark-green">
                      Upgrade Your Package
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                          Open Rate
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">26.8%</div>
                        <p className="text-xs text-green-500 flex items-center mt-1">
                          <span className="flex items-center">↑ 2.3%</span>
                          <span className="text-gray-400 ml-1">
                            vs last month
                          </span>
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                          Click Rate
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">11.5%</div>
                        <p className="text-xs text-green-500 flex items-center mt-1">
                          <span className="flex items-center">↑ 1.7%</span>
                          <span className="text-gray-400 ml-1">
                            vs last month
                          </span>
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                          Bounce Rate
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">2.1%</div>
                        <p className="text-xs text-red-500 flex items-center mt-1">
                          <span className="flex items-center">↑ 0.3%</span>
                          <span className="text-gray-400 ml-1">
                            vs last month
                          </span>
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                          Unsubscribe Rate
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">0.8%</div>
                        <p className="text-xs text-green-500 flex items-center mt-1">
                          <span className="flex items-center">↓ 0.2%</span>
                          <span className="text-gray-400 ml-1">
                            vs last month
                          </span>
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-medium text-lg mb-4">
                      Email Performance Over Time
                    </h3>
                    <div className="h-64 bg-white p-4 rounded-lg border border-gray-200">
                      <div className="h-full flex items-center justify-center text-gray-500">
                        Performance Chart will appear here
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          Best Performing Emails
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          <li className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium">
                                Product Launch Announcement
                              </span>
                              <span className="text-sm text-gray-500 block">
                                Sent: May 15, 2023
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="font-medium text-green-600 block">
                                42.5%
                              </span>
                              <span className="text-xs text-gray-500">
                                Open Rate
                              </span>
                            </div>
                          </li>
                          <li className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium">
                                Spring Promotion
                              </span>
                              <span className="text-sm text-gray-500 block">
                                Sent: Apr 23, 2023
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="font-medium text-green-600 block">
                                38.2%
                              </span>
                              <span className="text-xs text-gray-500">
                                Open Rate
                              </span>
                            </div>
                          </li>
                          <li className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium">
                                Monthly Newsletter
                              </span>
                              <span className="text-sm text-gray-500 block">
                                Sent: Jun 1, 2023
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="font-medium text-green-600 block">
                                31.7%
                              </span>
                              <span className="text-xs text-gray-500">
                                Open Rate
                              </span>
                            </div>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          Device Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Mobile</span>
                              <span>68%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-skilllink-green h-2 rounded-full"
                                style={{ width: "68%" }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Desktop</span>
                              <span>24%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-skilllink-green h-2 rounded-full"
                                style={{ width: "24%" }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Tablet</span>
                              <span>8%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-skilllink-green h-2 rounded-full"
                                style={{ width: "8%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
        sectionTitle="Email Marketing"
        apiKey="AIzaSyBXbgo0a-G93GK-SN697CTgstGsblAmO7s"
        apiType="gemini"
      />
    </div>
  );
};

export default EmailMarketingSection;
