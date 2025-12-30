import React, { useState, useEffect } from 'react';
import { LogEntry } from '../types';
import { VaultCard } from './ui/VaultCard';
import { SystemLog } from './ui/SystemLog';
import { HardDrive, Cpu, Zap, Save, Power, PowerOff } from 'lucide-react';

export const DurabilityTab: React.FC = () => {
  const [power, setPower] = useState(true);
  const [ramData, setRamData] = useState<string | null>(null);
  const [diskData, setDiskData] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isCommitting, setIsCommitting] = useState(false);

  const addLog = (message: string, type: LogEntry['type']) => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36),
      timestamp: new Date().toLocaleTimeString().split(' ')[0],
      message,
      type
    }]);
  };

  const commitData = async () => {
    if (!power || isCommitting) return;
    setIsCommitting(true);
    addLog('Transaction Submitted. Writing to Memory...', 'info');
    
    // Write to RAM
    setRamData('User Data: { id: 101, val: "A" }');
    await new Promise(r => setTimeout(r, 800));
    
    // Check if power still on
    if (!power) { 
        setIsCommitting(false); 
        return; 
    }

    addLog('Flushing Memory to Disk (WAL)...', 'warning');
    await new Promise(r => setTimeout(r, 1500)); // Disk is slower

    if (!power) {
        setIsCommitting(false);
        return;
    }

    setDiskData('User Data: { id: 101, val: "A" }');
    addLog('SUCCESS: Data Persisted to Disk.', 'success');
    setIsCommitting(false);
  };

  const togglePower = () => {
    const newPower = !power;
    setPower(newPower);
    if (!newPower) {
      addLog('CRITICAL: POWER LOSS DETECTED', 'error');
      setRamData(null); // Volatile memory wiped
      setIsCommitting(false); // Process stops
    } else {
      addLog('System Boot Sequence Initiated...', 'info');
      addLog('Checking Disk Integrity...', 'info');
      if (diskData) {
        addLog('RECOVERY: Data found on Disk. Restoring state.', 'success');
      } else {
        addLog('Disk Empty. No committed transactions found.', 'info');
      }
    }
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-opacity duration-1000 ${power ? 'opacity-100' : 'opacity-40 grayscale'}`}>
      <div className="space-y-6">
        <VaultCard title="Durability Lab" icon={<Zap className="w-5 h-5 text-amber-400" />}>
          <div className="flex gap-4 mb-8">
            <button
              onClick={commitData}
              disabled={!power || isCommitting || !!diskData}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-4 rounded shadow-[0_4px_0_rgb(6,95,70)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {isCommitting ? 'Committing...' : diskData ? 'Data Saved' : 'Commit Data'}
            </button>

            <button
              onClick={togglePower}
              className={`flex-1 font-bold py-4 rounded shadow-[0_4px_0_rgba(0,0,0,0.5)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2 ${power ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_4px_0_rgb(153,27,27)]' : 'bg-emerald-500 text-white shadow-[0_4px_0_rgb(6,95,70)]'}`}
            >
              {power ? <PowerOff className="w-5 h-5" /> : <Power className="w-5 h-5" />}
              {power ? 'Kill Power' : 'Restore Power'}
            </button>
          </div>

          <div className="space-y-4">
            {/* RAM */}
            <div className={`p-4 rounded border-2 flex items-center gap-4 transition-all duration-300 ${ramData ? 'bg-blue-900/30 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-slate-800 border-slate-700'}`}>
               <Cpu className={`w-8 h-8 ${ramData ? 'text-blue-400' : 'text-slate-600'}`} />
               <div className="flex-1">
                 <div className="text-xs font-bold text-slate-400 uppercase">Volatile Memory (RAM)</div>
                 <div className="font-mono text-sm h-6 flex items-center">
                   {ramData || <span className="text-slate-600 italic">Empty</span>}
                 </div>
               </div>
               {isCommitting && !ramData && power && <div className="text-xs text-blue-400 animate-pulse">WRITING...</div>}
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
               <div className={`w-1 h-8 ${isCommitting && ramData && !diskData && power ? 'bg-amber-500 animate-pulse' : 'bg-slate-700'}`}></div>
            </div>

            {/* DISK */}
             <div className={`p-4 rounded border-2 flex items-center gap-4 transition-all duration-300 ${diskData ? 'bg-emerald-900/30 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-800 border-slate-700'}`}>
               <HardDrive className={`w-8 h-8 ${diskData ? 'text-emerald-400' : 'text-slate-600'}`} />
               <div className="flex-1">
                 <div className="text-xs font-bold text-slate-400 uppercase">Persistent Storage (HDD)</div>
                 <div className="font-mono text-sm h-6 flex items-center">
                   {diskData || <span className="text-slate-600 italic">Empty</span>}
                 </div>
               </div>
               {isCommitting && ramData && !diskData && power && <div className="text-xs text-amber-400 animate-pulse">PERSISTING...</div>}
            </div>
          </div>
        </VaultCard>
      </div>

      <div className="h-full">
         <VaultCard title="Power Event Log" className="h-full">
           <SystemLog logs={logs} />
           {!power && (
             <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
               <div className="text-center">
                 <PowerOff className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                 <h2 className="text-3xl font-bold text-slate-500">SYSTEM OFFLINE</h2>
               </div>
             </div>
           )}
         </VaultCard>
      </div>
    </div>
  );
};