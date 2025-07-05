import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LuzzIALogo, LogoutIcon, UserIcon as UsersIcon, BotIcon as AgentsIcon, KeyIcon, WebhookIcon } from '../icons';

interface AdminPageProps {
  onLogout: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-sky-600/40 text-white' : 'hover:bg-sky-700/30 hover:text-sky-100'
    }`;

  return (
    <div className="flex h-screen max-h-screen bg-slate-900 text-sky-200">
      {/* Admin Sidebar */}
      <div className="w-64 bg-slate-800/50 p-4 border-r border-sky-700/30 flex flex-col">
        <div className="flex items-center mb-8 px-2 pt-2">
            <LuzzIALogo className="text-sky-100">
             <span className="font-semibold text-sky-400">IA</span>
            </LuzzIALogo>
            <span className="ml-2 mt-1 text-xs font-semibold bg-sky-500 text-white px-1.5 py-0.5 rounded">ADMIN</span>
        </div>
        <nav className="space-y-2 flex-grow">
          <NavLink to="users" className={navLinkClass}>
            <UsersIcon className="w-5 h-5 mr-3" />
            Usuários
          </NavLink>
          <NavLink to="agents" className={navLinkClass}>
            <AgentsIcon className="w-5 h-5 mr-3" />
            Agentes
          </NavLink>
          <NavLink to="apis" className={navLinkClass}>
            <KeyIcon className="w-5 h-5 mr-3" />
            APIs
          </NavLink>
           <NavLink to="webhooks" className={navLinkClass}>
            <WebhookIcon className="w-5 h-5 mr-3" />
            Webhooks
          </NavLink>
        </nav>
        <div className="mt-auto border-t border-sky-700/30 pt-4">
            <button 
                onClick={() => navigate('/chat')}
                className="w-full flex items-center px-3 py-2.5 rounded-md text-sm font-medium hover:bg-sky-700/30 hover:text-sky-100 text-sky-300 transition-colors mb-2"
            >
                Voltar ao Chat
            </button>
            <button 
                onClick={onLogout}
                className="w-full flex items-center px-3 py-2.5 rounded-md text-sm font-medium hover:bg-red-700/30 hover:text-red-300 text-red-400 transition-colors"
            >
                <LogoutIcon className="w-5 h-5 mr-3" />
                Sair
            </button>
        </div>
      </div>

      {/* Main Admin Content Area */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-900/70 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50">
        <Outlet /> {/* Child routes will render here */}
      </div>
    </div>
  );
};

export default AdminPage;
