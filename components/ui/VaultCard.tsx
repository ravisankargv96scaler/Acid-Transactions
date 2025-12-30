import React from 'react';

interface VaultCardProps {
  children: React.ReactNode;
  title: string;
  className?: string;
  icon?: React.ReactNode;
}

export const VaultCard: React.FC<VaultCardProps> = ({ children, title, className = '', icon }) => {
  return (
    <div className={`relative bg-slate-900 border-2 border-slate-700 rounded-lg shadow-xl overflow-hidden ${className}`}>
      {/* Metallic Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 p-3 border-b-2 border-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-amber-400">{icon}</span>}
          <h3 className="font-bold text-slate-200 uppercase tracking-wider text-sm">{title}</h3>
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-slate-600"></div>
          <div className="w-2 h-2 rounded-full bg-slate-600"></div>
          <div className="w-2 h-2 rounded-full bg-slate-600"></div>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-4 md:p-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        {children}
      </div>

      {/* Industrial corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-slate-500 rounded-tl-sm"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-slate-500 rounded-tr-sm"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-slate-500 rounded-bl-sm"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-slate-500 rounded-br-sm"></div>
    </div>
  );
};