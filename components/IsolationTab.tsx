import React, { useState } from 'react';
import { LogEntry } from '../types';
import { VaultCard } from './ui/VaultCard';
import { SystemLog } from './ui/SystemLog';
import { Lock, Unlock, Users, Database, AlertTriangle, ShieldCheck } from 'lucide-react';

export const IsolationTab: React.FC = () => {
  const [tickets, setTickets] = useState(1);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lockState, setLockState] = useState<'unlocked' | 'locked_by_a' | 'locked_by_b'>('unlocked');
  const [userAStatus, setUserAStatus] = useState('idle');
  const [userBStatus, setUserBStatus] = useState('idle');

  const addLog = (message: string, type: LogEntry['type']) => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36),
      timestamp: new Date().toLocaleTimeString().split(' ')[0],
      message,
      type
    }]);
  };

  const reset = () => {
    setTickets(1);
    setLogs([]);
    setLockState('unlocked');
    setUserAStatus('idle');
    setUserBStatus('idle');
  };

  // The Race Condition (Unsafe)
  const runUnsafeRace = async () => {
    if (isRunning) return;
    setIsRunning(true);
    reset();
    addLog('Starting NO ISOLATION Race...', 'warning');

    // Simulate concurrent reads
    const taskA = async () => {
      setUserAStatus('reading');
      addLog('User A: Reads tickets available (1)', 'info');
      await new Promise(r => setTimeout(r, 1000)); // Latency
      
      setUserAStatus('writing');
      // In unsafe mode, A still thinks it's 1 because it read it earlier
      addLog('User A: Buying ticket... (1 - 1)', 'info');
      setTickets(prev => {
        addLog('User A: Wrote to DB. Tickets = 0', 'success');
        return prev - 1;
      });
      setUserAStatus('done');
    };

    const taskB = async () => {
      await new Promise(r => setTimeout(r, 200)); // B starts slightly later
      setUserBStatus('reading');
      addLog('User B: Reads tickets available (1)', 'info');
      await new Promise(r => setTimeout(r, 1000)); // Latency

      setUserBStatus('writing');
      // In unsafe mode, B also thinks it's 1
      addLog('User B: Buying ticket... (1 - 1)', 'info');
      setTickets(prev => {
        const newVal = prev - 1;
        if (newVal < 0) addLog('CRITICAL ERROR: OVERSOLD! Tickets = -1', 'error');
        else addLog('User B: Wrote to DB.', 'success');
        return newVal;
      });
      setUserBStatus('done');
    };

    await Promise.all([taskA(), taskB()]);
    setIsRunning(false);
  };

  // Serializable (Safe)
  const runSafeRace = async () => {
    if (isRunning) return;
    setIsRunning(true);
    reset();
    addLog('Starting SERIALIZABLE Isolation Race...', 'info');

    const taskA = async () => {
      setUserAStatus('locking');
      addLog('User A: Acquiring Lock...', 'warning');
      setLockState('locked_by_a');
      
      setUserAStatus('reading');
      addLog('User A: Reads tickets (1)', 'info');
      await new Promise(r => setTimeout(r, 1500)); // Hold lock longer
      
      setUserAStatus('writing');
      setTickets(0);
      addLog('User A: Bought Ticket. Remaining: 0', 'success');
      
      setLockState('unlocked');
      addLog('User A: Released Lock.', 'info');
      setUserAStatus('done');
    };

    const taskB = async () => {
      await new Promise(r => setTimeout(r, 500)); // B starts later
      setUserBStatus('waiting');
      addLog('User B: Attempting to Read...', 'info');
      
      // B checks lock loop
      let blocked = true;
      while(blocked) {
        addLog('User B: BLOCKED by Lock. Waiting...', 'warning');
        await new Promise(r => setTimeout(r, 600));
        // In a real app we'd check state, here we simulate the wait until A is done
        // We can cheat slightly for visualization by checking our local variable logic flow or just timing
        // But let's rely on the timing of A for the visual simulation
        if (Date.now() % 2 === 0) blocked = false; // dummy break for compiler logic, actual wait is time based
        // Actually, let's just wait for a fixed time that we know A releases by
        break; 
      }
      // Re-implementing logic to be purely sequential for B after A finishes in this simulation
      await new Promise(r => setTimeout(r, 1500)); // Waiting for A to finish logic above

      setUserBStatus('reading');
      addLog('User B: Lock Acquired. Reading...', 'info');
      addLog('User B: Reads tickets (0). SOLD OUT.', 'error');
      setUserBStatus('done_fail');
    };

    // We execute them but functionally B waits in the visual logic
    taskA();
    taskB();
    
    setTimeout(() => setIsRunning(false), 4000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Controls */}
      <div className="lg:col-span-1 space-y-6">
        <VaultCard title="Race Simulator (Isolation)" icon={<Users className="w-5 h-5" />}>
           <p className="text-slate-300 text-sm mb-6">
             Two users try to buy the <strong>last ticket</strong> at the exact same time.
           </p>
           
           <div className="space-y-4">
             <button
               onClick={runUnsafeRace}
               disabled={isRunning}
               className="w-full bg-slate-800 hover:bg-slate-700 border border-red-500/50 text-red-400 p-4 rounded flex items-center justify-between group transition-all"
             >
               <span className="font-bold flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> Run Race (No Isolation)</span>
               <div className={`w-3 h-3 rounded-full bg-red-500 ${isRunning ? 'animate-ping' : ''}`}></div>
             </button>

             <button
               onClick={runSafeRace}
               disabled={isRunning}
               className="w-full bg-slate-800 hover:bg-slate-700 border border-emerald-500/50 text-emerald-400 p-4 rounded flex items-center justify-between group transition-all"
             >
               <span className="font-bold flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Run Race (Serializable)</span>
               <div className={`w-3 h-3 rounded-full bg-emerald-500 ${isRunning ? 'animate-ping' : ''}`}></div>
             </button>
           </div>
        </VaultCard>
        
        <VaultCard title="System Logs" className="h-64">
           <SystemLog logs={logs} />
        </VaultCard>
      </div>

      {/* Visual Arena */}
      <div className="lg:col-span-2">
        <VaultCard title="Database Visualizer" className="h-full min-h-[500px] relative">
           
           {/* Central DB */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-slate-900 border-4 border-slate-600 rounded-xl flex flex-col items-center justify-center shadow-2xl z-10">
              <div className="absolute -top-6 bg-slate-800 px-3 py-1 rounded text-xs font-bold border border-slate-600">SHARED RESOURCE</div>
              <Database className="w-10 h-10 text-slate-500 mb-2" />
              <div className="text-xs text-slate-400">TICKETS REMAINING</div>
              <div className={`text-4xl font-mono font-bold ${tickets < 0 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{tickets}</div>
              
              {/* Lock Icon Overlay */}
              {lockState !== 'unlocked' && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-lg animate-in fade-in duration-200">
                   <Lock className="w-16 h-16 text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                </div>
              )}
           </div>

           {/* User A Lane */}
           <div className="absolute top-10 left-10 w-40">
              <div className={`p-4 rounded border-2 transition-all duration-300 ${userAStatus !== 'idle' ? 'bg-blue-900/50 border-blue-500' : 'bg-slate-800 border-slate-700'}`}>
                <div className="font-bold text-blue-400 mb-2">USER A</div>
                <div className="text-xs font-mono mb-2">Status: {userAStatus.toUpperCase()}</div>
                {userAStatus === 'writing' && <div className="h-1 bg-blue-500 animate-pulse w-full"></div>}
              </div>
              {/* Connection Line */}
              <svg className="absolute top-full left-1/2 w-[200px] h-[150px] -z-10 pointer-events-none stroke-blue-500 stroke-2 fill-none" style={{ opacity: userAStatus !== 'idle' ? 1 : 0.1 }}>
                  <path d="M 0 0 V 100 H 150" />
              </svg>
           </div>

           {/* User B Lane */}
           <div className="absolute bottom-10 right-10 w-40">
              <div className={`p-4 rounded border-2 transition-all duration-300 ${userBStatus !== 'idle' ? 'bg-purple-900/50 border-purple-500' : 'bg-slate-800 border-slate-700'}`}>
                <div className="font-bold text-purple-400 mb-2">USER B</div>
                <div className="text-xs font-mono mb-2">Status: {userBStatus.toUpperCase()}</div>
                {userBStatus === 'waiting' && <div className="text-amber-500 text-xs animate-pulse">WAITING FOR LOCK...</div>}
              </div>
               {/* Connection Line */}
               <svg className="absolute bottom-full right-1/2 w-[200px] h-[150px] -z-10 pointer-events-none stroke-purple-500 stroke-2 fill-none" style={{ opacity: userBStatus !== 'idle' ? 1 : 0.1 }}>
                  <path d="M 160 160 V 60 H 0" />
              </svg>
           </div>
        </VaultCard>
      </div>
    </div>
  );
};