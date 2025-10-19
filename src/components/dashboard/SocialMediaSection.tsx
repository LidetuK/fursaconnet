
import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import SectionChatbot from './SectionChatbot';
import SocialMediaConnector from './social-media/SocialMediaConnector';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SocialMediaSection = () => {
  const [chatbotOpen, setChatbotOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Social Media Marketing</h1>
          <p className="text-gray-500">Manage and grow your social media presence</p>
        </div>
        <button 
          onClick={() => setChatbotOpen(true)}
          className="flex items-center space-x-2 bg-skilllink-green text-white px-4 py-2 rounded-md hover:bg-skilllink-dark-green transition-colors"
        >
          <MessageCircle size={18} />
          <span>Social Media Assistant</span>
        </button>
      </div>

      {/* Social Media Account Connections */}
      <SocialMediaConnector />

      {/* Chatbot */}
      <SectionChatbot 
        isOpen={chatbotOpen} 
        onClose={() => setChatbotOpen(false)}
        sectionTitle="Social Media"
        apiType="huggingface"
      />
    </div>
  );
};

export default SocialMediaSection;
