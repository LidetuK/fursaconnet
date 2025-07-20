
import { useState } from 'react';
import { 
  Edit, 
  FileText, 
  Bookmark, 
  MessageCircle, 
  FileSpreadsheet 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SectionChatbot from './SectionChatbot';
import BlogPostGenerator from './content-creation/BlogPostGenerator';
import ContentTemplates from './content-creation/ContentTemplates';
import ContentCalendar from './content-creation/ContentCalendar';
import ContentIdeas from './content-creation/ContentIdeas';
import UpgradeSection from './content-creation/UpgradeSection';
import FeatureExplanation from './content-creation/FeatureExplanation';

interface ContentCreationSectionProps {
  packageType: string;
}

const ContentCreationSection = ({ packageType }: ContentCreationSectionProps) => {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("blog-posts");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Content Creation</h1>
          <p className="text-gray-500">
            Create compelling content for your marketing channels
          </p>
        </div>
        <button
          onClick={() => setChatbotOpen(true)}
          className="flex items-center space-x-2 bg-skilllink-green text-white px-4 py-2 rounded-md hover:bg-skilllink-dark-green transition-colors"
        >
          <MessageCircle size={18} />
          <span>Content Assistant</span>
        </button>
      </div>

      {/* Feature explanation for new users */}
      <FeatureExplanation 
        title="Content Creation Tools"
        description="These tools help you create various types of content for your marketing efforts. You can generate blog posts, explore content templates, plan your content calendar, and get AI-powered content ideas."
        amharicDescription="እነዚህ መሳሪያዎች ለግብይት ጥረቶችዎ የተለያዩ ዓይነት ይዘቶችን እንዲፈጥሩ ይረዳዎታል። ብሎግ ልጥፎችን መፍጠር፣ የይዘት አብነቶችን መመርመር፣ የይዘት ቀን መቁጠሪያዎን ማቀድ እና በኤአይ የተጎላበቱ የይዘት ሀሳቦችን ማግኘት ይችላሉ።"
      />

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="blog-posts">
            <FileText className="h-4 w-4 mr-2" />
            Blog Posts
          </TabsTrigger>
          <TabsTrigger value="content-templates">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Content Templates
          </TabsTrigger>
          <TabsTrigger value="content-calendar">
            <Edit className="h-4 w-4 mr-2" />
            Content Calendar
          </TabsTrigger>
          <TabsTrigger value="content-ideas">
            <Bookmark className="h-4 w-4 mr-2" />
            Content Ideas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="blog-posts" className="mt-6">
          <BlogPostGenerator packageType={packageType} />
          <div className="mt-8">
            <UpgradeSection packageType={packageType} />
          </div>
        </TabsContent>

        <TabsContent value="content-templates" className="mt-6">
          <ContentTemplates />
        </TabsContent>

        <TabsContent value="content-calendar" className="mt-6">
          <ContentCalendar />
        </TabsContent>

        <TabsContent value="content-ideas" className="mt-6">
          <ContentIdeas />
        </TabsContent>
      </Tabs>
      
      {/* Chatbot */}
      <SectionChatbot 
        isOpen={chatbotOpen} 
        onClose={() => setChatbotOpen(false)}
        sectionTitle="Content Creation"
        apiType="huggingface"
      />
    </div>
  );
};

export default ContentCreationSection;
