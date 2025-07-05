import React, { useState, useEffect } from 'react';
import { backendService } from '../../services/backendService';
import { Webhook } from '../../types';
import { PlusIcon } from '../icons';

const WebhookManagement: React.FC = () => {
    const [webhooks, setWebhooks] = useState<Webhook[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadedWebhooks = backendService.getWebhooks();
        setWebhooks(loadedWebhooks);
        setIsLoading(false);
    }, []);

    const handleSaveChanges = () => {
        backendService.updateWebhooks(webhooks);
        alert('Webhooks salvos com sucesso.');
    };
    
    const handleTestWebhook = (url: string) => {
        alert(`Simulando envio de um evento de teste para:\n${url}\n\nEm uma aplicação real, isso faria uma requisição POST com dados de exemplo.`);
    };

    return (
        <div className="text-sky-100">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold">Gerenciamento de Webhooks</h1>
                <div>
                     <button
                        onClick={() => alert("Funcionalidade a ser implementada.")}
                        className="flex items-center bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow mr-4"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Adicionar Webhook
                    </button>
                    {/* <button
                        onClick={handleSaveChanges}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow"
                    >
                        Salvar Alterações
                    </button> */}
                </div>
            </div>

            <p className="mb-4 text-sm text-sky-300">
                Webhooks são usados por serviços externos (como Kiwify) para notificar sua aplicação sobre eventos, como a criação de um novo usuário após um pagamento.
            </p>

            <div className="bg-slate-800/60 shadow-xl rounded-lg overflow-hidden border border-sky-700/30">
                <table className="min-w-full divide-y divide-sky-700/50">
                    <thead className="bg-slate-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-sky-300 uppercase tracking-wider">Nome</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-sky-300 uppercase tracking-wider">URL do Endpoint</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-sky-300 uppercase tracking-wider">Evento</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-sky-300 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-slate-800/30 divide-y divide-sky-700/40">
                        {isLoading ? (
                            <tr><td colSpan={4} className="text-center p-8">Carregando webhooks...</td></tr>
                        ) : (
                            webhooks.map(hook => (
                                <tr key={hook.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-sky-100">{hook.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sky-300 font-mono">{hook.url}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-500/30 text-purple-300">
                                            {hook.event}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onClick={() => handleTestWebhook(hook.url)} className="text-green-400 hover:text-green-300 mr-3">Testar</button>
                                        <button onClick={() => alert('Funcionalidade a ser implementada.')} className="text-sky-400 hover:text-sky-300 mr-3">Editar</button>
                                        <button onClick={() => alert('Funcionalidade a ser implementada.')} className="text-red-400 hover:text-red-300">Excluir</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WebhookManagement;
