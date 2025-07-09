import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { prisma } from '../../lib/prisma.ts';

export default async function handle(req: Request) {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const { message } = await req.json();
        
        const geminiProvider = await prisma.apiProvider.findFirst({
            where: {
                providerId: 'gemini',
                isActive: true,
            },
        });

        if (!geminiProvider || !geminiProvider.apiKey) {
            return new Response(JSON.stringify({ title: "Nova Conversa", type: "chat" }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        const ai = new GoogleGenAI({ apiKey: geminiProvider.apiKey });

        const prompt = `Com base na seguinte mensagem do usuário, gere um título curto e descritivo em português com 3 a 5 palavras para a conversa. Além disso, classifique o conteúdo como um destes tipos: 'note', 'youtube', 'pdf' ou 'chat'. Responda apenas com um único objeto JSON válido no formato: {"title": "Seu Título Aqui", "type": "chat"}. Mensagem do usuário: "${message}"`;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: geminiProvider.model || "gemini-2.5-flash",
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
        const result = {
            title: parsedData.title?.replace(/"/g, '') || "Nova Conversa",
            type: parsedData.type || "chat",
        };

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("Error in /api/generate-title:", error);
        return new Response(JSON.stringify({ title: "Nova Conversa", type: "chat" }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
}
