import React, { useState } from 'react';
import ApiManagement from './admin/ApiManagement.tsx';
import AgentManagement from './admin/AgentManagement.tsx';
import UserManagement from './admin/UserManagement.tsx';
import WebhookManagement from './admin/WebhookManagement.tsx';
import { ArrowLeftIcon, BotIcon, KeyRoundIcon, UsersIcon, WebhookIcon } from './icons.tsx';
import type { AdminAgent, AdminUser } from '../types.ts';

interface AdminPanelProps {
    onNavigateToChat: () => void;
    agents: AdminAgent[];
    users: AdminUser[];
    onAddAgent: (agent: Omit<AdminAgent, 'id'>) => void;
    onUpdateAgent: (agent: AdminAgent) => void;
    onDeleteAgent: (agentId: string) => void;
    onAddUser: (user: Omit<AdminUser, 'id' | 'lastLogin'>) => void;
    onUpdateUser: (user: AdminUser) => void;
    onDeleteUser: (userId: string) => void;
}

type AdminTab = 'apis' | 'agents' | 'users' | 'webhook';

const AdminPanel: React.FC<AdminPanelProps> = (props) => {
    const { 
        onNavigateToChat,
        agents,
        users,
        onAddAgent,
        onUpdateAgent,
        onDeleteAgent,
        onAddUser,
        onUpdateUser,
        onDeleteUser
     } = props;
    const [activeTab, setActiveTab] = useState<AdminTab>('apis');

    const tabs = [
        { id: 'apis', label: 'Gestão de APIs', icon: KeyRoundIcon },
        { id: 'agents', label: 'Gestão de Agentes', icon: BotIcon },
        { id: 'users', label: 'Gestão de Usuários', icon: UsersIcon },
        { id: 'webhook', label: 'Gestão de Webhook', icon: WebhookIcon },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'apis': return <ApiManagement />;
            case 'agents': return <AgentManagement agents={agents} onAdd={onAddAgent} onUpdate={onUpdateAgent} onDelete={onDeleteAgent} />;
            case 'users': return <UserManagement users={users} onAdd={onAddUser} onUpdate={onUpdateUser} onDelete={onDeleteUser} />;
            case 'webhook': return <WebhookManagement />;
            default: return null;
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-stone-100 dark:bg-zinc-800">
            <header className="flex justify-between items-center p-4 border-b border-stone-200 dark:border-stone-700/50 bg-white dark:bg-zinc-900">
                <h1 className="text-xl font-bold text-stone-800 dark:text-stone-200">
                    Painel de Administração
                </h1>
                <button 
                    onClick={onNavigateToChat}
                    className="flex items-center gap-2 px-4 py-2 bg-stone-700 text-white rounded-lg hover:bg-stone-800 dark:bg-stone-200 dark:text-stone-800 dark:hover:bg-white transition-colors text-sm font-medium"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    <span>Voltar ao Chat</span>
                </button>
            </header>

            <div className="flex-1 flex p-6 gap-6">
                <nav className="w-64">
                    <ul className="space-y-2">
                        {tabs.map(tab => (
                            <li key={tab.id}>
                                <button
                                    onClick={() => setActiveTab(tab.id as AdminTab)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-semibold transition-colors ${
                                        activeTab === tab.id
                                            ? 'bg-blue-600 text-white shadow'
                                            : 'text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700/50'
                                    }`}
                                >
                                    <tab.icon className="w-5 h-5" />
                                    <span>{tab.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
                <main className="flex-1 bg-transparent p-6 rounded-lg">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;