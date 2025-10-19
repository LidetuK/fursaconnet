import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import ChatInterface from './ChatInterface';
import { Message } from './types';

const AIAssistant = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isBouncing, setIsBouncing] = useState(true);

  // Bounce animation interval
  useEffect(() => {
    if (!isExpanded) {
      const bounceInterval = setInterval(() => {
        setIsBouncing(prev => !prev);
      }, 2000);
      
      return () => clearInterval(bounceInterval);
    } else {
      setIsBouncing(false);
    }
  }, [isExpanded]);

  const handleSendMessage = async (message: string) => {
    // Add user message to chat
    const userMessage = { role: 'user' as const, content: message };
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Using DeepSeek API
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-7c6a8a160ab646be9e19793ba72812f4',
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: "You are a helpful AI assistant for our digital agency website. Please provide concise and accurate information about our services, pricing, or any other information about our company. If you don't know the answer, just say so politely."
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 800
        })
      });
      
      const data = await response.json();
      console.log("DeepSeek API response:", data);
      
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        // Add AI response to chat
        const aiMessage = {
          role: 'assistant' as const,
          content: data.choices[0].message.content
        };
        setChatHistory(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Failed to get response from AI: ' + JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error fetching AI response:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
      
      // Add error message from AI
      setChatHistory(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm sorry, I'm having trouble responding right now. Please try again later."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded && chatHistory.length === 0) {
      // Add welcome message when first opening
      setChatHistory([
        {
          role: 'assistant',
          content: "👋 Hi there! I'm your AI assistant. How can I help you with our digital services today?"
        }
      ]);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Collapsed state - just show the AI avatar */}
      <div
        className={`relative ${isBouncing ? 'animate-bounce' : ''} ${isExpanded ? 'hidden' : 'block'}`}
        onClick={toggleChat}
      >
        <div className="bg-white rounded-full p-2 shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300">
          <img 
            src="https://res.cloudinary.com/dkzw06zke/image/upload/v1748200772/802106d5-d8f5-4750-b9e8-f25420ce8e87_iretrk.jpg"
            alt="AI Assistant" 
            className="w-12 h-12 rounded-full"
          />
          <div className="absolute -top-2 -right-2 bg-skilllink-green text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            AI
          </div>
        </div>
      </div>

      {/* Expanded chat interface */}
      {isExpanded && (
        <ChatInterface 
          chatHistory={chatHistory}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onClose={toggleChat}
        />
      )}
    </div>
  );
};

export default AIAssistant;
