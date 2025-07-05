import React, { useState, useRef, useEffect } from 'react';
import { ChatSession } from '../types';
import { PlusIcon, EditIcon, TrashIcon, HelpIcon } from './icons'; // Using Help for export icon placeholder

interface HistoryPanelProps {
  agentSessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onStartNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, newTitle: string) => void;
  onExportSession: (sessionId: string) => void;
  isAgentSelected: boolean;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ 
  agentSessions, 
  activeSessionId, 
  onSelectSession, 
  onStartNewChat, 
  onDeleteSession,
  onRenameSession,
  onExportSession,
  isAgentSelected 
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRename = (sessionId: string) => {
    setOpenMenuId(null);
    const currentTitle = agentSessions.find(s => s.id === sessionId)?.title || '';
    const newTitle = prompt("Digite o novo título da conversa:", currentTitle);
    if (newTitle) {
      onRenameSession(sessionId, newTitle);
    }
  };
  
  const handleDelete = (sessionId: string) => {
    setOpenMenuId(null);
    if (window.confirm("Tem certeza que deseja excluir esta conversa?")) {
        onDeleteSession(sessionId);
    }
  };

  const handleExport = (sessionId: string) => {
    setOpenMenuId(null);
    onExportSession(sessionId);
  };


  return (
    <div className={`fixed inset-y-0 right-0 transform translate-x-0 md:relative transition-transform duration-300 ease-in-out w-64 md:w-72 h-full glass-effect border-l border-white/10 shadow-lg z-20 p-4 flex flex-col`}>
      <h2 className="text-xl font-semibold text-sky-100 mb-4 px-2">Histórico</h2>
      
      <button 
        onClick={onStartNewChat}
        disabled={!isAgentSelected}
        className="flex items-center justify-center w-full px-4 py-2.5 mb-4 text-sm font-semibold text-white bg-sky-600/80 rounded-lg hover:bg-sky-500 transition-colors disabled:bg-slate-600/50 disabled:cursor-not-allowed disabled:text-sky-300/60 shadow"
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        Nova Conversa
      </button>

      <div className="flex-grow overflow-y-auto space-y-1.5 text-sm text-sky-300 pr-1 scrollbar-thin scrollbar-thumb-sky-700/70 scrollbar-track-transparent">
        {isAgentSelected ? (
            agentSessions.length > 0 ? (
                agentSessions.map(session => (
                    <div key={session.id} className="relative group">
                        <button
                            onClick={() => onSelectSession(session.id)}
                            className={`w-full text-left p-2.5 rounded-md transition-colors flex items-center justify-between ${
                                activeSessionId === session.id 
                                ? 'bg-sky-500/40 text-white font-semibold' 
                                : 'hover:bg-sky-600/30'
                            }`}
                        >
                            <span className="truncate pr-4">{session.title}</span>
                             <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(openMenuId === session.id ? null : session.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded-full hover:bg-white/20 transition-opacity"
                                aria-label="Opções da conversa"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                            </button>
                        </button>
                        {openMenuId === session.id && (
                            <div ref={menuRef} className="absolute right-0 mt-1 w-44 bg-slate-800/90 backdrop-blur-sm border border-sky-600/50 rounded-md shadow-2xl z-50 py-1">
                                <a onClick={(e) => {e.preventDefault(); handleRename(session.id);}} href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-sky-200 hover:bg-sky-700/60 w-full"><EditIcon className="w-4 h-4"/>Renomear</a>
                                <a onClick={(e) => {e.preventDefault(); handleExport(session.id);}} href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-sky-200 hover:bg-sky-700/60 w-full"><HelpIcon className="w-4 h-4"/>Exportar (.txt)</a>
                                <div className="my-1 px-2"><hr className="border-sky-600/50"/></div>
                                <a onClick={(e) => {e.preventDefault(); handleDelete(session.id);}} href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-700/60 w-full"><TrashIcon className="w-4 h-4"/>Excluir</a>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p className="p-3 text-center text-xs text-sky-400">Nenhuma conversa encontrada para este agente.</p>
            )
        ) : (
          <p className="p-3 text-center text-xs text-sky-400">Selecione um agente para ver o histórico.</p>
        )}
      </div>
       <div className="mt-auto pt-4 border-t border-white/10">
        <p className="text-xs text-sky-400/70 text-center">As conversas são salvas no seu navegador.</p>
      </div>
    </div>
  );
};

export default HistoryPanel;
