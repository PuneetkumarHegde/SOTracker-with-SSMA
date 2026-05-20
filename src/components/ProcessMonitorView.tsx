import React, { useState } from "react";
import { 
  ShieldAlert, 
  Search, 
  Trash2, 
  Pause, 
  Play, 
  Cpu, 
  Gauge, 
  Server,
  RefreshCw,
  AlertOctagon
} from "lucide-react";
import { SystemProcess } from "../types";

interface ProcessMonitorViewProps {
  processes: SystemProcess[];
  onKill: (pid: number) => void;
  onSuspend: (pid: number) => void;
  onRefresh: () => void;
}

export default function ProcessMonitorView({ processes, onKill, onSuspend, onRefresh }: ProcessMonitorViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingPid, setLoadingPid] = useState<number | null>(null);

  const filteredProcesses = processes.filter(
    (p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = async (pid: number, action: "kill" | "suspend") => {
    setLoadingPid(pid);
    if (action === "kill") {
      await onKill(pid);
    } else {
      await onSuspend(pid);
    }
    setLoadingPid(null);
  };

  const activeProcessCount = processes.filter(p => p.status === "RUNNING").length;
  const criticalDetections = processes.filter(p => p.isNew && p.status === "RUNNING").length;

  return (
    <div className="space-y-6 text-slate-300">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-[#0A0D14] border border-slate-800 rounded-xl shadow-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search processes by bin structure, owner metadata, or PID..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 outline-none font-mono"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-500 hidden xl:inline">
            SYSTEM ENDPOINTS: {processes.length}
          </span>
          <button 
            onClick={onRefresh}
            className="p-2 border border-slate-800 hover:border-cyan-400 bg-slate-900 rounded-lg text-cyan-400 hover:text-cyan-300 transition duration-150 flex items-center justify-center cursor-pointer"
            title="Reload Processes list"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Cyber System Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0A0D14] border border-slate-800 p-5 rounded-xl flex items-center gap-4 shadow-md backdrop-blur-sm">
          <div className="p-3 bg-cyan-950 rounded-lg text-cyan-400">
            <Server className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-wider">Running Sockets</span>
            <h3 className="text-xl font-mono font-bold text-white mt-1">{activeProcessCount} Active</h3>
          </div>
        </div>

        <div className="bg-[#0A0D14] border border-slate-800 p-5 rounded-xl flex items-center gap-4 shadow-md backdrop-blur-sm">
          <div className="p-3 bg-rose-950 rounded-lg text-rose-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-wider">Threat Signatures</span>
            <h3 className="text-xl font-mono font-bold text-rose-400 mt-1">{criticalDetections} Suspicious</h3>
          </div>
        </div>

        <div className="bg-[#0A0D14] border border-slate-800 p-5 rounded-xl flex items-center gap-4 shadow-md backdrop-blur-sm">
          <div className="p-3 bg-pink-950 rounded-lg text-pink-400">
            <Gauge className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-wider">Pruning Schedule</span>
            <h3 className="text-sm font-mono font-bold text-pink-400 mt-1.5 uppercase">INTELLIGENT BYPASS</h3>
          </div>
        </div>
      </div>

      {/* Running Processes Table */}
      <div className="bg-[#0A0D14] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="border-b border-slate-800 p-4 flex items-center justify-between bg-slate-950/20">
          <h3 className="font-display text-xs font-bold tracking-widest uppercase text-cyan-400 flex items-center gap-2">
            <span>● CGroup System Thread Audit</span>
          </h3>
          <span className="text-[10px] font-mono text-slate-500 uppercase">
            Double-checked telemetry signals
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 text-[10px] uppercase tracking-wider">
                <th className="p-4">Process Name</th>
                <th className="p-4">PID</th>
                <th className="p-4">CPU %</th>
                <th className="p-4">Memory RAM</th>
                <th className="p-4">Owner Path</th>
                <th className="p-4">Security Severity</th>
                <th className="p-4 text-right">Endpoint Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 bg-[#090d16]">
              {filteredProcesses.length > 0 ? (
                filteredProcesses.map((p) => (
                  <tr 
                    key={p.pid} 
                    className={`hover:bg-slate-900/30 transition-colors ${
                      p.status === "KILLED" ? "opacity-30 line-through bg-slate-950/40" : ""
                    } ${p.isNew && p.status === "RUNNING" ? "border-l-2 border-rose-500 bg-rose-950/10 animate-pulse" : ""}`}
                  >
                    {/* Process Name */}
                    <td className="p-4 font-bold text-white">
                      <div className="flex items-center gap-2">
                        {p.isNew && p.status === "RUNNING" && (
                          <AlertOctagon className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                        )}
                        <span>{p.name}</span>
                        {p.isNew && p.status === "RUNNING" && (
                          <span className="text-[8px] bg-rose-500 text-white font-bold py-0.5 px-1 rounded ml-1">
                            NEW THREAT
                          </span>
                        )}
                      </div>
                    </td>
                    
                    {/* PID */}
                    <td className="p-4 text-cyan-400 font-bold">{p.pid}</td>
                    
                    {/* CPU Usage */}
                    <td className="p-4 text-slate-305 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Cpu className="h-3 w-3 text-cyan-500" />
                        <span>{p.cpu}%</span>
                      </div>
                    </td>
                    
                    {/* RAM LOAD */}
                    <td className="p-4 text-cyan-200/90">{p.ram > 0 ? `${p.ram} MB` : `0 MB`}</td>
                    
                    {/* Owner */}
                    <td className="p-4 text-slate-500">{p.owner}</td>
                    
                    {/* Status badges */}
                    <td className="p-4">
                      {p.status === "KILLED" ? (
                        <span className="py-0.5 px-1.5 rounded bg-rose-950/30 text-rose-500 font-bold uppercase text-[9px] border border-rose-800/20">
                          Killed
                        </span>
                      ) : p.status === "SUSPENDED" ? (
                        <span className="py-0.5 px-1.5 rounded bg-yellow-950/30 text-yellow-400 font-bold uppercase text-[9px] border border-yellow-800/20">
                          Suspended
                        </span>
                      ) : (
                        <span className={`py-0.5 px-1.5 rounded font-bold uppercase text-[9px] border ${
                          p.isNew ? "bg-rose-950 text-rose-400 border-rose-600/40" : "bg-[#0A0D14] text-cyan-400 border-slate-800/50"
                        }`}>
                          RUNNING
                        </span>
                      )}
                    </td>

                    {/* Action Panel Buttons */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {p.status !== "KILLED" && (
                          <>
                            {/* Suspend Toggle */}
                            <button
                              onClick={() => handleAction(p.pid, "suspend")}
                              disabled={loadingPid === p.pid}
                              className={`p-1.5 rounded border text-xs cursor-pointer transition ${
                                p.status === "SUSPENDED"
                                  ? "bg-cyan-950/40 border-cyan-500/30 text-cyan-400 hover:bg-cyan-900/30"
                                  : "bg-slate-900 border-slate-800 hover:border-yellow-400/50 text-yellow-400 hover:bg-yellow-950/20"
                              }`}
                              title={p.status === "SUSPENDED" ? "Resume Process" : "Suspend Process"}
                            >
                              {p.status === "SUSPENDED" ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                            </button>

                            {/* Kill Process */}
                            <button
                              onClick={() => handleAction(p.pid, "kill")}
                              disabled={loadingPid === p.pid}
                              className="p-1.5 bg-slate-900 hover:bg-rose-950 border border-slate-800 hover:border-rose-500/50 rounded text-rose-400 transition cursor-pointer"
                              title="Kill Process"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No active processes matching filters identified.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
