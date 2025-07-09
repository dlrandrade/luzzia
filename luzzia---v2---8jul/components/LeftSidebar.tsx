import React from 'react';
import type { AdminAgent } from '../types.ts';
import { LayoutSidebarLeftCollapseIcon } from './icons.tsx';
import ProfileMenu from './ProfileMenu.tsx';

interface LeftSidebarProps {
  agents: AdminAgent[];
  activeAgent: AdminAgent | null;
  onSelectAgent: (agent: AdminAgent) => void;
  onToggleCollapse: () => void;
  user: { name: string; isAdmin: boolean };
  onNavigateToAdmin: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ agents, activeAgent, onSelectAgent, onToggleCollapse, user, onNavigateToAdmin }) => {
  return (
    <aside className="w-64 bg-[#f3f3f2] dark:bg-zinc-800 p-4 flex flex-col justify-between space-y-4 rounded-2xl transition-all duration-300">
      <div>
        <div className="flex justify-between items-center text-stone-600 dark:text-stone-400">
          <h2 className="font-bold text-lg">Agentes</h2>
          <button onClick={onToggleCollapse} className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200">
            <LayoutSidebarLeftCollapseIcon className="w-5 h-5" />
          </button>
        </div>
        <hr className="my-4 border-stone-300 dark:border-stone-600"/>
        <nav className="flex flex-col space-y-2">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => onSelectAgent(agent)}
              className={`px-4 py-2 rounded-lg text-left font-medium transition-colors duration-200 ${
                activeAgent?.id === agent.id
                  ? 'bg-stone-300 dark:bg-stone-600 text-stone-900 dark:text-stone-100'
                  : 'bg-transparent text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {agent.name}
            </button>
          ))}
        </nav>
      </div>
      <ProfileMenu user={user} onNavigateToAdmin={onNavigateToAdmin} />
    </aside>
  );
};

export default LeftSidebar;