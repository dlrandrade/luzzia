import React, { useEffect, useRef } from 'react';
import { Agent, Message } from '../types'; 
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { LuzzIALogo, TrashIcon } from './icons';

interface ChatAreaProps {
  currentAgent: Agent | null;
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onDeleteSession: () => void;
  activeSessionId: string | null;
}

const ChatArea: React.FC<ChatAreaProps> = ({ currentAgent, messages, isLoading, onSendMessage, onDeleteSession, activeSessionId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const hasActiveSession = currentAgent && activeSessionId;

  return (
    <div className="flex-1 flex flex-col bg-slate-800/30 overflow-hidden h-full">
      {currentAgent ? (
        <>
          <header className="px-5 py-4 border-b border-white/10 glass-effect flex justify-between items-center">
            <div className="flex items-center min-w-0">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 mr-3 text-sky-300 flex-shrink-0">
                 {currentAgent.avatar && React.isValidElement(currentAgent.avatar) ? React.cloneElement(currentAgent.avatar as React.ReactElement<{ className?: string }>, { className: 'w-6 h-6' }) : currentAgent.avatar}
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-sky-100 truncate">{currentAgent.name}</h2>
                <p className="text-xs text-sky-300/80 truncate">{currentAgent.personality}</p>
              </div>
            </div>
            {hasActiveSession && (
               <button
                onClick={onDeleteSession}
                className="px-3 py-1.5 text-xs font-medium text-red-300 bg-red-700/50 hover:bg-red-600/50 rounded-md transition-colors flex items-center flex-shrink-0"
                title="Excluir esta conversa"
              >
                <TrashIcon className="w-4 h-4 mr-1.5" />
                Excluir Conversa
              </button>
            )}
          </header>
          
          {hasActiveSession ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} agentAvatar={currentAgent.avatar} />
                ))}
                <div ref={messagesEndRef} />
              </div>
              <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
            </>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-sky-300">
                <LuzzIALogo className="text-sky-400 mb-4 scale-75" />
                <p className="text-xl">Pronto para conversar com <span className="font-bold text-sky-200">{currentAgent.name}</span>.</p>
                <p className="mt-2 text-sm text-sky-400/80">Inicie uma nova conversa ou selecione uma existente no painel de histórico.</p>
            </div>
          )}
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-sky-300">
          <LuzzIALogo className="text-sky-400 mb-4" />
          <p className="text-xl">Selecione um agente para começar.</p>
          <p className="mt-2 text-sm text-sky-400/80">LuzzIA está pronta para te ajudar a pensar como um mentor, não como um robô.</p>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
