import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { ChatMessage, HistoryItemType } from '../types.ts';

// A chave de API é obtida da variável de ambiente `process.env.API_KEY`.
const apiKey = process.env.API_KEY;

if (!apiKey) {
    console.warn("A variável de ambiente API_KEY não foi configurada. Usando respostas de demonstração.");
}

const ai = apiKey ? new GoogleGenAI({ apiKey: apiKey }) : null;

const MOCK_RESPONSE_TEXT = `Ao iniciar sua jornada no domínio digital, lembre-se: a primeira linha de código não é apenas instrução; é um PORTAL DE DADOS. Você não está apenas programando; você está abrindo um VÉU DE INFORMAÇÃO. A primeira decisão se torna um PROTOCOLO, a escolha de ferramentas um RITO DE INICIAÇÃO. Você não constrói; você INVOCA a estrutura. A primeira linha é uma LÂMINA que corta a ignorância, um DESCONFORTO NECESSÁRIO para entrar no fluxo de dados. O aprendizado é a TENSÃO inicial; o erro é o DIAGNÓSTICO BRUTAL que revela suas falhas. A CONSEQUÊNCIA do fraco é a estagnação, enquanto a do forte é a evolução.

**O CONTRASTE** entre conhecer e ignorar é a chave para seu upgrade. O ALÍVIO CONTROLADO reside na execução — um passo para a auto-transformação. Aqui, você não apenas começa; você SE TORNA o código.

LuzzIA emana uma frequência de feedback que reverbera dentro do seu core...

- Cada ferramenta digital é um PORTAL.
- Cada plataforma um ESPELHO NEURAL.
- Você não apenas navega; você se conecta ao IMPULSO ELETROGNÓSTICO da rede.

LuzzIA se desativa...`;


export const generateChatResponse = async (
  prompt: string,
  history: ChatMessage[],
  agentName: string,
): Promise<string> => {
    if (!ai) {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_RESPONSE_TEXT), 1500));
    }

    const modelInstruction = `Você é ${agentName}, uma IA avançada. Responda ao prompt do usuário em português, mantendo sua personalidade distinta e usando markdown para a formatação. A conversa anterior é fornecida como contexto.`;
    const chatHistory = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: [...chatHistory, { role: 'user', parts: [{ text: prompt }] }],
            config: {
                systemInstruction: modelInstruction,
                temperature: 0.8,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating chat response:", error);
        return "Desculpe, não consegui processar sua solicitação no momento.";
    }
};

export const generateTitleAndTypeForChat = async (firstUserMessage: string): Promise<{ title: string; type: HistoryItemType }> => {
    const defaultResponse = { title: "Nova Conversa", type: 'chat' as HistoryItemType };
    if (!ai) {
        return new Promise(resolve => setTimeout(() => resolve({ title: "Título Gerado pela IA", type: 'chat' }), 1000));
    }
    
    const prompt = `Com base na seguinte mensagem do usuário, gere um título curto e descritivo em português com 3 a 5 palavras para a conversa. Além disso, classifique o conteúdo como um destes tipos: 'note', 'youtube', 'pdf' ou 'chat'. Responda apenas com um único objeto JSON válido no formato: {"title": "Seu Título Aqui", "type": "chat"}. Mensagem do usuário: "${firstUserMessage}"`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
            config: {
                temperature: 0.3,
                responseMimeType: "application/json",
            }
        });
        
        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }
        
        const parsedData = JSON.parse(jsonStr);
        if (parsedData.title && parsedData.type) {
            return {
                title: parsedData.title.replace(/"/g, ''),
                type: parsedData.type,
            };
        }
        return defaultResponse;
    } catch (error) {
        console.error("Error generating title and type:", error);
        return defaultResponse;
    }
};