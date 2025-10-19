import { useState } from 'react';
import { Users, Calendar, MessageCircle, Clock, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SectionChatbot from './SectionChatbot';
import ExpertCard from './expert-consultation/ExpertCard';
import ExpertSelector from './expert-consultation/ExpertSelector';
import TopicSelector from './expert-consultation/TopicSelector';
import TimeSlotSelector from './expert-consultation/TimeSlotSelector';
import ConsultationList from './expert-consultation/ConsultationList';
import UpgradePrompt from './expert-consultation/UpgradePrompt';
import { useExperts } from '@/hooks/useExperts';

interface ExpertConsultationSectionProps {
  packageType: string;
}

const ExpertConsultationSection = ({ packageType }: ExpertConsultationSectionProps) => {
  const { experts, loading } = useExperts();
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null);
  
  // Mock consultation slots
  const availableSlots = [
    { date: "Monday, June 20", slots: ["9:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"] },
    { date: "Tuesday, June 21", slots: ["10:00 AM", "1:00 PM", "3:30 PM"] },
    { date: "Wednesday, June 22", slots: ["9:30 AM", "12:00 PM", "2:30 PM", "5:00 PM"] },
    { date: "Thursday, June 23", slots: ["11:00 AM", "1:30 PM", "4:00 PM"] },
    { date: "Friday, June 24", slots: ["10:30 AM", "12:30 PM", "3:00 PM"] }
  ];
  
  // Mock consultation topics
  const consultationTopics = [
    { id: "strategy", title: "Marketing Strategy", description: "Get expert guidance on your overall marketing approach" },
    { id: "seo", title: "SEO Optimization", description: "Improve your website's search engine rankings" },
    { id: "content", title: "Content Strategy", description: "Develop a strategic content plan for your business" },
    { id: "design", title: "Website Design", description: "Get feedback on your website design and user experience" },
    { id: "social", title: "Social Media Marketing", description: "Optimize your social media presence and strategy" },
    { id: "analytics", title: "Analytics Review", description: "Understand your data and performance metrics" }
  ];
  
  // Mock scheduled consultations
  const scheduledConsultations = [
    { expert: "Ephrem", topic: "SEO Optimization", date: "June 18, 2023", time: "10:00 AM", status: "Confirmed" },
    { expert: "Dawit", topic: "Content Strategy", date: "June 25, 2023", time: "2:30 PM", status: "Pending" }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Expert Consultation</h1>
          <p className="text-gray-500">Book one-on-one sessions with our team of experts and assign tasks</p>
        </div>
        <button 
          onClick={() => setChatbotOpen(true)}
          className="flex items-center space-x-2 bg-skilllink-green text-white px-4 py-2 rounded-md hover:bg-skilllink-dark-green transition-colors"
        >
          <MessageCircle size={18} />
          <span>Booking Assistant</span>
        </button>
      </div>
      
      <Tabs defaultValue="experts" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="experts">
            <Users className="h-4 w-4 mr-2" />
            Our Experts
          </TabsTrigger>
          <TabsTrigger value="book">
            <Calendar className="h-4 w-4 mr-2" />
            Book a Consultation
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            <Clock className="h-4 w-4 mr-2" />
            Your Consultations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="experts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Meet Our Expert Team</CardTitle>
              <CardDescription>Professional guidance tailored to your business needs</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-48">
                  <Loader2 className="h-8 w-8 animate-spin text-skilllink-green" />
                  <span className="ml-2">Loading experts...</span>
                </div>
              ) : experts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {experts.map((expert) => (
                    <ExpertCard
                      key={expert.id}
                      expert={expert}
                      packageType={packageType}
                      onBookConsultation={setSelectedExpert}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No Experts Available</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    There are currently no available experts. Please check back later.
                  </p>
                </div>
              )}
              
              <UpgradePrompt packageType={packageType} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="book" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Book a Consultation</CardTitle>
              <CardDescription>Schedule a one-on-one session with our experts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ExpertSelector
                  experts={experts}
                  selectedExpert={selectedExpert}
                  packageType={packageType}
                  onSelectExpert={setSelectedExpert}
                />
                
                <TopicSelector topics={consultationTopics} />
              </div>
              
              <TimeSlotSelector availableSlots={availableSlots} />
              
              <div>
                <h3 className="font-medium text-lg mb-4">4. Additional Notes</h3>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skilllink-green focus:border-skilllink-green"
                  rows={3}
                  placeholder="Share any specific topics or questions you'd like to discuss during the consultation..."
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <Button className="bg-skilllink-green hover:bg-skilllink-dark-green">
                  Book Consultation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduled" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Scheduled Consultations</CardTitle>
              <CardDescription>Manage your upcoming expert sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {scheduledConsultations.length > 0 ? (
                <ConsultationList consultations={scheduledConsultations} />
              ) : (
                <div className="text-center p-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No Consultations Scheduled</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You don't have any consultations scheduled yet.
                  </p>
                  <div className="mt-6">
                    <Button 
                      onClick={() => {
                        const bookTabElement = document.querySelector('[data-state="book"]');
                        if (bookTabElement) {
                          (bookTabElement as HTMLElement).click();
                        }
                      }}
                      className="bg-skilllink-green hover:bg-skilllink-dark-green"
                    >
                      Book Your First Consultation
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <h3 className="font-medium text-lg mb-4">Consultation History</h3>
                <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No Past Consultations</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Your completed consultations will appear here.
                  </p>
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
        sectionTitle="Expert Consultation"
        apiKey="AIzaSyBXbgo0a-G93GK-SN697CTgstGsblAmO7s"
        apiType="gemini"
      />
    </div>
  );
};

export default ExpertConsultationSection;
