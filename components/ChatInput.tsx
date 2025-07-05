import React, { useState } from 'react';
import { SendIcon } from './icons';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 glass-effect">
      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Digite sua dúvida…"
          disabled={isLoading}
          className="flex-grow p-3 rounded-xl bg-white/20 text-sky-100 placeholder-sky-300/70 border border-transparent focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow duration-150 shadow-sm"
          aria-label="Entrada de mensagem do chat"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="p-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white disabled:bg-sky-500/50 disabled:cursor-not-allowed transition-colors duration-150 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400"
          aria-label="Enviar mensagem"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <SendIcon className="w-5 h-5" />
          )}
        </button>
      </div>
    </form>
  );
};

export default ChatInput;