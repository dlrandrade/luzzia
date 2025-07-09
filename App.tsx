import React, { useState, useEffect, useCallback } from 'react';
import LeftSidebar from './components/LeftSidebar.tsx';
import RightSidebar from './components/RightSidebar.tsx';
import ChatPanel from './components/ChatPanel.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import type { AdminAgent, AdminUser, ChatMessage, HistoryItem, ApiProvider } from './types.ts';
import { generateChatResponse, generateTitleAndTypeForChat } from './services/geminiService.ts';
import { MoonIcon, SunIcon, AsteriskIcon, LayoutSidebarLeftCollapseIcon, LayoutSidebarRightCollapseIcon } from './components/icons.tsx';

const MOCK_USER = {
    name: 'Daniel Luzz',
    isAdmin: true,
};

type View = 'chat' | 'admin';

const App: React.FC = () => {
  const [view, setView] = useState<View>('chat');
  
  // Centralized state, now fetched from the API
  const [adminAgents, setAdminAgents] = useState<AdminAgent[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [apiProviders, setApiProviders] = useState<ApiProvider[]>([]);
  
  const [activeAgent, setActiveAgent] = useState<AdminAgent | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  
  const [chatThreads, setChatThreads] = useState<Record<string, ChatMessage[]>>({});
  const [activeChatThreadId, setActiveChatThreadId] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as 'light' | 'dark') || 'light';
  });

  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(true);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(true);

  const fetchAllData = useCallback(async () => {
    try {
      const [agentsRes, historyRes, usersRes, providersRes] = await Promise.all([
        fetch('/api/agents'),
        fetch('/api/history'),
        fetch('/api/users'),
        fetch('/api/providers')
      ]);

      const agents = await agentsRes.json();
      const { history, chats } = await historyRes.json();
      const users = await usersRes.json();
      const providers = await providersRes.json();
      
      setAdminAgents(agents);
      setHistoryItems(history);
      setChatThreads(chats);
      setAdminUsers(users.map((u: any) => ({...u, lastLogin: new Date(u.lastLogin).toLocaleString()})));
      setApiProviders(providers);

      if (agents.length > 0) {
        setActiveAgent(agents[0]);
      }
      if (history.length > 0) {
        setActiveChatThreadId(history[0].chatThreadId);
      } else {
        startNewChat(agents.length > 0 ? agents[0] : null);
      }
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    } finally {
      setIsDataLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

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
  };
  
  const startNewChat = (withAgent: AdminAgent | null) => {
    const newThreadId = `temp_${Date.now()}`;
    setChatThreads(prev => ({ ...prev, [newThreadId]: [] }));
    setActiveChatThreadId(newThreadId);
    setActiveAgent(withAgent);
  };

  const handleSelectHistory = (chatThreadId: string) => {
    setActiveChatThreadId(chatThreadId);
    // Future improvement: find agent associated with this chat history.
  };

  const handleSendMessage = async (messageText: string) => {
    if (!activeAgent || !activeChatThreadId) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: messageText,
    };

    const currentMessages = chatThreads[activeChatThreadId] || [];
    const isNewChat = activeChatThreadId.startsWith('temp_');
    
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

    const finalMessages = [...updatedMessages, aiMessage];
    
    try {
        if (isNewChat) {
            const { title, type } = await generateTitleAndTypeForChat(messageText);
            const summary = messageText.length > 100 ? messageText.substring(0, 97) + '...' : messageText;
            
            const response = await fetch('/api/history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, type, summary, messages: finalMessages }),
            });
            const { newHistoryItem, newChatThreadId } = await response.json();

            setHistoryItems(prev => [newHistoryItem, ...prev]);
            setChatThreads(prev => {
                const newThreads = { ...prev };
                delete newThreads[activeChatThreadId];
                newThreads[newChatThreadId] = finalMessages;
                return newThreads;
            });
            setActiveChatThreadId(newChatThreadId);
        } else {
            // Update existing thread
            await fetch(`/api/history/${activeChatThreadId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [userMessage, aiMessage] }),
            });
            setChatThreads(prev => ({ ...prev, [activeChatThreadId]: finalMessages }));
        }
    } catch (error) {
        console.error("Failed to save chat:", error);
        // Handle error state in UI if necessary
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleAddAgent = async (agent: Omit<AdminAgent, 'id'>) => {
    const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agent)
    });
    const newAgent = await response.json();
    setAdminAgents(prev => [...prev, newAgent]);
  };
  const handleUpdateAgent = async (updatedAgent: AdminAgent) => {
    const response = await fetch(`/api/agents/${updatedAgent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAgent)
    });
    const savedAgent = await response.json();
    setAdminAgents(prev => prev.map(a => a.id === savedAgent.id ? savedAgent : a));
  };
  const handleDeleteAgent = async (agentId: string) => {
    await fetch(`/api/agents/${agentId}`, { method: 'DELETE' });
    setAdminAgents(prev => prev.filter(a => a.id !== agentId));
  };

  const handleAddUser = async (user: Omit<AdminUser, 'id' | 'lastLogin'>) => {
     const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    const newUser = await response.json();
    setAdminUsers(prev => [...prev, {...newUser, lastLogin: new Date(newUser.lastLogin).toLocaleString()}]);
  };
  const handleUpdateUser = async (updatedUser: AdminUser) => {
    const response = await fetch(`/api/users/${updatedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
    });
    const savedUser = await response.json();
    setAdminUsers(prev => prev.map(u => u.id === savedUser.id ? {...savedUser, lastLogin: new Date(savedUser.lastLogin).toLocaleString()} : u));
  };
  const handleDeleteUser = async (userId: string) => {
    await fetch(`/api/users/${userId}`, { method: 'DELETE' });
    setAdminUsers(prev => prev.filter(u => u.id !== userId));
  };

   const handleUpdateApiProvider = async (provider: ApiProvider) => {
    const response = await fetch(`/api/providers/${provider.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(provider),
    });
    const updatedProvider = await response.json();
    setApiProviders(prev => prev.map(p => p.id === updatedProvider.id ? updatedProvider : p));
  };

  const activeChatMessages = activeChatThreadId ? chatThreads[activeChatThreadId] || [] : [];
  const currentChatHistoryItem = historyItems.find(h => h.chatThreadId === activeChatThreadId);
  let chatTitle: string;
    if (activeChatMessages.length > 0 && currentChatHistoryItem) {
        chatTitle = currentChatHistoryItem.title;
    } else {
        chatTitle = activeAgent?.name || 'Nova Conversa';
    }

  if (!isDataLoaded) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-stone-100 dark:bg-zinc-950">
        <p className="text-stone-600 dark:text-stone-400">Carregando LuzzIA...</p>
      </div>
    );
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
                <button onClick={() => startNewChat(activeAgent)} className="px-4 py-2 text-sm font-medium bg-white dark:bg-stone-700/50 border border-stone-200/80 dark:border-stone-600/80 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors">
                    Nova Conversa
                </button>
                <button onClick={toggleTheme} className="p-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-700/50">
                    {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                </button>
            </div>
        </header>
      )}
      
      <div className="flex-1 flex justify-center items-stretch overflow-hidden mt-4">
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
              apiProviders={apiProviders}
              onAddAgent={handleAddAgent}
              onUpdateAgent={handleUpdateAgent}
              onDeleteAgent={handleDeleteAgent}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              onUpdateApiProvider={handleUpdateApiProvider}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
