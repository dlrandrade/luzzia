import React, { useState } from 'react';
import type { AdminUser } from '../../types.ts';
import { UsersIcon, PencilIcon, PlusCircleIcon, TrashIcon } from '../icons.tsx';
import UserFormModal from './UserFormModal.tsx';

interface UserManagementProps {
    users: AdminUser[];
    onAdd: (user: Omit<AdminUser, 'id' | 'lastLogin'>) => void;
    onUpdate: (user: AdminUser) => void;
    onDelete: (userId: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onAdd, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

    const handleAddNew = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user: AdminUser) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = (userId: string) => {
        if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
            onDelete(userId);
        }
    };

    const handleSave = (userData: Omit<AdminUser, 'id' | 'lastLogin'> | AdminUser) => {
        if ('id' in userData) {
            onUpdate(userData);
        } else {
            onAdd(userData);
        }
        setIsModalOpen(false);
    };
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-200 flex items-center gap-3">
                    <UsersIcon className="w-6 h-6" />
                    <span>Gestão de Usuários</span>
                </h2>
                <button 
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>Adicionar Usuário</span>
                </button>
            </div>
             <div className="bg-white dark:bg-stone-800/50 rounded-lg shadow-md border border-stone-200 dark:border-stone-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-stone-50 dark:bg-stone-700/50">
                        <tr>
                            <th className="p-4 font-semibold text-sm text-stone-600 dark:text-stone-300">Nome</th>
                            <th className="p-4 font-semibold text-sm text-stone-600 dark:text-stone-300">Email</th>
                            <th className="p-4 font-semibold text-sm text-stone-600 dark:text-stone-300">Função</th>
                            <th className="p-4 font-semibold text-sm text-stone-600 dark:text-stone-300">Último Login</th>
                            <th className="p-4 font-semibold text-sm text-stone-600 dark:text-stone-300 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="p-4 text-stone-800 dark:text-stone-200 font-medium">{user.name}</td>
                                <td className="p-4 text-stone-600 dark:text-stone-400">{user.email}</td>
                                <td className="p-4 text-stone-600 dark:text-stone-400">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'Admin' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-stone-100 text-stone-800 dark:bg-stone-900/50 dark:text-stone-300'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-stone-600 dark:text-stone-400">{user.lastLogin}</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEdit(user)} className="p-2 text-stone-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-stone-100 dark:hover:bg-stone-700"><PencilIcon /></button>
                                        <button onClick={() => handleDelete(user.id)} className="p-2 text-stone-500 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-stone-100 dark:hover:bg-stone-700"><TrashIcon /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && (
                <UserFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    user={editingUser}
                />
            )}
        </div>
    );
};

export default UserManagement;