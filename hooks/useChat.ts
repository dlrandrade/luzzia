import { useState, useCallback, useEffect, useRef } from 'react';
import { Agent, Message, MessageRole, ChatSession } from '../types';
import { GoogleGenAI, Chat } from "@google/genai";
import { generateChatTitle } from '../services/aiService';
import { backendService } from '../services/backendService';

const SESSIONS_STORAGE_KEY = 'luzzIA_chat_sessions';

// Initialize AI with the key from the backend service
const API_KEY = backendService.getActiveApiKey();
const ai = new GoogleGenAI({ apiKey: API_KEY });

const useChat = (agents: Agent[]) => {
  const [sessions, setSessions] = useState<Record<string, ChatSession>>({});
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const chatInstances = useRef<Record<string, Chat>>({});

  // Load sessions from localStorage on initial load
  useEffect(() => {
    if (!API_KEY) {
      setError("Chave de API do Gemini não configurada no painel de administração.");
    }
    try {
      const storedSessions = localStorage.getItem(SESSIONS_STORAGE_KEY);
      if (storedSessions) {
        setSessions(JSON.parse(storedSessions));
      }
    } catch (e) {
      console.error("Failed to load sessions from localStorage", e);
      setSessions({});
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    } catch (e)      {
      console.error("Failed to save sessions to localStorage", e);
    }
  }, [sessions]);

  const switchAgent = useCallback((agent: Agent) => {
    setCurrentAgent(agent);
    setActiveSessionId(null); // Deselect active chat when switching agent
  }, []);

  const selectSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
  }, []);
  
  const startNewChat = useCallback(() => {
    if (!currentAgent) return;
    const newSessionId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      agentId: currentAgent.id,
      title: "Nova Conversa",
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setSessions(prev => ({...prev, [newSessionId]: newSession}));
    setActiveSessionId(newSessionId);
  }, [currentAgent]);

  const sendMessage = useCallback(async (text: string) => {
    if (!activeSessionId || !currentAgent) {
      setError("Nenhuma sessão de chat ativa. Por favor, inicie uma nova conversa.");
      return;
    }
     if (!API_KEY) {
      setError("Chave de API do Gemini não configurada no painel de administração.");
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: MessageRole.USER,
      content: text,
      timestamp: new Date().toISOString(),
    };
    
    const wasFirstMessage = sessions[activeSessionId].messages.length === 0;

    // Update messages state immediately for better UX
    setSessions(prev => ({
        ...prev,
        [activeSessionId]: {
            ...prev[activeSessionId],
            messages: [...prev[activeSessionId].messages, userMessage]
        }
    }));
    
    setIsLoading(true);
    setError(null);
    
    try {
      const agent = agents.find(a => a.id === currentAgent.id);
      if (!agent) throw new Error("Agente não encontrado");

      const geminiHistory = sessions[activeSessionId].messages
        .filter(m => m.role === MessageRole.USER || m.role === MessageRole.ASSISTANT)
        .map(m => ({
          role: m.role === MessageRole.USER ? 'user' : 'model',
          parts: [{ text: m.content }],
        }));
      
      const modelName = backendService.getActiveModel();

      if (!chatInstances.current[activeSessionId]) {
        chatInstances.current[activeSessionId] = ai.chats.create({
            model: modelName,
            history: geminiHistory,
            config: {
                systemInstruction: agent.promptSystem,
            }
        });
      }
      
      const chat = chatInstances.current[activeSessionId];
      const stream = await chat.sendMessageStream({ message: text });
      
      const assistantMessageId = `assistant-${Date.now()}`;
      let fullResponse = "";

      // Add assistant message placeholder
      setSessions(prev => ({
          ...prev,
          [activeSessionId]: {
              ...prev[activeSessionId],
              messages: [
                  ...prev[activeSessionId].messages,
                  {
                      id: assistantMessageId,
                      role: MessageRole.ASSISTANT,
                      content: "",
                      timestamp: new Date().toISOString(),
                      avatar: agent.avatar,
                  }
              ]
          }
      }));

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        fullResponse += chunkText;
        setSessions(prev => {
            const currentMessages = prev[activeSessionId]?.messages || [];
            const updatedMessages = currentMessages.map(msg => 
                msg.id === assistantMessageId ? {...msg, content: fullResponse} : msg
            );
            return {
                ...prev,
                [activeSessionId]: {...prev[activeSessionId], messages: updatedMessages}
            }
        });
      }
      
      // After first exchange, generate a title
      if (wasFirstMessage && fullResponse) {
        const newTitle = await generateChatTitle(text, fullResponse);
        setSessions(prev => ({
            ...prev,
            [activeSessionId]: { ...prev[activeSessionId], title: newTitle }
        }));
      }

    } catch (err: any) {
      console.error("Erro no stream da IA (Gemini):", err);
      const errorMessage = `Erro da IA: ${err.message || "Não foi possível obter resposta."}`;
      setError(errorMessage);
      // Add error message to chat
       setSessions(prev => ({
          ...prev,
          [activeSessionId]: {
              ...prev[activeSessionId],
              messages: [
                  ...prev[activeSessionId].messages.filter(m => m.id !== `assistant-${Date.now()}`),
                   {
                      id: `error-${Date.now()}`,
                      role: MessageRole.SYSTEM,
                      content: errorMessage,
                      timestamp: new Date().toISOString(),
                  }
              ]
          }
      }));
    } finally {
      setIsLoading(false);
    }
  }, [activeSessionId, currentAgent, sessions, agents]);

  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => {
        const newSessions = {...prev};
        delete newSessions[sessionId];
        return newSessions;
    });
    if (activeSessionId === sessionId) {
        setActiveSessionId(null);
    }
    delete chatInstances.current[sessionId];
  }, [activeSessionId]);

  const renameSession = useCallback((sessionId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    setSessions(prev => ({
        ...prev,
        [sessionId]: {...prev[sessionId], title: newTitle.trim()}
    }));
  }, []);

  const exportSession = useCallback((sessionId: string) => {
    const session = sessions[sessionId];
    if (!session) return;
    
    const agent = agents.find(a => a.id === session.agentId);

    const fileContent = session.messages.map(msg => {
        const author = msg.role === MessageRole.USER ? "Usuário" : agent?.name || "Assistente";
        const time = new Date(msg.timestamp).toLocaleString();
        return `[${time}] ${author}:\n${msg.content}`;
    }).join('\n\n---------------------------------\n\n');

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${session.title}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [sessions, agents]);


  const agentSessions = Object.values(sessions)
    .filter(s => s.agentId === currentAgent?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const activeSession = activeSessionId ? sessions[activeSessionId] : null;

  return { 
    messages: activeSession?.messages || [], 
    isLoading, 
    error, 
    sendMessage, 
    currentAgent, 
    switchAgent, 
    activeSessionId,
    activeSessionTitle: activeSession?.title,
    selectSession,
    startNewChat,
    agentSessions,
    deleteSession,
    renameSession,
    exportSession,
    setError 
  };
};

export default useChat;
