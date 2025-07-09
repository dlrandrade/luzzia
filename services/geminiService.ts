import type { ChatMessage, HistoryItemType } from '../types.ts';

const MOCK_RESPONSE_TEXT = `Este é um texto de exemplo porque a chamada de API agora é feita no backend. Se você está vendo isso, a chamada para a API do seu servidor falhou.`;

export const generateChatResponse = async (
  prompt: string,
  history: ChatMessage[],
  agentName: string,
): Promise<string> => {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, history, agentName }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to get response from server.');
        }

        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error("Error generating chat response:", error);
        return `Desculpe, não consegui processar sua solicitação no momento. Erro: ${error instanceof Error ? error.message : String(error)}`;
    }
};

export const generateTitleAndTypeForChat = async (firstUserMessage: string): Promise<{ title: string; type: HistoryItemType }> => {
    const defaultResponse = { title: "Nova Conversa", type: 'chat' as HistoryItemType };
    
    try {
        const response = await fetch('/api/generate-title', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: firstUserMessage }),
        });

        if (!response.ok) {
             throw new Error('Failed to generate title from server.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error generating title and type:", error);
        return defaultResponse;
    }
};
