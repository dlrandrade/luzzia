import React, { useState } from 'react';
import type { WebhookEvent } from '../../types.ts';
import { WebhookIcon, SaveIcon } from '../icons.tsx';

const MOCK_WEBHOOK_URL = "https://hook.make.com/abcdef123456";

const MOCK_WEBHOOK_EVENTS: WebhookEvent[] = [
    { id: 'evt1', status: 'Success', event: 'user.created', timestamp: '2024-07-29 11:05:12' },
    { id: 'evt2', status: 'Success', event: 'user.created', timestamp: '2024-07-29 11:04:30' },
    { id: 'evt3', status: 'Failed', event: 'user.created', timestamp: '2024-07-29 10:59:01' },
    { id: 'evt4', status: 'Success', event: 'user.created', timestamp: '2024-07-28 20:15:45' },
];

const WebhookManagement: React.FC = () => {
    const [webhookUrl, setWebhookUrl] = useState(MOCK_WEBHOOK_URL);
    
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-200 flex items-center gap-3">
                <WebhookIcon className="w-6 h-6" />
                <span>Gestão de Webhook</span>
            </h2>

            <div className="bg-white dark:bg-stone-800/50 p-6 rounded-lg shadow-md border border-stone-200 dark:border-stone-700">
                <h3 className="text-lg font-semibold text-stone-700 dark:text-stone-300 mb-2">URL do Webhook (Kiwify/Make.com)</h3>
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        className="flex-grow bg-stone-100 dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md px-3 py-2 text-sm text-stone-600 dark:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-500"
                    />
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <SaveIcon className="w-4 h-4" />
                        <span>Salvar</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-stone-800/50 p-6 rounded-lg shadow-md border border-stone-200 dark:border-stone-700">
                <h3 className="text-lg font-semibold text-stone-700 dark:text-stone-300 mb-4">Log de Eventos Recentes</h3>
                 <div className="overflow-hidden border border-stone-200 dark:border-stone-700 rounded-md">
                    <table className="w-full text-left">
                        <thead className="bg-stone-50 dark:bg-stone-700/50">
                            <tr>
                                <th className="p-3 font-semibold text-sm text-stone-600 dark:text-stone-300">Status</th>
                                <th className="p-3 font-semibold text-sm text-stone-600 dark:text-stone-300">Evento</th>
                                <th className="p-3 font-semibold text-sm text-stone-600 dark:text-stone-300">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
                            {MOCK_WEBHOOK_EVENTS.map(event => (
                                <tr key={event.id}>
                                    <td className="p-3">
                                         <span className={`px-2 py-1 text-xs font-semibold rounded-full ${event.status === 'Success' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-stone-600 dark:text-stone-400 font-mono text-sm">{event.event}</td>
                                    <td className="p-3 text-stone-600 dark:text-stone-400 font-mono text-sm">{event.timestamp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default WebhookManagement;