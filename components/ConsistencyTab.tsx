import React, { useState } from 'react';
import { LogEntry } from '../types';
import { VaultCard } from './ui/VaultCard';
import { SystemLog } from './ui/SystemLog';
import { Scale, ShieldCheck, Ban, ArrowRight } from 'lucide-react';

export const ConsistencyTab: React.FC = () => {
  const [balance, setBalance] = useState(50);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [animationState, setAnimationState] = useState<'idle' | 'calculating' | 'rejected' | 'success'>('idle');

  const addLog = (message: string, type: LogEntry['type']) => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36),
      timestamp: new Date().toLocaleTimeString().split(' ')[0],
      message,
      type
    }]);
  };

  const handleWithdraw = () => {
    const amount = parseInt(withdrawAmount);
    if (isNaN(amount) || amount <= 0) return;

    setAnimationState('calculating');
    addLog(`Attempting to withdraw $${amount}...`, 'info');

    setTimeout(() => {
      const predictedBalance = balance - amount;
      
      addLog(`Constraint Check: New Balance (${predictedBalance}) >= 0?`, 'warning');

      setTimeout(() => {
        if (predictedBalance < 0) {
          setAnimationState('rejected');
          addLog(`VIOLATION: Balance cannot be negative. Transaction Rejected.`, 'error');
          setTimeout(() => setAnimationState('idle'), 2000);
        } else {
          setBalance(predictedBalance);
          setAnimationState('success');
          setWithdrawAmount('');
          addLog(`Constraint OK. Transaction Committed. New Balance: $${predictedBalance}`, 'success');
          setTimeout(() => setAnimationState('idle'), 2000);
        }
      }, 800);
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="flex flex-col gap-6">
        <VaultCard title="Rule Enforcer (Consistency)" icon={<Scale className="w-5 h-5" />}>
           <div className="bg-slate-800 p-6 rounded-lg border border-slate-600 mb-6">
             <h3 className="text-slate-400 text-sm uppercase mb-2 font-bold tracking-widest">Database Record</h3>
             <div className="flex justify-between items-center bg-black/40 p-4 rounded border border-slate-700 font-mono">
               <div>
                 <div className="text-slate-500 text-xs">USER_ID</div>
                 <div className="text-slate-200">ALICE_01</div>
               </div>
               <div className="text-right">
                 <div className="text-slate-500 text-xs">CURRENT_BALANCE</div>
                 <div className={`text-2xl font-bold transition-colors duration-500 ${animationState === 'success' ? 'text-emerald-400' : 'text-slate-200'}`}>
                   ${balance}
                 </div>
               </div>
             </div>
             
             <div className="mt-4 flex items-center gap-2 text-xs text-amber-500 bg-amber-900/20 p-2 rounded border border-amber-900/50">
               <ShieldCheck className="w-4 h-4" />
               <span>ACTIVE CONSTRAINT: BALANCE_CHECK (balance &gt;= 0)</span>
             </div>
           </div>

           <div className="flex gap-4 items-end">
             <div className="flex-1">
               <label className="block text-sm font-bold text-slate-400 mb-2">Withdraw Amount ($)</label>
               <input 
                  type="number" 
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount..."
                  className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                  disabled={animationState !== 'idle'}
               />
             </div>
             <button
               onClick={handleWithdraw}
               disabled={animationState !== 'idle' || !withdrawAmount}
               className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3 px-6 rounded shadow-[0_4px_0_rgb(6,95,70)] active:shadow-none active:translate-y-1 transition-all h-[50px]"
             >
               Withdraw
             </button>
           </div>
        </VaultCard>

        <VaultCard title="What is Consistency?">
          <p className="text-slate-300">
            Consistency ensures that data only moves from one valid state to another valid state. The database enforces rules (constraints).
          </p>
          <ul className="list-disc list-inside mt-4 text-slate-400 space-y-2">
            <li>If a transaction violates a rule, it is rejected entirely.</li>
            <li>The database never ends up in an invalid state (like a negative balance).</li>
          </ul>
        </VaultCard>
      </div>

      <div className="flex flex-col gap-6">
        <VaultCard title="Logic Gate" className="flex-1 min-h-[300px] flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center relative">
             {/* The Wall Visual */}
             <div className={`w-full h-2 bg-slate-700 rounded my-8 relative overflow-hidden`}>
                <div className={`absolute top-0 left-0 h-full bg-emerald-500 transition-all duration-[800ms] ease-out`}
                  style={{ width: animationState === 'idle' ? '0%' : '100%' }}
                ></div>
             </div>

             <div className="absolute inset-0 flex items-center justify-center">
                {animationState === 'calculating' && (
                  <div className="bg-slate-900 border border-blue-500 text-blue-400 px-6 py-3 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                    <Scale className="animate-bounce w-5 h-5" /> Calculating Result...
                  </div>
                )}
                {animationState === 'rejected' && (
                   <div className="bg-red-950 border-2 border-red-500 text-red-500 px-8 py-6 rounded-lg flex flex-col items-center gap-2 shadow-[0_0_30px_rgba(239,68,68,0.6)] animate-pulse z-10">
                     <Ban className="w-12 h-12" />
                     <span className="text-2xl font-bold font-mono">REJECTED</span>
                     <span className="text-sm">Constraint Violation</span>
                   </div>
                )}
                {animationState === 'success' && (
                   <div className="bg-emerald-950 border-2 border-emerald-500 text-emerald-400 px-8 py-6 rounded-lg flex flex-col items-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.6)] z-10">
                     <ShieldCheck className="w-12 h-12" />
                     <span className="text-2xl font-bold font-mono">ACCEPTED</span>
                     <span className="text-sm">Valid State</span>
                   </div>
                )}
             </div>
          </div>
          <div className="mt-4">
             <SystemLog logs={logs} />
          </div>
        </VaultCard>
      </div>
    </div>
  );
};