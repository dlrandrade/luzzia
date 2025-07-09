

export interface Agent {
  id: string;
  name: string;
}

export type MessageSender = 'user' | 'ai';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  agentName?: string;
}

export type HistoryItemType = 'note' | 'youtube' | 'pdf' | 'chat';

export interface HistoryItem {
  id: string;
  type: HistoryItemType;
  title: string;
  summary: string;
  chatThreadId: string;
}

// Admin Panel Types
export interface ApiProvider {
    id: string;
    providerId: 'groq' | 'gemini' | 'openai' | 'openrouter';
    name: string;
    apiKey: string;
    isActive: boolean;
    model: string;
}

export interface AdminAgent extends Agent {
    prompt: string;
    description: string;
}

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'User';
    lastLogin: string;
}

export interface WebhookEvent {
    id: string;
    status: 'Success' | 'Failed';
    event: string;
    timestamp: string;
}
