  import React, { useState, useEffect } from 'react';
  import { Shield, Clock, Monitor, RefreshCcw, AlertCircle } from 'lucide-react';

  const ActivityDashboard = () => {
    const [logs, setLogs] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Mock fetch function - replace with your actual fetch logic
    const fetchLogs = async () => {
      setIsRefreshing(true);
      try {
        const response = await fetch('https://moniter-rj.onrender.com/api/logs');
        const data = await response.json();
        setLogs(data);
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setTimeout(() => setIsRefreshing(false), 600);
      }
    };

    const privateCount = logs.filter(l => l.is_incognito).length;

    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100">
        {/* Top Navigation */}
        <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
                <Shield className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight">GuardView</span>
            </div>
            <button 
              onClick={fetchLogs}
              className={`p-2 rounded-full hover:bg-slate-100 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCcw size={20} className="text-slate-500" />
            </button>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto p-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Active</p>
              <div className="flex items-end gap-2 mt-1">
                <span className="text-2xl font-bold">{logs.length}</span>
                <span className="text-xs text-green-500 mb-1 font-medium">Windows</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Private Sessions</p>
              <div className="flex items-end gap-2 mt-1">
                <span className="text-2xl font-bold text-red-600">{privateCount}</span>
                <AlertCircle size={16} className="text-red-500 mb-1.5" />
              </div>
            </div>
          </div>

          {/* Section Header */}
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Live Activity Feed</h2>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[11px] font-medium text-slate-400">System Live</span>
            </div>
          </div>

          {/* Timeline Logs */}
          <div className="space-y-3">
            {logs.map((log, index) => (
              <div
                key={log._id || index}
                className="group relative bg-white border border-slate-200 rounded-2xl p-4 transition-all hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5"
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 p-2 rounded-xl ${log.is_incognito ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    <Monitor size={18} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[14px] font-semibold text-slate-800 leading-tight truncate pr-4">
                        {log.window_title}
                      </p>
                      {log.is_incognito && (
                        <span className="shrink-0 text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-md uppercase">
                          Incognito
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-2 flex items-center gap-3 text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span className="text-[11px] font-medium">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <span className="text-slate-200">•</span>
                      <span className="text-[11px] font-medium italic">Active Window</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {logs.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                  <Monitor className="text-slate-300" />
                </div>
                <p className="text-slate-400 text-sm font-medium">Waiting for laptop activity...</p>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  };

  export default ActivityDashboard;