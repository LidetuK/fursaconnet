
import React from 'react';
import { Message } from './types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAI = message.role === 'assistant';
  
  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
      <div 
        className={`max-w-[80%] rounded-lg p-3 ${
          isAI 
            ? 'bg-gray-100 text-gray-800 rounded-tl-none' 
            : 'bg-skilllink-green text-white rounded-tr-none'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};

export default MessageBubble;
