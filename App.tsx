import React, { useState, useEffect } from 'react';
import LeftSidebar from './components/LeftSidebar.tsx';
import RightSidebar from './components/RightSidebar.tsx';
import ChatPanel from './components/ChatPanel.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import type { AdminAgent, AdminUser, ChatMessage, HistoryItem } from './types.ts';
import { generateChatResponse, generateTitleAndTypeForChat } from './services/geminiService.ts';
import { MoonIcon, SunIcon, AsteriskIcon, LayoutSidebarLeftCollapseIcon, LayoutSidebarRightCollapseIcon } from './components/icons.tsx';

const INITIAL_AGENTS: AdminAgent[] = [
  { id: 'luzzia', name: 'LuzzIA 2.0', description: 'Assistente de IA avançado para tarefas gerais.', prompt: 'Você é LuzzIA 2.0, uma IA...' },
  { id: 'ruptura', name: 'Ruptura', description: 'Especialista em ideação e brainstorming.', prompt: 'Você é Ruptura, uma IA...' },
  { id: 'carrossel', name: 'Carrossel Z3', description: 'Especialista em criação de conteúdo para redes sociais.', prompt: 'Você é Carrossel Z3, uma IA...' },
];

const INITIAL_HISTORY: HistoryItem[] = [
    { id: 'hist1', type: 'note', title: 'Be Succinct! (Writing for the We...)', summary: 'People read 25% slower onscreen, and they skim rather than read....', chatThreadId: 'thread1' },
    { id: 'hist2', type: 'youtube', title: 'AI VS Human: Who Writes Better Blogs That Get More Traffic?', summary: '', chatThreadId: 'thread2' },
    { id: 'hist3', type: 'youtube', title: 'The NEW Way to Win On Social Media in 2025', summary: '', chatThreadId: 'thread3' },
    { id: 'hist4', type: 'pdf', title: 'Writing for Social Media: Keep Your Voice & Change Your Tone', summary: '', chatThreadId: 'thread4' },
];

const INITIAL_USERS: AdminUser[] = [
    { id: 'user1', name: 'Daniel Luzz', email: 'daniel.luzz@example.com', role: 'Admin', lastLogin: '2024-07-29 10:30' },
    { id: 'user2', name: 'Bob', email: 'bob@example.com', role: 'User', lastLogin: '2024-07-28 15:00' },
    { id: 'user3', name: 'Charlie', email: 'charlie@example.com', role: 'User', lastLogin: '2024-07-29 09:15' },
];

const MOCK_USER = {
    name: 'Daniel Luzz',
    isAdmin: true, // Set to true to see admin link in ProfileMenu
};

type View = 'chat' | 'admin';

