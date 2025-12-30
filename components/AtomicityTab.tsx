import React, { useState, useEffect } from 'react';
import { LogEntry, SimulationStep } from '../types';
import { VaultCard } from './ui/VaultCard';
import { SystemLog } from './ui/SystemLog';
import { Layers, CheckCircle, XCircle, RefreshCcw, Play } from 'lucide-react';

export const AtomicityTab: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [settings, setSettings] = useState({
    stockSuccess: true,
    paymentSuccess: true,
    orderSuccess: false // Default to fail for demo
  });
  
  const [steps, setSteps] = useState<SimulationStep[]>([
    { id: 1, label: 'Deduct Stock Inventory', status: 'pending' },
    { id: 2, label: 'Charge Customer Card', status: 'pending' },
    { id: 3, label: 'Create Order Record', status: 'pending' },
  ]);

  const addLog = (message: string, type: LogEntry['type']) => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36),
      timestamp: new Date().toLocaleTimeString().split(' ')[0],
      message,
      type
    }]);
  };

  const reset = () => {
    setSteps(steps.map(s => ({ ...s, status: 'pending' })));
    setLogs([]);
  };

  const runSimulation = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    reset();
    
    addLog('START: E-Commerce Transaction ID #9982', 'info');
    
    // Step 1
    await processStep(0, settings.stockSuccess);
    if (!settings.stockSuccess) {
       await abortTransaction(0);
       return;
    }

    // Step 2
    await processStep(1, settings.paymentSuccess);
    if (!settings.paymentSuccess) {
      await abortTransaction(1);
      return;
    }

    // Step 3
    await processStep(2, settings.orderSuccess);
    if (!settings.orderSuccess) {
      await abortTransaction(2);
      return;
    }

    addLog('SUCCESS: Transaction Committed.', 'success');
    setIsProcessing(false);
  };

  const processStep = async (index: number, success: boolean) => {
    setSteps(prev => prev.map((s, i) => i === index ? { ...s, status: 'active' } : s));
    await new Promise(r => setTimeout(r, 800)); // Work delay
    
    if (success) {
      setSteps(prev => prev.map((s, i) => i === index ? { ...s, status: 'success' } : s));
      addLog(`Step ${index + 1} OK: ${steps[index].label}`, 'info');
    } else {
      setSteps(prev => prev.map((s, i) => i === index ? { ...s, status: 'failed' } : s));
      addLog(`Step ${index + 1} FAILED: ${steps[index].label}`, 'error');
    }
  };

  const abortTransaction = async (failedIndex: number) => {
    addLog('Atomicity Violation Detected! Initiating Rollback...', 'warning');
    
    // Iterate backwards from failed index - 1
    for (let i = failedIndex - 1; i >= 0; i--) {
      await new Promise(r => setTimeout(r, 600));
      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'rolled_back' } : s));
      addLog(`Reversing Step ${i + 1}: ${steps[i].label} undone.`, 'warning');
    }
    
    addLog('TRANSACTION ABORTED. State is clean.', 'error');
    setIsProcessing(false);
  };

  const getStatusColor = (status: SimulationStep['status']) => {
    switch (status) {
      case 'pending': return 'bg-slate-700 text-slate-400 border-slate-600';
      case 'active': return 'bg-blue-900 text-blue-200 border-blue-500 animate-pulse';
      case 'success': return 'bg-emerald-900 text-emerald-200 border-emerald-500';
      case 'failed': return 'bg-rose-900 text-rose-200 border-rose-500';
      case 'rolled_back': return 'bg-amber-900/50 text-amber-200 border-amber-600';
    }
  };

  const getStatusIcon = (status: SimulationStep['status']) => {
    switch (status) {
      case 'pending': return <div className="w-5 h-5 rounded-full border-2 border-slate-500" />;
      case 'active': return <RefreshCcw className="w-5 h-5 animate-spin" />;
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'failed': return <XCircle className="w-5 h-5" />;
      case 'rolled_back': return <RefreshCcw className="w-5 h-5 rotate-180" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <VaultCard title="The Checklist (Atomicity)" icon={<Layers className="w-5 h-5" />}>
           <div className="flex flex-col gap-4">
             {steps.map((step) => (
               <div key={step.id} className={`flex items-center justify-between p-4 border-l-4 rounded-r-md transition-all duration-300 ${getStatusColor(step.status)}`}>
                 <span className="font-mono font-bold">0{step.id} {step.label}</span>
                 {getStatusIcon(step.status)}
               </div>
             ))}
           </div>

           <div className="mt-8 border-t border-slate-700 pt-6">
             <h4 className="text-sm font-bold text-slate-300 mb-3 uppercase">Simulation Configuration</h4>
             <div className="space-y-2 mb-6">
               <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-800 rounded">
                 <input 
                    type="checkbox" 
                    checked={settings.stockSuccess}
                    onChange={e => setSettings({...settings, stockSuccess: e.target.checked})}
                    className="w-5 h-5 rounded border-slate-500 text-emerald-500 focus:ring-emerald-500 bg-slate-700"
                    disabled={isProcessing}
                  />
                 <span className="text-slate-300">Step 1 Succeeds (Inventory)</span>
               </label>
               <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-800 rounded">
                 <input 
                    type="checkbox" 
                    checked={settings.paymentSuccess}
                    onChange={e => setSettings({...settings, paymentSuccess: e.target.checked})}
                    className="w-5 h-5 rounded border-slate-500 text-emerald-500 focus:ring-emerald-500 bg-slate-700"
                    disabled={isProcessing}
                  />
                 <span className="text-slate-300">Step 2 Succeeds (Payment)</span>
               </label>
               <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-800 rounded">
                 <input 
                    type="checkbox" 
                    checked={settings.orderSuccess}
                    onChange={e => setSettings({...settings, orderSuccess: e.target.checked})}
                    className="w-5 h-5 rounded border-slate-500 text-emerald-500 focus:ring-emerald-500 bg-slate-700"
                    disabled={isProcessing}
                  />
                 <span className="text-slate-300">Step 3 Succeeds (Order Created)</span>
               </label>
             </div>

             <button
              onClick={runSimulation}
              disabled={isProcessing}
              className="w-full flex justify-center items-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded shadow-[0_4px_0_rgb(6,95,70)] active:shadow-none active:translate-y-1 transition-all"
            >
              {isProcessing ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
              Execute Transaction
            </button>
           </div>
        </VaultCard>
      </div>

      <div className="space-y-6">
         <VaultCard title="Logic Visualizer">
           <div className="h-64 flex flex-col justify-center items-center text-center p-4">
              {steps.some(s => s.status === 'rolled_back') ? (
                <div className="animate-bounce">
                  <div className="text-6xl mb-4">⏪</div>
                  <h3 className="text-2xl font-bold text-amber-500">ROLLING BACK</h3>
                  <p className="text-slate-400">Undoing changes to ensure "Nothing" happened.</p>
                </div>
              ) : steps.every(s => s.status === 'success') ? (
                <div className="animate-pulse">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold text-emerald-500">COMMITTED</h3>
                  <p className="text-slate-400">"All" steps completed successfully.</p>
                </div>
              ) : isProcessing ? (
                 <div>
                   <div className="text-6xl mb-4 animate-spin">⚙️</div>
                   <h3 className="text-xl text-blue-400">Processing...</h3>
                 </div>
              ) : (
                <div className="opacity-50">
                  <div className="text-6xl mb-4">⚓</div>
                  <h3 className="text-xl text-slate-500">Ready to Start</h3>
                </div>
              )}
           </div>
         </VaultCard>
         <VaultCard title="Transaction Log">
            <SystemLog logs={logs} />
         </VaultCard>
      </div>
    </div>
  );
};