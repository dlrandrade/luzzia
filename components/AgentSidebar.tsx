import React, { useState, useRef, useEffect } from 'react';
import { Agent, User } from '../types';
import { LuzzIALogo, ImagePlaceholderIcon, UserCircleIcon, HelpIcon, LogoutIcon, ChevronUpIcon, ChevronDownIcon, CogIcon } from './icons'; // Added CogIcon for Admin
import { useNavigate } from 'react-router-dom';


interface AgentSidebarProps {
  agents: Agent[];
  currentAgent: Agent | null;
  onSelectAgent: (agent: Agent) => void;
  isOpen: boolean;
  onLogout: () => void;
  currentUser: User | null;
}

const AgentSidebar: React.FC<AgentSidebarProps> = ({ agents, currentAgent, onSelectAgent, isOpen, onLogout, currentUser }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggleProfileMenu = () => setIsProfileOpen(!isProfileOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAdmin = currentUser?.role === 'admin';


  return (
    <div className={`fixed inset-y-0 left-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-72 md:w-80 h-full glass-effect border-r border-white/10 shadow-lg z-30 p-4 flex flex-col`}>
      <div className="flex items-center mb-1 px-1 pt-2">
        <ImagePlaceholderIcon className="w-10 h-10 text-sky-400 mr-3 rounded-full" /> {/* Placeholder for round image */}
        <LuzzIALogo className="text-sky-100">
          <span className="font-semibold text-sky-400">IA</span>
        </LuzzIALogo>
      </div>
      <h3 className="text-xl font-medium text-sky-200 mb-6 px-2">Agentes</h3>
      
      <nav className="flex-grow space-y-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-sky-700/70 scrollbar-track-transparent">
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => onSelectAgent(agent)}
            className={`flex items-center w-full px-3 py-3 rounded-lg text-left transition-all duration-150 ease-in-out group
              ${currentAgent?.id === agent.id 
                ? 'bg-sky-500/40 text-white shadow-md ring-1 ring-sky-400' 
                : 'text-sky-200 hover:bg-sky-600/30 hover:text-white'
              }`}
          >
            <span className="mr-3 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
              {React.isValidElement(agent.avatar) ? React.cloneElement(agent.avatar as React.ReactElement<{ className?: string }>, { className: 'w-5 h-5' }) : agent.avatar}
            </span>
            <span className="text-sm font-medium truncate">{agent.name}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-white/10 relative" ref={profileMenuRef}>
        {isProfileOpen && (
          <div className="absolute bottom-full mb-2 w-full left-0 bg-slate-800/80 backdrop-blur-md rounded-lg shadow-xl border border-sky-600/50 py-2 z-50">
            <button 
              onClick={() => { alert('Página de Perfil (a ser implementada)'); setIsProfileOpen(false); }}
              className="flex items-center w-full px-4 py-2.5 text-sm text-sky-200 hover:bg-sky-700/60 hover:text-white transition-colors"
            >
              <UserCircleIcon className="w-5 h-5 mr-3" />
              Perfil
            </button>
            {isAdmin && (
               <button 
                onClick={() => { navigate('/admin'); setIsProfileOpen(false); }}
                className="flex items-center w-full px-4 py-2.5 text-sm text-sky-200 hover:bg-sky-700/60 hover:text-white transition-colors"
              >
                <CogIcon className="w-5 h-5 mr-3" />
                Administração
              </button>
            )}
            <button 
              onClick={() => { alert('Página de Ajuda (a ser implementada)'); setIsProfileOpen(false); }}
              className="flex items-center w-full px-4 py-2.5 text-sm text-sky-200 hover:bg-sky-700/60 hover:text-white transition-colors"
            >
              <HelpIcon className="w-5 h-5 mr-3" />
              Ajudar
            </button>
            <div className="my-1 px-4"><hr className="border-sky-600/50"/></div>
            <button 
              onClick={() => { onLogout(); setIsProfileOpen(false); }}
              className="flex items-center w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-700/60 hover:text-red-300 transition-colors"
            >
              <LogoutIcon className="w-5 h-5 mr-3" />
              Sair
            </button>
          </div>
        )}
        <button 
          onClick={toggleProfileMenu} 
          className="flex items-center w-full p-3 rounded-lg hover:bg-sky-700/50 transition-colors text-sky-200"
          aria-expanded={isProfileOpen}
          aria-haspopup="true"
        >
          <UserCircleIcon className="w-7 h-7 mr-3 text-sky-400" />
          <span className="text-sm font-medium flex-grow text-left">{currentUser?.username || "Usuário"}</span>
          {isProfileOpen ? <ChevronDownIcon className="w-5 h-5"/> : <ChevronUpIcon className="w-5 h-5"/>}
        </button>
        <p className="text-xs text-sky-400/70 text-center mt-2 px-2">&copy; LuzzIA por Daniel Luzz</p>
      </div>
    </div>
  );
};

export default AgentSidebar;