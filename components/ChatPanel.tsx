import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Agent, ChatMessage } from '../types.ts';
import { ArrowRightIcon } from './icons.tsx';

interface ChatPanelProps {
  agent: Agent | null;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  chatTitle: string;
  user: { name: string };
}

const ChatMessageItem: React.FC<{ message: ChatMessage; userName: string }> = ({ message, userName }) => {
    if (message.sender === 'user') {
        return (
            <div className="flex justify-end items-start space-x-4">
                <div className="bg-stone-200/80 dark:bg-stone-700 rounded-xl p-4 max-w-2xl">
                    <p className="text-stone-800 dark:text-stone-200 whitespace-pre-wrap">{message.text}</p>
                </div>
                <div className="flex-shrink-0 w-8 h-8 bg-stone-300 dark:bg-stone-600 rounded-full flex items-center justify-center font-bold text-stone-600 dark:text-stone-300 text-sm">
                    {userName.charAt(0)}
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-stone-300 dark:bg-stone-600 rounded-full flex items-center justify-center font-bold text-stone-600 dark:text-stone-300 text-sm">
                {message.agentName?.charAt(0)}
            </div>
            <div className="bg-white dark:bg-stone-700/50 rounded-xl p-4 max-w-2xl shadow-sm border border-stone-200/80 dark:border-stone-600/80">
                <h3 className="font-bold text-stone-800 dark:text-stone-200 mb-2">{message.agentName} se manifesta...</h3>
                <div className="prose prose-stone dark:prose-invert max-w-none">
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
};


const ChatPanel: React.FC<ChatPanelProps> = ({ agent, messages, onSendMessage, isLoading, chatTitle, user }) => {
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };
  
  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 border border-stone-200 dark:border-stone-700/50">
      <header className="text-center border-b border-stone-200 dark:border-stone-700 pb-4 mb-6 text-stone-800 dark:text-stone-200">
        <h2 className="text-xl font-bold">{chatTitle}</h2>
      </header>

      <div className="flex-1 overflow-y-auto pr-4 space-y-6">
        {messages.map((msg) => (
          <ChatMessageItem key={msg.id} message={msg} userName={user.name} />
        ))}
         {isLoading && (
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-stone-300 dark:bg-stone-600 rounded-full flex items-center justify-center font-bold text-stone-600 dark:text-stone-300 text-sm animate-pulse">
                  {agent?.name.charAt(0)}
                </div>
                <div className="bg-white dark:bg-stone-700/50 rounded-xl p-4 w-full max-w-2xl shadow-sm border border-stone-200/80 dark:border-stone-600/80">
                    <div className="space-y-3">
                        <div className="h-4 bg-stone-200 dark:bg-stone-600 rounded w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-stone-200 dark:bg-stone-600 rounded w-full animate-pulse"></div>
                        <div className="h-4 bg-stone-200 dark:bg-stone-600 rounded w-5/6 animate-pulse"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="mt-6">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={agent ? `Interaja com ${agent.name}...` : 'Selecione um agente para começar...'}
            disabled={!agent || isLoading}
            className="w-full pl-6 pr-14 py-4 bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl shadow-md border border-stone-200/80 dark:border-stone-600/80 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-500 transition-shadow"
          />
          <button 
            type="submit" 
            disabled={!agent || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-stone-800 text-white rounded-lg p-2 hover:bg-stone-900 dark:bg-stone-200 dark:text-stone-800 dark:hover:bg-white disabled:bg-stone-300 dark:disabled:bg-stone-500 transition-colors"
           >
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;