
import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatWithUs = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Add welcome message when component mounts
    if (chatHistory.length === 0) {
      setChatHistory([
        {
          role: 'assistant',
          content: "👋 Hi there! I'm your AI assistant. How can I help you with our digital services today?"
        }
      ]);
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom of chat when new messages are added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
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

  return (
    <section id="chat" className="py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
              Chat With Us
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            Have questions about our services? Our AI assistant is here to help!
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
          {/* Chat header */}
          <div className="bg-skilllink-green text-white p-4 flex items-center gap-3">
            <Bot size={24} />
            <h3 className="text-xl font-medium">AI Assistant</h3>
          </div>
          
          {/* Chat messages */}
          <div 
            ref={chatContainerRef}
            className="h-[400px] p-4 overflow-y-auto space-y-4"
          >
            {chatHistory.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user' 
                      ? 'bg-skilllink-green text-white rounded-tr-none' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg rounded-tl-none max-w-[80%] p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input area */}
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 flex gap-2">
            <Input
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
              <Send size={18} />
            </Button>
          </form>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-skilllink-green/5 rounded-full"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-skilllink-light-green/5 rounded-full"></div>
    </section>
  );
};

export default ChatWithUs;
