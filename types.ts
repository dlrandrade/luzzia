import { ReactNode } from 'react';

export interface Agent {
  id: string;
  name: string;
  avatar: ReactNode; // Using ReactNode for SVG icons
  promptSystem: string;
  personality: string; // Brief description of personality/function
}

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system', // For initial system prompt, not typically displayed
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string; // Using ISO string for easier storage and parsing
  avatar?: ReactNode;
}

export interface ChatSession {
  id: string;
  agentId: string;
  userId: string;
  title: string;
  messages: Message[];
  createdAt: string; // Using ISO string for easier storage and sorting
}

// New types for the backend service
export interface User {
  id: string;
  username: string;
  password?: string; // Only for backend/storage, should not be sent to client
  role: 'admin' | 'user';
  createdAt: string;
}

export interface ApiConfig {
  id: string;
  provider: 'Gemini' | 'OpenAI' | 'Groq' | 'OpenRouter';
  apiKey: string;
  model: string;
  isActive: boolean;
}

export interface Webhook {
  id:string;
  name: string;
  url: string;
  event: 'user_created' | 'payment_received'; // Example events
}
