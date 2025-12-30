import React, { useState, useEffect } from 'react';
import { LogEntry } from '../types';
import { VaultCard } from './ui/VaultCard';
import { SystemLog } from './ui/SystemLog';
import { ShieldAlert, RefreshCw, Send, ServerCrash, Landmark } from 'lucide-react';

export const ConceptTab: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState<'idle' | 'transferring' | 'crashed' | 'restored'>('idle');
  const [aliceBalance, setAliceBalance] = useState(1000);
  const [bobBalance, setBobBalance] = useState(500);
  const [transferProgress, setTransferProgress] = useState(0);

  const addLog = (message: string, type: LogEntry['type']) => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36),
      timestamp: new Date().toLocaleTimeString().split(' ')[0],
      message,
      type
    }]);
  };

  const startTransfer = () => {
    setStatus('transferring');
    setTransferProgress(0);
    setAliceBalance(900); // Immediate deduct
    addLog('Transaction started: Transfer $100 from Alice to Bob', 'info');
    addLog('Alice balance deducted: $900', 'info');
  };

  useEffect(() => {
    let interval: any;
    if (status === 'transferring') {
      interval = setInterval(() => {
        setTransferProgress(prev => {
          if (prev >= 50) {
            clearInterval(interval);
            setStatus('crashed');
            addLog('CRITICAL ERROR: System Crash at 50% completion!', 'error');
            return 50;
          }
          return prev + 2;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (status === 'crashed') {
      setTimeout(() => {
        addLog('Initiating Automatic Rollback Protocol...', 'warning');
        setStatus('restored');
      }, 1500);
    }
  }, [status]);

  useEffect(() => {
    if (status === 'restored') {
      setTimeout(() => {
        setTransferProgress(0);
        setAliceBalance(1000); // Refund
        addLog('Rollback Complete: Money returned to Alice.', 'success');
        addLog('System State Restored. Data Integrity Preserved.', 'success');
        setTimeout(() => setStatus('idle'), 1000);
      }, 1000);
    }
  }, [status]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <div className="flex flex-col gap-6">
        <VaultCard title="Transaction Visualizer" icon={<Landmark className="w-5 h-5" />}>
          <div className="flex justify-between items-center relative h-48 px-4">
            {/* Alice Vault */}
            <div className="flex flex-col items-center z-10">
              <div className={`w-24 h-24 border-4 rounded-lg flex items-center justify-center bg-slate-800 transition-colors duration-300 ${status === 'restored' ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'border-slate-500'}`}>
                <div className="text-center">
                  <div className="text-xs text-slate-400">ALICE</div>
                  <div className="text-xl font-bold font-mono text-emerald-400">${aliceBalance}</div>
                </div>
              </div>
            </div>

            {/* Path */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-700 -translate-y-1/2 z-0"></div>

            {/* Money Packet */}
            {status !== 'idle' && (
              <div 
                className={`absolute top-1/2 -translate-y-1/2 transition-all duration-75 z-20 flex flex-col items-center`}
                style={{ left: `${20 + (transferProgress * 0.6)}%` }}
              >
                <div className={`p-2 rounded-full border-2 ${status === 'crashed' ? 'bg-red-900 border-red-500 animate-pulse' : 'bg-emerald-900 border-emerald-500'}`}>
                  {status === 'crashed' ? <ServerCrash className="w-6 h-6 text-red-400" /> : <span className="text-xs font-bold text-emerald-400">$100</span>}
                </div>
                {status === 'crashed' && <span className="text-xs text-red-500 font-bold mt-1 bg-black/80 px-1 rounded">FAILURE</span>}
              </div>
            )}

            {/* Bob Vault */}
            <div className="flex flex-col items-center z-10">
               <div className="w-24 h-24 border-4 border-slate-500 rounded-lg flex items-center justify-center bg-slate-800">
                <div className="text-center">
                  <div className="text-xs text-slate-400">BOB</div>
                  <div className="text-xl font-bold font-mono text-emerald-400">${bobBalance}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <button
              onClick={startTransfer}
              disabled={status !== 'idle'}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded shadow-[0_4px_0_rgb(6,95,70)] active:shadow-none active:translate-y-1 transition-all"
            >
              {status === 'idle' ? <Send className="w-4 h-4" /> : <RefreshCw className="w-4 h-4 animate-spin" />}
              {status === 'idle' ? 'Start Transfer ($100)' : 'Processing...'}
            </button>
          </div>
        </VaultCard>

        <VaultCard title="Concept Explanation" icon={<ShieldAlert className="w-5 h-5" />}>
           <p className="text-slate-300 leading-relaxed mb-4">
            A <strong>Transaction</strong> is a single unit of work. In the banking example, moving money involves two steps:
           </p>
           <ol className="list-decimal list-inside text-slate-400 space-y-2 mb-4">
             <li>Subtract from Sender</li>
             <li>Add to Receiver</li>
           </ol>
           <p className="text-slate-300 leading-relaxed">
             If the system crashes after step 1 but before step 2, the money would disappear! ACID transactions guarantee that if any part fails, the entire transaction <strong>Rolls Back</strong> to the start state.
           </p>
        </VaultCard>
      </div>

      <div className="h-full">
        <VaultCard title="System Console" className="h-full">
           <SystemLog logs={logs} />
           <div className="mt-4 p-4 border border-slate-700 rounded bg-black/50">
             <div className="text-sm font-bold text-slate-300 mb-2">Current State Snapshot</div>
             <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>Status: <span className={`${status === 'idle' ? 'text-emerald-400' : status === 'crashed' ? 'text-red-500' : 'text-amber-400'}`}>{status.toUpperCase()}</span></div>
                <div>Lock ID: <span className="text-slate-500">{status === 'idle' ? 'NULL' : 'TXN_001'}</span></div>
             </div>
           </div>
        </VaultCard>
      </div>
    </div>
  );
};