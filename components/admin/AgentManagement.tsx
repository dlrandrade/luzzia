import React, { useState, useEffect } from 'react';
import { Agent } from '../../types';
import { PlusIcon, EditIcon, TrashIcon, BotIcon } from '../icons'; // Reusing icons

interface AgentManagementProps {
  agents: Agent[];
  onAgentsUpdate: (updatedAgents: Agent[]) => void;
}

const AgentManagement: React.FC<AgentManagementProps> = ({ agents: initialAgentsFromProps, onAgentsUpdate }) => {
  const [agents, setAgents] = useState<Agent[]>(initialAgentsFromProps);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<Partial<Agent> & { isNew?: boolean }>({});
  
  useEffect(() => {
    setAgents(initialAgentsFromProps);
  }, [initialAgentsFromProps]);


  const handleOpenModalForNew = () => {
    setCurrentAgent({ 
        id: `agent-${Date.now()}`, 
        name: '', 
        promptSystem: '', 
        personality: '', 
        avatar: <BotIcon className="w-8 h-8 text-gray-400" />,
        isNew: true 
    });
    setShowAgentModal(true);
  };

  const handleOpenModalForEdit = (agent: Agent) => {
    setCurrentAgent({ ...agent, isNew: false });
    setShowAgentModal(true);
  };

  const handleSaveAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAgent.name || !currentAgent.promptSystem) {
        alert("Nome e Prompt do Sistema são obrigatórios.");
        return;
    }

    let updatedAgents;
    if (currentAgent.isNew) {
      const newAgentToAdd: Agent = {
        id: currentAgent.id!,
        name: currentAgent.name,
        avatar: currentAgent.avatar!,
        promptSystem: currentAgent.promptSystem,
        personality: currentAgent.personality!,
      };
      updatedAgents = [...agents, newAgentToAdd];
    } else {
      updatedAgents = agents.map(agent => 
        agent.id === currentAgent.id ? { ...agent, ...currentAgent } as Agent : agent
      );
    }
    
    onAgentsUpdate(updatedAgents);
    setShowAgentModal(false);
    setCurrentAgent({});
  };

  const handleDeleteAgent = (agentId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este agente? Esta ação não pode ser desfeita.")) {
      const updatedAgents = agents.filter(agent => agent.id !== agentId);
      onAgentsUpdate(updatedAgents);
    }
  };


  return (
    <div className="text-sky-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Gerenciamento de Agentes</h1>
        <button
          onClick={handleOpenModalForNew}
          className="flex items-center bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Adicionar Novo Agente
        </button>
      </div>
      <p className="mb-4 text-sm text-sky-300">
        Gerencie os agentes da LuzzIA. O "Prompt do Sistema" é a instrução principal que define o comportamento do agente de IA.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-slate-800/60 p-5 rounded-lg shadow-lg border border-sky-700/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-3">
                <span className="mr-3 flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white/10">
                    {React.isValidElement(agent.avatar) ? React.cloneElement(agent.avatar as React.ReactElement<{ className?: string }>, { className: 'w-6 h-6' }) : agent.avatar}
                </span>
                <h3 className="text-xl font-semibold text-sky-100 truncate">{agent.name}</h3>
              </div>
              <p className="text-xs text-sky-400 mb-1 font-medium">ID: <span className="font-mono">{agent.id}</span></p>
              <p className="text-sm text-sky-300 mb-1"><strong className="text-sky-200">Personalidade:</strong> {agent.personality}</p>
              <p className="text-sm text-sky-300 h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-sky-600/50 scrollbar-track-transparent"><strong className="text-sky-200">Prompt do Sistema:</strong> {agent.promptSystem}</p>
            </div>
            <div className="mt-4 flex justify-end space-x-2 pt-3 border-t border-sky-700/20">
              <button onClick={() => handleOpenModalForEdit(agent)} className="p-2 text-sky-400 hover:text-sky-200 transition-colors" title="Editar Agente">
                <EditIcon className="w-5 h-5" />
              </button>
              <button onClick={() => handleDeleteAgent(agent.id)} className="p-2 text-red-400 hover:text-red-300 transition-colors" title="Excluir Agente">
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Agent Modal */}
      {showAgentModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-800 p-6 rounded-lg shadow-2xl w-full max-w-lg border border-sky-600/50 my-auto">
            <h2 className="text-2xl font-semibold mb-4 text-sky-100">{currentAgent.isNew ? 'Adicionar Novo Agente' : 'Editar Agente'}</h2>
            <form onSubmit={handleSaveAgent}>
              <div className="mb-4">
                <label htmlFor="agentName" className="block text-sm font-medium text-sky-300 mb-1">Nome do Agente</label>
                <input type="text" id="agentName" value={currentAgent.name || ''} onChange={(e) => setCurrentAgent({...currentAgent, name: e.target.value})} required className="w-full p-2.5 rounded-md bg-slate-700/50 border border-sky-600/70 text-sky-100 focus:ring-sky-500 focus:border-sky-500"/>
              </div>
              <div className="mb-4">
                <label htmlFor="agentPersonality" className="block text-sm font-medium text-sky-300 mb-1">Personalidade (descrição)</label>
                <input type="text" id="agentPersonality" value={currentAgent.personality || ''} onChange={(e) => setCurrentAgent({...currentAgent, personality: e.target.value})} className="w-full p-2.5 rounded-md bg-slate-700/50 border border-sky-600/70 text-sky-100 focus:ring-sky-500 focus:border-sky-500"/>
              </div>
              <div className="mb-6">
                <label htmlFor="agentPromptSystem" className="block text-sm font-medium text-sky-300 mb-1">Prompt do Sistema</label>
                <textarea id="agentPromptSystem" rows={5} value={currentAgent.promptSystem || ''} onChange={(e) => setCurrentAgent({...currentAgent, promptSystem: e.target.value})} required className="w-full p-2.5 rounded-md bg-slate-700/50 border border-sky-600/70 text-sky-100 focus:ring-sky-500 focus:border-sky-500 scrollbar-thin scrollbar-thumb-sky-600/50 scrollbar-track-transparent"/>
                <p className="text-xs text-sky-400 mt-1">Esta é a instrução principal que define o comportamento do agente.</p>
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowAgentModal(false)} className="py-2 px-4 rounded-md text-sky-300 hover:bg-slate-700 transition-colors">Cancelar</button>
                <button type="submit" className="py-2 px-4 rounded-md bg-sky-600 hover:bg-sky-700 text-white font-medium transition-colors">Salvar Agente</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentManagement;
