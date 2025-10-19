import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface SectionChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  sectionTitle: string;
  apiType: "deepseek" | "gemini" | "huggingface"; // Changed to include huggingface
  apiKey?: string;
}

const SectionChatbot = ({ isOpen, onClose, sectionTitle, apiType, apiKey }: SectionChatbotProps) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && chatHistory.length === 0) {
      setChatHistory([
        {
          role: 'assistant',
          content: `👋 Hi there! I'm your ${sectionTitle} AI assistant. How can I help you today?`
        }
      ]);
    }
  }, [isOpen, sectionTitle, chatHistory.length]);

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user' as const, content: message };
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    try {
      let response;
      
      if (apiType === "huggingface") {
        // Use Hugging Face API via Supabase edge function
        response = await supabase.functions.invoke('huggingface-api', {
          body: {
            prompt: `As a ${sectionTitle} specialist, ${message}`,
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            task: "text-generation"
          }
        });
        
        if (response.error) {
          throw new Error(response.error.message);
        }
        
        const aiResponse = response.data?.data?.generated_text || 
                          response.data?.data?.[0]?.generated_text || 
                          "I'm having trouble connecting to my knowledge base right now. Please try again later.";
        
        const aiMessage = {
          role: 'assistant' as const,
          content: aiResponse
        };
        setChatHistory(prev => [...prev, aiMessage]);
      } else if (apiType === "deepseek") {
        // Using DeepSeek API
        response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              {
                role: "system",
                content: `You are a specialized AI assistant for ${sectionTitle}. Provide concise, accurate and helpful information related to ${sectionTitle} topics.`
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
      } else if (apiType === "gemini") {
        // Using Gemini API
        response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a specialized AI assistant for ${sectionTitle}. The user asks: ${message}`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
            }
          })
        });
        
        const data = await response.json();
        
        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
          const aiMessage = {
            role: 'assistant' as const,
            content: data.candidates[0].content.parts[0].text
          };
          setChatHistory(prev => [...prev, aiMessage]);
        } else {
          throw new Error('Failed to get response from AI: ' + JSON.stringify(data));
        }
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle>{sectionTitle} Assistant</DialogTitle>
              <DialogDescription>Ask me anything about {sectionTitle.toLowerCase()}</DialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={16} />
            </Button>
          </div>
        </DialogHeader>
        
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user' 
                    ? 'bg-skilllink-green text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 rounded-lg max-w-[80%] p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 flex gap-2">
          <Input
            autoFocus
            type="text"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="bg-skilllink-green hover:bg-skilllink-dark-green"
            size="icon" 
            disabled={isLoading || !message.trim()}
          >
            <Send size={16} />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SectionChatbot;
