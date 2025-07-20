import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import ChatForm from './ChatForm';
import { Message } from './types';

interface ChatInterfaceProps {
  chatHistory: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  chatHistory, 
  isLoading, 
  onSendMessage,
  onClose
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom of chat when new messages are added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="bg-white rounded-lg shadow-2xl w-80 md:w-96 overflow-hidden flex flex-col transition-all duration-300 border border-gray-200">
      {/* Chat header */}
      <div className="bg-skilllink-green text-white p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img 
            src="https://res.cloudinary.com/dkzw06zke/image/upload/v1748200772/802106d5-d8f5-4750-b9e8-f25420ce8e87_iretrk.jpg"
            alt="AI Assistant" 
            className="w-8 h-8 rounded-full"
          />
          <h3 className="font-medium">AI Assistant</h3>
        </div>
        <button 
          onClick={onClose}
          className="text-white hover:text-gray-200"
        >
          ✕
        </button>
      </div>
      
      {/* Chat messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 p-3 overflow-y-auto h-80 space-y-3"
      >
        {chatHistory.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
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
      
      {/* Input form */}
      <ChatForm onSubmit={onSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatInterface;
