import React, { useState } from 'react';
import type { AdminAgent } from '../../types.ts';
import { BotIcon, PencilIcon, PlusCircleIcon, TrashIcon } from '../icons.tsx';
import AgentFormModal from './AgentFormModal.tsx';

interface AgentManagementProps {
    agents: AdminAgent[];
    onAdd: (agent: Omit<AdminAgent, 'id'>) => void;
    onUpdate: (agent: AdminAgent) => void;
    onDelete: (agentId: string) => void;
}

const AgentManagement: React.FC<AgentManagementProps> = ({ agents, onAdd, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAgent, setEditingAgent] = useState<AdminAgent | null>(null);

    const handleAddNew = () => {
        setEditingAgent(null);
        setIsModalOpen(true);
    };

    const handleEdit = (agent: AdminAgent) => {
        setEditingAgent(agent);
        setIsModalOpen(true);
    };

    const handleDelete = (agentId: string) => {
        if (window.confirm('Tem certeza que deseja excluir este agente?')) {
            onDelete(agentId);
        }
    };

    const handleSave = (agentData: Omit<AdminAgent, 'id'> | AdminAgent) => {
        if ('id' in agentData) {
            onUpdate(agentData);
        } else {
            onAdd(agentData);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-200 flex items-center gap-3">
                    <BotIcon className="w-6 h-6" />
                    <span>Gestão de Agentes</span>
                </h2>
                <button 
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>Adicionar Agente</span>
                </button>
            </div>
            <div className="bg-white dark:bg-stone-800/50 rounded-lg shadow-md border border-stone-200 dark:border-stone-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-stone-50 dark:bg-stone-700/50">
                        <tr>
                            <th className="p-4 font-semibold text-sm text-stone-600 dark:text-stone-300">Nome</th>
                            <th className="p-4 font-semibold text-sm text-stone-600 dark:text-stone-300">Descrição</th>
                            <th className="p-4 font-semibold text-sm text-stone-600 dark:text-stone-300 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
                        {agents.map(agent => (
                            <tr key={agent.id}>
                                <td className="p-4 text-stone-800 dark:text-stone-200 font-medium">{agent.name}</td>
                                <td className="p-4 text-stone-600 dark:text-stone-400">{agent.description}</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEdit(agent)} className="p-2 text-stone-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-stone-100 dark:hover:bg-stone-700"><PencilIcon /></button>
                                        <button onClick={() => handleDelete(agent.id)} className="p-2 text-stone-500 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-stone-100 dark:hover:bg-stone-700"><TrashIcon /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {isModalOpen && (
                <AgentFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    agent={editingAgent}
                />
            )}
        </div>
    );
};

export default AgentManagement;