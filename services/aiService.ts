import { GoogleGenAI } from "@google/genai";
import { backendService } from './backendService';

// This service is now used for stateless AI tasks, like generating a title.
// The main chat streaming logic is now in the useChat hook for better state management.

const API_KEY = backendService.getActiveApiKey();
const model = backendService.getActiveModel();

if (!API_KEY) {
  console.warn(
    "API_KEY for Gemini is not set in the admin panel or environment. " +
    "Please configure it in the admin panel. " +
    "It's strongly recommended to use a backend proxy to protect your API key in production."
  );
}

const ai = new GoogleGenAI({ apiKey: API_KEY });


export const generateChatTitle = async (
  userMessageContent: string,
  assistantMessageContent: string
): Promise<string> => {
  if (!API_KEY) {
    console.error("API Key not found, cannot generate title.");
    return "Nova Conversa";
  }

  try {
    const prompt = `Baseado na conversa abaixo, crie um título curto e descritivo com no máximo 5 palavras. Não use aspas.\n\nUsuário: "${userMessageContent}"\nAssistente: "${assistantMessageContent}"\n\nTítulo:`;
    
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
    });

    // Remove potential markdown and quotes
    let title = response.text.trim().replace(/^```[\w]*\s*|```$/g, "").trim();
    title = title.replace(/^"|"$/g, "");
    
    return title || "Nova Conversa";
  } catch (error) {
    console.error("Error generating title with Gemini:", error);
    return "Nova Conversa"; // Fallback title
  }
};
