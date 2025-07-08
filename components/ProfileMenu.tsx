import React, { useState, useRef, useEffect } from 'react';
import { UserIcon, SettingsIcon, HelpCircleIcon, LogOutIcon, LayoutDashboardIcon } from './icons.tsx';

interface ProfileMenuProps {
  user: {
    name: string;
    isAdmin: boolean;
  };
  onNavigateToAdmin: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ user, onNavigateToAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigateToAdmin();
    setIsOpen(false);
  }

  const menuItems = [
    { label: 'Editar Perfil', icon: SettingsIcon, action: () => {} },
    { label: 'Ajuda', icon: HelpCircleIcon, action: () => {} },
    { label: 'Sair', icon: LogOutIcon, action: () => {} },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <div 
        className={`absolute bottom-full mb-2 w-full bg-white dark:bg-stone-700 rounded-lg shadow-xl border border-stone-200 dark:border-stone-600 overflow-hidden z-10 transition-all duration-200 ease-in-out
          ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}
      >
        <nav className="flex flex-col p-1">
          {user.isAdmin && (
            <button
              onClick={handleAdminClick}
              className="flex items-center gap-3 px-3 py-2 text-sm text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-600 rounded-md transition-colors w-full"
            >
              <LayoutDashboardIcon className="w-4 h-4" />
              <span>Painel</span>
            </button>
          )}
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="flex items-center gap-3 px-3 py-2 text-sm text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-600 rounded-md transition-colors w-full"
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-2 rounded-lg text-left text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700/70 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-stone-300 dark:bg-stone-600 flex items-center justify-center font-bold text-stone-600 dark:text-stone-300">
          {user.name.charAt(0)}
        </div>
        <span className="font-semibold text-sm">{user.name}</span>
      </button>
    </div>
  );
};

export default ProfileMenu;