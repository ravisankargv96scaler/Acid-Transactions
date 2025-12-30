import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../../types';

interface SystemLogProps {
  logs: LogEntry[];
}

export const SystemLog: React.FC<SystemLogProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-black border border-slate-700 rounded-md p-2 h-40 overflow-y-auto font-mono text-xs shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
      <div className="text-slate-500 mb-2 border-b border-slate-800 pb-1">SYSTEM_LOG_MONITOR_V2.0</div>
      {logs.length === 0 && <div className="text-slate-600 italic">>> Waiting for transaction data...</div>}
      {logs.map((log) => (
        <div key={log.id} className="mb-1">
          <span className="text-slate-500 mr-2">[{log.timestamp}]</span>
          <span className={`
            ${log.type === 'info' ? 'text-blue-400' : ''}
            ${log.type === 'success' ? 'text-emerald-400' : ''}
            ${log.type === 'error' ? 'text-rose-500 font-bold' : ''}
            ${log.type === 'warning' ? 'text-amber-400' : ''}
          `}>
            {log.message}
          </span>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};