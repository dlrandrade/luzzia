import React, { useState } from 'react';
import AgentSidebar from './AgentSidebar';
import ChatArea from './ChatArea';
import HistoryPanel from './HistoryPanel';
import useChat from '../hooks/useChat';
import { MenuIcon, CloseIcon } from './icons'; 
import { Agent, User } from '../types';

interface ChatPageProps {
  onLogout: () => void;
  currentUser: User | null;
  agents: Agent[]; 
}

const ChatPage: React.FC<ChatPageProps> = ({ onLogout, currentUser, agents }) => {
  const { 
    messages, 
    isLoading, 
    error, 
    sendMessage, 
    currentAgent, 
    switchAgent, 
    activeSessionId,
    selectSession,
    startNewChat,
    agentSessions,
    deleteSession,
    renameSession,
    exportSession,
  } = useChat(agents);
  
  const [isAgentSidebarOpen, setIsAgentSidebarOpen] = useState(false);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false); 

  const handleDeleteActiveSession = () => {
    if (activeSessionId) {
        deleteSession(activeSessionId);
    }
  };

  return (
    <div className="flex h-screen max-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white">
      {/* Agent Sidebar (Left) */}
      <div className={`md:block ${isAgentSidebarOpen ? 'block fixed inset-0 z-40' : 'hidden'}`}>
        <AgentSidebar 
          agents={agents}
          currentAgent={currentAgent} 
          onSelectAgent={(agent) => {
            switchAgent(agent);
            setIsAgentSidebarOpen(false); 
          }}
          isOpen={isAgentSidebarOpen} 
          onLogout={onLogout}
          currentUser={currentUser}
        />
         {isAgentSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/30 z-30 md:hidden" 
            onClick={() => setIsAgentSidebarOpen(false)}
            aria-hidden="true"
          ></div>
        )}
      </div>

      {/* Main Chat Area (Center) */}
      <div className="flex-1 flex flex-col min-w-0">
        {error && <div className="p-2 bg-red-600/80 text-white text-center text-sm animate-pulse">{error}</div>}
        <div className="md:hidden flex justify-between items-center p-3 glass-effect border-b border-white/10">
          <button onClick={() => setIsAgentSidebarOpen(!isAgentSidebarOpen)} className="p-2 text-sky-300 hover:text-white">
            <MenuIcon className="w-6 h-6" />
            <span className="sr-only">Alternar Agentes</span>
          </button>
          <span className="text-lg font-semibold text-sky-100 truncate">{currentAgent?.name || "LuzzIA"}</span>
          <button onClick={() => setIsHistoryPanelOpen(!isHistoryPanelOpen)} className="p-2 text-sky-300 hover:text-white">
            <MenuIcon className="w-6 h-6 transform scale-x-[-1]" />
            <span className="sr-only">Alternar Histórico</span>
          </button>
        </div>
        <ChatArea
          currentAgent={currentAgent}
          messages={messages}
          isLoading={isLoading}
          onSendMessage={sendMessage}
          onDeleteSession={handleDeleteActiveSession}
          activeSessionId={activeSessionId}
        />
      </div>

      {/* History Panel (Right) */}
       <div className={`md:block ${isHistoryPanelOpen ? 'block fixed inset-0 z-40' : 'hidden'}`}>
         <div className={`${isHistoryPanelOpen ? 'block fixed right-0 top-0 bottom-0' : 'hidden md:block'}`}>
            <HistoryPanel 
              agentSessions={agentSessions}
              activeSessionId={activeSessionId}
              onSelectSession={selectSession}
              onStartNewChat={() => {
                startNewChat();
                setIsHistoryPanelOpen(false);
              }}
              onDeleteSession={deleteSession}
              onRenameSession={renameSession}
              onExportSession={exportSession}
              isAgentSelected={!!currentAgent}
            />
         </div>
         {isHistoryPanelOpen && (
          <div 
            className="fixed inset-0 bg-black/30 z-30 md:hidden" 
            onClick={() => setIsHistoryPanelOpen(false)}
            aria-hidden="true"
          ></div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;