import React, { useState, useEffect } from 'react';
import type { ApiProvider } from '../../types.ts';
import { KeyRoundIcon, PencilIcon, SaveIcon } from '../icons.tsx';

interface ApiManagementProps {
    apiProviders: ApiProvider[];
    onUpdate: (provider: ApiProvider) => void;
}

const ApiManagement: React.FC<ApiManagementProps> = ({ apiProviders, onUpdate }) => {
    const [apis, setApis] = useState<ApiProvider[]>(apiProviders);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        setApis(apiProviders);
    }, [apiProviders]);

    const handleFieldChange = (id: string, field: keyof ApiProvider, value: any) => {
        setApis(prevApis => prevApis.map(api => api.id === id ? { ...api, [field]: value } : api));
    };

    const handleSave = (id: string) => {
        const apiToSave = apis.find(api => api.id === id);
        if (apiToSave) {
            onUpdate(apiToSave);
        }
        setEditingId(null);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-200 flex items-center gap-3">
                <KeyRoundIcon className="w-6 h-6" />
                <span>Gestão de APIs</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {apis.map(api => (
                    <div key={api.id} className="bg-white dark:bg-stone-800/50 p-6 rounded-lg shadow-md border border-stone-200 dark:border-stone-700">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-2.5 h-2.5 rounded-full ${api.isActive ? 'bg-green-500' : 'bg-stone-400'}`}></div>
                                <h3 className="font-bold text-lg text-stone-800 dark:text-stone-200">{api.name}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={api.isActive} className="sr-only peer" onChange={(e) => handleFieldChange(api.id, 'isActive', e.target.checked)} />
                                    <div className="w-11 h-6 bg-stone-200 dark:bg-stone-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                                <button
                                    onClick={() => editingId === api.id ? handleSave(api.id) : setEditingId(api.id)}
                                    className="p-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 rounded-md hover:bg-stone-100 dark:hover:bg-stone-700"
                                >
                                    {editingId === api.id ? <SaveIcon className="w-5 h-5" /> : <PencilIcon className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor={`api-key-${api.id}`} className="text-sm font-medium text-stone-600 dark:text-stone-400 block mb-1">API Key</label>
                                <input
                                    type={editingId === api.id ? 'text' : 'password'}
                                    id={`api-key-${api.id}`}
                                    value={api.apiKey}
                                    onChange={(e) => handleFieldChange(api.id, 'apiKey', e.target.value)}
                                    readOnly={editingId !== api.id}
                                    className="w-full bg-stone-100 dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md px-3 py-2 text-sm text-stone-600 dark:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-500"
                                />
                            </div>
                            <div>
                                <label htmlFor={`api-model-${api.id}`} className="text-sm font-medium text-stone-600 dark:text-stone-400 block mb-1">Modelo</label>
                                 <input
                                    type="text"
                                    id={`api-model-${api.id}`}
                                    value={api.model}
                                    onChange={(e) => handleFieldChange(api.id, 'model', e.target.value)}
                                    disabled={editingId !== api.id}
                                    className="w-full bg-stone-100 dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md px-3 py-2 text-sm text-stone-800 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-500 disabled:text-stone-500 disabled:bg-stone-200 dark:disabled:bg-stone-700/50"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ApiManagement;
