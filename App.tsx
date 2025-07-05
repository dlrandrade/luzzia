import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import ChatPage from './components/ChatPage';
import AdminPage from './components/admin/AdminPage';
import UserManagement from './components/admin/UserManagement';
import AgentManagement from './components/admin/AgentManagement';
import ApiManagement from './components/admin/ApiManagement';
import WebhookManagement from './components/admin/WebhookManagement';
import { AGENTS as defaultAgents } from './constants';
import { Agent, User } from './types';
import { backendService } from './services/backendService';


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    // Check for a logged-in user in session storage
    const storedUser = sessionStorage.getItem('luzzIA_currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    // Load agents from backend and merge with component data
    const storedAgentsData = backendService.getAgents();
    const mergedAgents = defaultAgents.map(defaultAgent => {
        const storedAgent = storedAgentsData.find((a: Partial<Agent>) => a.id === defaultAgent.id);
        // Prioritize stored data but keep the avatar component
        return storedAgent ? { ...defaultAgent, ...storedAgent } : defaultAgent;
    });
    setAgents(mergedAgents);

  }, []);

  const handleLoginSuccess = useCallback((user: User) => {
    sessionStorage.setItem('luzzIA_currentUser', JSON.stringify(user));
    setCurrentUser(user);
  }, []);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('luzzIA_currentUser');
    setCurrentUser(null);
  }, []);
  
  const handleAgentsUpdate = useCallback((updatedAgents: Agent[]) => {
    const agentsToStore = updatedAgents.map(({ avatar, ...rest }) => rest);
    backendService.updateAgents(agentsToStore);
    setAgents(updatedAgents);
  }, []);

  // ProtectedRoute component for admin and chat
  const ProtectedRoute: React.FC<{isAdminRoute?: boolean}> = ({ isAdminRoute = false }) => {
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }
    if (isAdminRoute && currentUser.role !== 'admin') { 
      return <Navigate to="/chat" replace />;
    }
    return <Outlet />;
  };


  return (
    <HashRouter>
      <Routes>
        <Route
          path="/login"
          element={
            currentUser ? <Navigate to="/chat" replace /> : <LoginPage onLoginSuccess={handleLoginSuccess} />
          }
        />
        
        {/* Chat Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/chat" element={<ChatPage onLogout={handleLogout} currentUser={currentUser} agents={agents} />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute isAdminRoute={true} />}>
          <Route 
            element={<AdminPage onLogout={handleLogout} />}
          >
            <Route index element={<Navigate to="users" replace />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="agents" element={<AgentManagement agents={agents} onAgentsUpdate={handleAgentsUpdate} />} />
            <Route path="apis" element={<ApiManagement />} />
            <Route path="webhooks" element={<WebhookManagement />} />
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to={currentUser ? "/chat" : "/login"} replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
