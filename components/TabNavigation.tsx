import React from 'react';
import { TabId } from '../types';

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs = [
  { id: TabId.CONCEPT, label: 'Concept' },
  { id: TabId.ATOMICITY, label: 'Atomicity (A)' },
  { id: TabId.CONSISTENCY, label: 'Consistency (C)' },
  { id: TabId.ISOLATION, label: 'Isolation (I)' },
  { id: TabId.DURABILITY, label: 'Durability (D)' },
  { id: TabId.QUIZ, label: 'Summary & Quiz' },
];

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex flex-wrap gap-2 p-2 bg-slate-900 border-b border-slate-700 sticky top-0 z-50 shadow-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            px-4 py-2 rounded font-mono text-sm font-bold transition-all duration-200 border-2
            ${activeTab === tab.id 
              ? 'bg-emerald-600 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] translate-y-0.5' 
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750 hover:border-slate-500 hover:text-slate-200'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};