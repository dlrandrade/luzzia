import { User, Agent, ApiConfig, Webhook } from '../types';
import { AGENTS as defaultAgents } from '../constants';

const USERS_KEY = 'luzzIA_users';
const AGENTS_KEY = 'luzzIA_agents';
const API_CONFIGS_KEY = 'luzzIA_api_configs';
const WEBHOOKS_KEY = 'luzzIA_webhooks';

class BackendService {
  constructor() {
    this.seedInitialData();
  }

  // ============== INITIAL DATA SEEDING ==============
  private seedInitialData() {
    this.seedUsers();
    this.seedAgents();
    this.seedApiConfigs();
    this.seedWebhooks();
  }

  private seedUsers() {
    if (!localStorage.getItem(USERS_KEY)) {
      const initialUsers: User[] = [
        { id: 'user-1', username: 'admin', password: 'admin', role: 'admin', createdAt: new Date().toISOString() },
        { id: 'user-2', username: 'user', password: 'user', role: 'user', createdAt: new Date().toISOString() },
      ];
      localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
    }
  }

    private seedAgents() {
        if (!localStorage.getItem(AGENTS_KEY)) {
            // Store agents without the non-serializable avatar component
            const agentsToStore = defaultAgents.map(({ avatar, ...rest }) => rest);
            localStorage.setItem(AGENTS_KEY, JSON.stringify(agentsToStore));
        }
    }

  private seedApiConfigs() {
    if (!localStorage.getItem(API_CONFIGS_KEY)) {
      const initialApiConfigs: ApiConfig[] = [
        { id: 'api-1', provider: 'Gemini', apiKey: process.env.API_KEY || '', model: 'gemini-2.5-flash-preview-04-17', isActive: true },
        { id: 'api-2', provider: 'Groq', apiKey: '', model: 'llama-3-70b-instruct', isActive: false },
        { id: 'api-3', provider: 'OpenAI', apiKey: '', model: 'gpt-4o', isActive: false },
        { id: 'api-4', provider: 'OpenRouter', apiKey: '', model: 'anthropic/claude-3-opus', isActive: false },
      ];
      localStorage.setItem(API_CONFIGS_KEY, JSON.stringify(initialApiConfigs));
    }
  }

  private seedWebhooks() {
    if (!localStorage.getItem(WEBHOOKS_KEY)) {
        const initialWebhooks: Webhook[] = [
            { id: 'hook-1', name: 'Novo Usuário (Kiwify)', url: 'https://seusite.com/api/webhooks/kiwify', event: 'user_created' }
        ];
        localStorage.setItem(WEBHOOKS_KEY, JSON.stringify(initialWebhooks));
    }
  }


  // ============== AUTHENTICATION ==============
  login(username: string, password_provided: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = this.getUsers(true); // Get users with passwords
        const user = users.find(u => u.username === username && u.password === password_provided);
        if (user) {
          const { password, ...userWithoutPassword } = user;
          resolve(userWithoutPassword);
        } else {
          reject(new Error("Credenciais inválidas."));
        }
      }, 500); // Simulate network delay
    });
  }

  // ============== USER MANAGEMENT ==============
  getUsers(includePasswords = false): User[] {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as User[];
    if (includePasswords) {
        return users;
    }
    return users.map(({ password, ...user }) => user);
  }
  
  addUser(user: Omit<User, 'id' | 'createdAt'>, password_provided: string): User {
      const users = this.getUsers(true);
      const newUser: User = {
          ...user,
          id: `user-${Date.now()}`,
          createdAt: new Date().toISOString(),
          password: password_provided
      };
      const updatedUsers = [...users, newUser];
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
  }

  // updateUser and deleteUser would be implemented similarly

  // ============== AGENT MANAGEMENT ==============
  getAgents(): Omit<Agent, 'avatar'>[] {
    return JSON.parse(localStorage.getItem(AGENTS_KEY) || '[]');
  }

  updateAgents(agents: Omit<Agent, 'avatar'>[]): void {
    localStorage.setItem(AGENTS_KEY, JSON.stringify(agents));
  }

  // ============== API CONFIG MANAGEMENT ==============
  getApiConfigs(): ApiConfig[] {
    return JSON.parse(localStorage.getItem(API_CONFIGS_KEY) || '[]');
  }

  updateApiConfigs(configs: ApiConfig[]): void {
    localStorage.setItem(API_CONFIGS_KEY, JSON.stringify(configs));
  }
  
  getActiveApiKey(): string {
      const configs = this.getApiConfigs();
      const activeConfig = configs.find(c => c.isActive && c.provider === 'Gemini');
      return activeConfig?.apiKey || process.env.API_KEY || "";
  }
    
  getActiveModel(): string {
      const configs = this.getApiConfigs();
      const activeConfig = configs.find(c => c.isActive && c.provider === 'Gemini');
      return activeConfig?.model || 'gemini-2.5-flash-preview-04-17';
  }

  // ============== WEBHOOK MANAGEMENT ==============
  getWebhooks(): Webhook[] {
    return JSON.parse(localStorage.getItem(WEBHOOKS_KEY) || '[]');
  }
  
  updateWebhooks(webhooks: Webhook[]): void {
      localStorage.setItem(WEBHOOKS_KEY, JSON.stringify(webhooks));
  }
}

export const backendService = new BackendService();
