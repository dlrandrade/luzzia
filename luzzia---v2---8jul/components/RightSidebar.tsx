import React from 'react';
import type { HistoryItem, HistoryItemType } from '../types.ts';
import { LayoutSidebarRightCollapseIcon, NoteIcon, PdfIcon, YoutubeIcon } from './icons.tsx';

interface RightSidebarProps {
  historyItems: HistoryItem[];
  onSelectHistory: (chatThreadId: string) => void;
  onToggleCollapse: () => void;
}

const HistoryIcon: React.FC<{ type: HistoryItemType }> = ({ type }) => {
  const commonClasses = "w-5 h-5 text-stone-500 dark:text-stone-400 mr-3 mt-1";
  switch (type) {
    case 'youtube':
      return <YoutubeIcon className={commonClasses} />;
    case 'pdf':
      return <PdfIcon className={commonClasses} />;
    case 'note':
    case 'chat':
    default:
      return <NoteIcon className={commonClasses} />;
  }
};


const RightSidebar: React.FC<RightSidebarProps> = ({ historyItems, onSelectHistory, onToggleCollapse }) => {
  return (
    <aside className="w-80 bg-[#f3f3f2] dark:bg-zinc-800 p-4 flex flex-col rounded-2xl transition-all duration-300">
      <div className="flex justify-between items-center text-stone-600 dark:text-stone-400">
        <h2 className="font-bold text-lg">Histórico</h2>
        <button onClick={onToggleCollapse} className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200">
            <LayoutSidebarRightCollapseIcon className="w-5 h-5" />
        </button>
      </div>
      <hr className="my-4 border-stone-300 dark:border-stone-600"/>
      <div className="flex-1 flex flex-col space-y-3 overflow-y-auto pr-1">
        {historyItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => onSelectHistory(item.chatThreadId)}
            className="bg-white dark:bg-stone-700/50 p-3 rounded-xl dark:hover:bg-stone-700 transition-all text-left border border-stone-200/80 dark:border-stone-600/80"
          >
            <div className="flex items-start">
              <HistoryIcon type={item.type} />
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-stone-800 dark:text-stone-200">{item.title}</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">{item.summary}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default RightSidebar;