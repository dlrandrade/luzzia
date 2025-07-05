import React, { useState, useEffect } from 'react';
import { backendService } from '../../services/backendService';
import { ApiConfig } from '../../types';
import { PlusIcon, TrashIcon } from '../icons';

const ApiManagement: React.FC = () => {
  const [apiConfigs, setApiConfigs] = useState<ApiConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedConfigs = backendService.getApiConfigs();
    setApiConfigs(loadedConfigs);
    setIsLoading(false);
  }, []);

  const handleUpdate = (id: string, field: keyof Omit<ApiConfig, 'id' | 'isActive'>, value: any) => {
    const updatedConfigs = apiConfigs.map(config => {
      if (config.id === id) {
        return { ...config, [field]: value };
      }
      return config;
    });
    setApiConfigs(updatedConfigs);
  };
  
  const handleToggleActive = (id: string) => {
    const updatedConfigs = apiConfigs.map(config => ({
        ...config,
        isActive: config.id === id
    }));
    setApiConfigs(updatedConfigs);
  };

  const handleAddConfig = () => {
    const newConfig: ApiConfig = {
      id: `api-${Date.now()}`,
      provider: 'Gemini',
      apiKey: '',
      model: '',
      isActive: apiConfigs.length === 0,
    };
    setApiConfigs([...apiConfigs, newConfig]);
  };

  const handleRemoveConfig = (idToRemove: string) => {
    setApiConfigs(prevConfigs => {
      const configToRemove = prevConfigs.find(c => c.id === idToRemove);
      let newConfigs = prevConfigs.filter(c => c.id !== idToRemove);
      
      if (configToRemove?.isActive && newConfigs.length > 0 && !newConfigs.some(c => c.isActive)) {
        newConfigs[0] = { ...newConfigs[0], isActive: true };
      }
      return newConfigs;
    });
  };

  const handleSaveChanges = () => {
    if (apiConfigs.length > 0 && !apiConfigs.some(c => c.isActive)) {
        apiConfigs[0].isActive = true;
    }
    backendService.updateApiConfigs(apiConfigs);
    alert('Configurações salvas! A página será recarregada para aplicar as mudanças de API.');
    window.location.reload();
  };

  const providerOptions: ApiConfig['provider'][] = ['Gemini', 'Groq', 'OpenAI', 'OpenRouter'];

  return (
    <div className="text-sky-100">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-semibold ">Gerenciamento de APIs</h1>
        <div className="flex gap-3">
          <button
            onClick={handleAddConfig}
            className="flex items-center bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Adicionar Configuração
          </button>
          <button
            onClick={handleSaveChanges}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow"
          >
            Salvar Alterações
          </button>
        </div>
      </div>

      <p className="mb-4 text-sm text-sky-300">
        Configure as chaves de API para os provedores de IA. Apenas a API marcada como "Ativa" será usada no chat. 
        <strong className="text-red-400"> Suas chaves de API são salvas localmente no seu navegador e não são enviadas para nenhum servidor.</strong>
      </p>

      <div className="bg-slate-800/60 shadow-xl rounded-lg overflow-x-auto border border-sky-700/30">
        <div className="min-w-[700px]">
          {/* Headers */}
          <div className="grid grid-cols-12 gap-4 items-center bg-slate-700/50 p-4 font-bold text-sky-300 text-xs uppercase tracking-wider">
            <div className="col-span-2">Provedor</div>
            <div className="col-span-4">API Key</div>
            <div className="col-span-3">Modelo</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-1 text-center">Ações</div>
          </div>
          {isLoading ? (
            <div className="text-center p-8">Carregando configurações...</div>
          ) : apiConfigs.length > 0 ? (
            apiConfigs.map((config, index) => (
              <div key={config.id} className={`grid grid-cols-12 gap-4 items-center p-4 ${index < apiConfigs.length - 1 ? 'border-b border-sky-700/40' : ''}`}>
                <div className="col-span-2">
                    <select
                        value={config.provider}
                        onChange={e => handleUpdate(config.id, 'provider', e.target.value as ApiConfig['provider'])}
                        className="w-full p-2 rounded-md bg-slate-700/50 border border-sky-600/70 text-sky-100 focus:ring-sky-500 focus:border-sky-500 text-sm"
                    >
                        {providerOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                 <div className="col-span-4">
                    <input
                        type="password"
                        value={config.apiKey}
                        onChange={e => handleUpdate(config.id, 'apiKey', e.target.value)}
                        placeholder="sk-..."
                        className="w-full p-2 rounded-md bg-slate-700/50 border border-sky-600/70 text-sky-100 focus:ring-sky-500 focus:border-sky-500 font-mono text-sm"
                    />
                 </div>
                 <div className="col-span-3">
                    <input
                        type="text"
                        value={config.model}
                        onChange={e => handleUpdate(config.id, 'model', e.target.value)}
                        className="w-full p-2 rounded-md bg-slate-700/50 border border-sky-600/70 text-sky-100 focus:ring-sky-500 focus:border-sky-500 font-mono text-sm"
                    />
                 </div>
                 <div className="col-span-2 flex justify-center">
                     <button
                        onClick={() => handleToggleActive(config.id)}
                        className={`w-20 py-2 px-3 rounded-md text-sm font-semibold transition-colors ${
                            config.isActive ? 'bg-sky-500 text-white cursor-default' : 'bg-slate-600 hover:bg-slate-500 text-sky-200'
                        }`}
                        disabled={config.isActive}
                     >
                        {config.isActive ? 'Ativo' : 'Ativar'}
                    </button>
                 </div>
                 <div className="col-span-1 flex justify-center">
                    <button
                        onClick={() => handleRemoveConfig(config.id)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        title="Remover Configuração"
                    >
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                 </div>
              </div>
            ))
          ) : (
            <div className="text-center text-sky-400 p-8">
              Nenhuma configuração de API encontrada. Clique em "Adicionar Configuração" para começar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiManagement;