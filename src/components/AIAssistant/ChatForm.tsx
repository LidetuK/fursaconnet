
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from 'lucide-react';

interface ChatFormProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
}

const ChatForm: React.FC<ChatFormProps> = ({ onSubmit, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    onSubmit(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3 flex gap-2">
      <Input
        type="text"
        placeholder="Ask me anything..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1"
        disabled={isLoading}
      />
      <Button 
        type="submit" 
        size="icon" 
        disabled={isLoading || !message.trim()}
      >
        <Send size={18} />
      </Button>
    </form>
  );
};

export default ChatForm;
