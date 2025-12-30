import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-200">
      <header className="p-6 border-b border-slate-800 bg-black/50 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded flex items-center justify-center font-bold text-xl text-white shadow-lg">
            A
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            ACID <span className="text-slate-500 font-light">Transactions</span>
          </h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-4 md:p-6 pb-20">
        {children}
      </main>
    </div>
  );
};