import React, { useState } from 'react';
import { Message, MessageRole } from '../types';
import { UserIcon } from './icons'; // Assuming UserIcon for user

interface MessageBubbleProps {
  message: Message;
  agentAvatar: React.ReactNode;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, agentAvatar }) => {
  const [showTimestamp, setShowTimestamp] = useState(false);
  const isUser = message.role === MessageRole.USER;
  const isSystem = message.role === MessageRole.SYSTEM; // For error messages or system notifications

  const avatarDisplay = isUser ? <UserIcon className="w-6 h-6 text-sky-300" /> : agentAvatar;
  
  // Format timestamp
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let bubbleStyles = "";
  if (isUser) {
    bubbleStyles = "bg-sky-500 text-white rounded-br-none";
  } else if (isSystem) {
    bubbleStyles = "bg-red-500/30 text-red-200 rounded-bl-none border border-red-500/40";
  } else { // Assistant
    bubbleStyles = "dark-glass-effect text-sky-100 rounded-bl-none border border-sky-500/20";
  }


  return (
    <div 
      className={`flex items-end mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => setShowTimestamp(true)}
      onMouseLeave={() => setShowTimestamp(false)}
    >
      {!isUser && (
        <div className="flex-shrink-0 mr-2 w-8 h-8 rounded-full flex items-center justify-center bg-white/10 text-sky-300">
           {React.isValidElement(avatarDisplay) ? React.cloneElement(avatarDisplay as React.ReactElement<{ className?: string }>, { className: 'w-5 h-5' }) : avatarDisplay}
        </div>
      )}
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow ${bubbleStyles}`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content || (message.role === MessageRole.ASSISTANT && !message.content ? "Digitando..." : "...")}</p>
        {showTimestamp && (
          <p className={`text-xs mt-1 ${isUser ? 'text-sky-200/80 text-right' : 'text-sky-400/80 text-left'}`}>
            {formattedTime}
          </p>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 ml-2 w-8 h-8 rounded-full flex items-center justify-center bg-sky-700/50 text-sky-300">
           {/* UserIcon is already sized, no need to cloneElement if it's directly UserIcon */}
           {avatarDisplay}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
