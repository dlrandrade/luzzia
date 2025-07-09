import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { prisma } from '../../lib/prisma.ts';

export default async function handle(req: Request) {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const { prompt, history, agentName } = await req.json();

        // Find active Gemini provider to get the API key securely from DB
        const geminiProvider = await prisma.apiProvider.findFirst({
            where: {
                providerId: 'gemini',
                isActive: true,
            },
        });

        if (!geminiProvider || !geminiProvider.apiKey) {
            return new Response(JSON.stringify({ message: 'Gemini provider is not configured or active.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
        
        // Use the API Key from the database
        const ai = new GoogleGenAI({ apiKey: geminiProvider.apiKey });

        const modelInstruction = `Você é ${agentName}, uma IA avançada. Responda ao prompt do usuário em português, mantendo sua personalidade distinta e usando markdown para a formatação. A conversa anterior é fornecida como contexto.`;
        const chatHistory = history.map((msg: any) => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: geminiProvider.model || "gemini-2.5-flash",
            contents: [...chatHistory, { role: 'user', parts: [{ text: prompt }] }],
            config: {
                systemInstruction: modelInstruction,
                temperature: 0.8,
            }
        });
        
        const text = response.text;

        return new Response(JSON.stringify({ text }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("Error in /api/chat:", error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return new Response(JSON.stringify({ message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
