import React, { useState, useEffect } from 'react';
import type { AdminAgent } from '../../types.ts';

interface AgentFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (agent: Omit<AdminAgent, 'id'> | AdminAgent) => void;
    agent: AdminAgent | null;
}

const AgentFormModal: React.FC<AgentFormModalProps> = ({ isOpen, onClose, onSave, agent }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        prompt: ''
    });

    useEffect(() => {
        if (agent) {
            setFormData({
                name: agent.name,
                description: agent.description,
                prompt: agent.prompt
            });
        } else {
            setFormData({ name: '', description: '', prompt: '' });
        }
    }, [agent, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (agent) {
            onSave({ ...agent, ...formData });
        } else {
            onSave(formData);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-stone-800 rounded-lg shadow-2xl w-full max-w-lg p-8 m-4"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-6 text-stone-800 dark:text-stone-200">
                    {agent ? 'Editar Agente' : 'Adicionar Novo Agente'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Nome do Agente</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full bg-stone-50 dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md px-3 py-2 text-sm text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Descrição</label>
                        <input
                            type="text"
                            name="description"
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="w-full bg-stone-50 dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md px-3 py-2 text-sm text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="prompt" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Prompt do Sistema</label>
                        <textarea
                            name="prompt"
                            id="prompt"
                            value={formData.prompt}
                            onChange={handleChange}
                            required
                            rows={6}
                            className="w-full bg-stone-50 dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md px-3 py-2 text-sm text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 bg-stone-200 text-stone-800 rounded-lg hover:bg-stone-300 dark:bg-stone-600 dark:text-stone-200 dark:hover:bg-stone-500 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AgentFormModal;