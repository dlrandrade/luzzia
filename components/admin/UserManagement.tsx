import React, { useState, useEffect } from 'react';
import { PlusIcon, UserIcon } from '../icons'; // Using UserIcon for visual
import { backendService } from '../../services/backendService';
import { User } from '../../types';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const loadedUsers = backendService.getUsers();
    setUsers(loadedUsers);
    setIsLoading(false);
  }, []);

  // Modal and form state would be added here for Add/Edit functionality
  // For this example, we focus on displaying data from the backend service.

  return (
    <div className="text-sky-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold ">Gerenciamento de Usuários</h1>
        <button
          onClick={() => alert("Funcionalidade de adicionar usuário a ser implementada com o backend.")}
          className="flex items-center bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Adicionar Usuário
        </button>
      </div>

      <p className="mb-4 text-sm text-sky-300">
        Usuários são tipicamente criados via integração com Kiwify/Make.com através de Webhooks. Esta seção permite visualização e adição manual para fins administrativos.
      </p>

      <div className="bg-slate-800/60 shadow-xl rounded-lg overflow-hidden border border-sky-700/30">
        <table className="min-w-full divide-y divide-sky-700/50">
          <thead className="bg-slate-700/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-sky-300 uppercase tracking-wider">Usuário</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-sky-300 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-sky-300 uppercase tracking-wider">Data de Cadastro</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-sky-300 uppercase tracking-wider">Role</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-sky-300 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-slate-800/30 divide-y divide-sky-700/40">
            {isLoading ? (
              <tr><td colSpan={5} className="text-center p-8">Carregando usuários...</td></tr>
            ) : (
                users.map((user) => (
                <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-sky-100">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sky-300 font-mono">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sky-300">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sky-300">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-500/30 text-red-300' : 'bg-green-500/30 text-green-300'}`}>
                        {user.role}
                    </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => alert(`Editar usuário ${user.username} (a ser implementado)`)} className="text-sky-400 hover:text-sky-300 mr-3">Editar</button>
                    <button onClick={() => alert(`Excluir usuário ${user.username} (a ser implementado)`)} className="text-red-400 hover:text-red-300">Excluir</button>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