const App: React.FC = () => {
  const [view, setView] = useState<View>('chat');
  
  // Centralized state
  const [adminAgents, setAdminAgents] = useState<AdminAgent[]>(INITIAL_AGENTS);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_USERS);
  
  const [activeAgent, setActiveAgent] = useState<AdminAgent | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(INITIAL_HISTORY);
  
  const [chatThreads, setChatThreads] = useState<Record<string, ChatMessage[]>>({
    'thread1': [], 'thread2': [], 'thread3': [], 'thread4': [], 'thread_new': []
  });
  const [activeChatThreadId, setActiveChatThreadId] = useState<string>('thread_new');
  
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as 'light' | 'dark') || 'light';
  });

  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(true);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(true);

  useEffect(() => {
    if (adminAgents.length > 0 && !activeAgent) {
        setActiveAgent(adminAgents[0]);
    }
  }, [adminAgents, activeAgent]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  const handleSelectAgent = (agent: AdminAgent) => {
    if(agent.id !== activeAgent?.id) {
      startNewChat(agent);
    }
    setActiveAgent(agent);
  };
  
  const startNewChat = (withAgent: AdminAgent | null) => {
    const newThreadId = `thread_${Date.now()}`;
    setChatThreads(prev => ({ ...prev, [newThreadId]: [] }));
    setActiveChatThreadId(newThreadId);
    setActiveAgent(withAgent);
  };

  const handleSelectHistory = (chatThreadId: string) => {
    setActiveChatThreadId(chatThreadId);
    // Find agent associated with this chat history if possible, or keep the current one.
  };

  const handleSendMessage = async (messageText: string) => {
    if (!activeAgent) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: messageText,
    };
    
    const currentMessages = chatThreads[activeChatThreadId] || [];
    const isFirstMessage = currentMessages.length === 0;

    const updatedMessages = [...currentMessages, userMessage];
    setChatThreads(prev => ({ ...prev, [activeChatThreadId]: updatedMessages }));
    setIsLoading(true);

    const aiResponseText = await generateChatResponse(messageText, updatedMessages, activeAgent.name);

    const aiMessage: ChatMessage = {
      id: `ai_${Date.now()}`,
      sender: 'ai',
      text: aiResponseText,
      agentName: activeAgent.name
    };
    
    setChatThreads(prev => ({ ...prev, [activeChatThreadId]: [...updatedMessages, aiMessage] }));
    setIsLoading(false);

    if (isFirstMessage) {
        const { title, type } = await generateTitleAndTypeForChat(messageText);
        const newHistoryItem: HistoryItem = {
            id: `hist_${Date.now()}`,
            type: type,
            title: title,
            summary: messageText.length > 100 ? messageText.substring(0, 97) + '...' : messageText,
            chatThreadId: activeChatThreadId
        };
        const currentHistoryItemIndex = historyItems.findIndex(h => h.chatThreadId === activeChatThreadId);
        if (currentHistoryItemIndex !== -1) {
            setHistoryItems(prev => prev.map(h => h.chatThreadId === activeChatThreadId ? { ...h, title, type } : h));
        } else {
            setHistoryItems(prev => [newHistoryItem, ...prev]);
        }
    }
  };
  
  // Agent CRUD Handlers
  const handleAddAgent = (agent: Omit<AdminAgent, 'id'>) => {
    const newAgent = { ...agent, id: `agent_${Date.now()}` };
    setAdminAgents(prev => [...prev, newAgent]);
  };
  const handleUpdateAgent = (updatedAgent: AdminAgent) => {
    setAdminAgents(prev => prev.map(a => a.id === updatedAgent.id ? updatedAgent : a));
  };
  const handleDeleteAgent = (agentId: string) => {
    setAdminAgents(prev => prev.filter(a => a.id !== agentId));
  };

  // User CRUD Handlers
  const handleAddUser = (user: Omit<AdminUser, 'id' | 'lastLogin'>) => {
    const newUser = { ...user, id: `user_${Date.now()}`, lastLogin: new Date().toISOString().slice(0, 16).replace('T', ' ') };
    setAdminUsers(prev => [...prev, newUser]);
  };
  const handleUpdateUser = (updatedUser: AdminUser) => {
    setAdminUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };
  const handleDeleteUser = (userId: string) => {
    setAdminUsers(prev => prev.filter(u => u.id !== userId));
  };

  const activeChatMessages = chatThreads[activeChatThreadId] || [];
  const currentChatHistoryItem = historyItems.find(h => h.chatThreadId === activeChatThreadId);
  let chatTitle: string;
    if (activeChatMessages.length > 0 && currentChatHistoryItem) {
        chatTitle = currentChatHistoryItem.title;
    } else {
        chatTitle = activeAgent?.name || 'Nova Conversa';
    }

  return (
    <div className="h-[calc(100vh-20px)] w-full flex flex-col p-6 bg-transparent transition-colors duration-300">
      {view === 'chat' && (
        <header className="flex justify-between items-center py-2 px-2 w-full max-w-screen-2xl mx-auto">
            <div className={`flex-1 flex items-center gap-3 text-stone-800 dark:text-stone-200 transition-all duration-300 ${isLeftSidebarVisible ? 'pl-64' : 'pl-12'}`}>
                 <h1 className="flex items-baseline gap-2 text-3xl">
                    <AsteriskIcon className="w-6 h-6 text-blue-600" />
                    <span className="font-bold">LuzzIA</span>
                    <span className="font-normal text-stone-600 dark:text-stone-400 text-base">— Eu não sou uma IA comum.</span>
                </h1>
            </div>

            <div className="flex items-center gap-2">
                <button onClick={toggleTheme} className="p-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-700/50">
                    {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                </button>
            </div>
        </header>
      )}
      
      <div className="flex-1 flex justify-center items-stretch overflow-hidden">
        {view === 'chat' ? (
          <div className="flex h-full w-full max-w-screen-2xl gap-6">
            {isLeftSidebarVisible ? (
              <LeftSidebar 
                agents={adminAgents} 
                activeAgent={activeAgent} 
                onSelectAgent={handleSelectAgent} 
                onToggleCollapse={() => setIsLeftSidebarVisible(false)}
                user={MOCK_USER}
                onNavigateToAdmin={() => setView('admin')}
              />
            ) : (
                <div className="flex items-center h-full">
                    <button
                        onClick={() => setIsLeftSidebarVisible(true)}
                        className="p-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 rounded-full bg-white dark:bg-zinc-800 shadow-md border border-stone-200/80 dark:border-stone-700/60"
                        aria-label="Expandir barra lateral esquerda"
                    >
                        <LayoutSidebarLeftCollapseIcon className="w-5 h-5" />
                    </button>
                </div>
            )}
            <ChatPanel 
              agent={activeAgent} 
              messages={activeChatMessages} 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading} 
              chatTitle={chatTitle}
              user={MOCK_USER}
            />
            {isRightSidebarVisible ? (
              <RightSidebar 
                historyItems={historyItems} 
                onSelectHistory={handleSelectHistory} 
                onToggleCollapse={() => setIsRightSidebarVisible(false)}
              />
            ) : (
                <div className="flex items-center h-full">
                    <button
                        onClick={() => setIsRightSidebarVisible(true)}
                        className="p-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 rounded-full bg-white dark:bg-zinc-800 shadow-md border border-stone-200/80 dark:border-stone-700/60"
                        aria-label="Expandir barra lateral direita"
                    >
                        <LayoutSidebarRightCollapseIcon className="w-5 h-5" />
                    </button>
                </div>
            )}
          </div>
        ) : (
          <div className="flex h-full w-full max-w-screen-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-xl overflow-hidden border border-stone-200/80 dark:border-stone-700/60">
            <AdminPanel 
              onNavigateToChat={() => setView('chat')} 
              agents={adminAgents}
              users={adminUsers}
              onAddAgent={handleAddAgent}
              onUpdateAgent={handleUpdateAgent}
              onDeleteAgent={handleDeleteAgent}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;