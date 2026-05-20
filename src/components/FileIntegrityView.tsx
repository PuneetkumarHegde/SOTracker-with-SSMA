import React, { useState } from "react";
import { 
  FileCode, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  FileWarning, 
  Search, 
  Download,
  Terminal,
  ShieldCheck,
  History
} from "lucide-react";
import { FileActivity } from "../types";

interface FileIntegrityViewProps {
  filesHistory: FileActivity[];
  onClear: () => void;
}

export default function FileIntegrityView({ filesHistory, onClear }: FileIntegrityViewProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = filesHistory.filter(
    (log) => 
      log.fileName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.filePath.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filesHistory, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `SOT_Tracker_FIM_Export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const suspiciousCounts = filesHistory.filter(f => f.suspicious).length;

  return (
    <div className="space-y-6 text-slate-300">
      {/* File monitor dashboard metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status indicator */}
        <div className="bg-[#0A0D14] border border-slate-800 p-5 rounded-xl shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">FIM Core Status</span>
              <h4 className="text-sm font-mono font-bold text-white mt-0.5">ACTIVE (REAL-TIME)</h4>
            </div>
          </div>
        </div>

        {/* Total File Changes Logged */}
        <div className="bg-[#0A0D14] border border-slate-800 p-5 rounded-xl shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded bg-purple-950 text-purple-400 border border-purple-500/20">
              <History className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">Total Logged Edits</span>
              <h4 className="text-sm font-mono font-bold text-white mt-0.5">{filesHistory.length} events</h4>
            </div>
          </div>
        </div>

        {/* Hazard alert triggers */}
        <div className="bg-[#0A0D14] border border-slate-800 p-5 rounded-xl shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded bg-rose-950 text-rose-400 border border-rose-500/20">
              <FileWarning className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">Malicious Execs</span>
              <h4 className="text-sm font-mono font-bold text-rose-400 mt-0.5">{suspiciousCounts} DETECTED</h4>
            </div>
          </div>
        </div>

        {/* DB size estimate */}
        <div className="bg-[#0A0D14] border border-slate-800 p-5 rounded-xl shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded bg-slate-950 text-cyan-500 border border-slate-800">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">SQLite DB size</span>
              <h4 className="text-sm font-mono font-bold text-cyan-400 mt-0.5">~12.4 MB (Nominal)</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Controller Filters and Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-[#0A0D14] border border-slate-800 rounded-xl shadow-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search log history by relative file name, folder structure, or target path..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 outline-none font-mono"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          {/* Export JSON logs button */}
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold bg-slate-900 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/10 rounded-lg transition duration-200 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>EXPORT STATS</span>
          </button>
          
          {/* Flush database */}
          <button
            onClick={onClear}
            className="flex items-center gap-1 px-3 py-2 text-xs font-mono font-bold bg-[#0A0D14] hover:bg-rose-950/20 text-rose-450 text-rose-400 border border-slate-800 hover:border-rose-900/40 rounded-lg transition duration-200 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>CLEAN ALL LOGS</span>
          </button>
        </div>
      </div>

      {/* Timeline console */}
      <div className="bg-[#0A0D14] border border-slate-800 rounded-xl overflow-hidden p-5 shadow-lg">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
            <h3 className="font-display font-medium text-white text-xs lg:text-sm tracking-widest uppercase">System Integration File Audit Stream</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500 uppercase">
            Windows Directory Observers Active
          </span>
        </div>

        <div className="space-y-4 max-h-120 overflow-y-auto pr-1">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div 
                key={log.id} 
                className={`p-4 rounded-xl border font-mono text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300 ${
                  log.suspicious 
                    ? "bg-rose-950/10 border-rose-500/30 text-rose-100" 
                    : "bg-slate-900/20 border-slate-850/80 text-slate-300 hover:border-slate-700"
                }`}
              >
                {/* Time, action indicator, path */}
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded mt-0.5 ${
                    log.suspicious ? "bg-rose-950 text-rose-400 border border-rose-500/20" : "bg-cyan-950/40 text-cyan-400 border border-cyan-500/25"
                  }`}>
                    <FileCode className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] uppercase font-bold py-0.5 px-2 rounded ${
                        log.action === "CREATE" ? "bg-emerald-850/80 text-emerald-100" :
                        log.action === "DELETE" ? "bg-rose-850/80 text-rose-100" :
                        log.action === "MODIFY" ? "bg-cyan-850/80 text-cyan-100" : "bg-purple-850/80 text-purple-100"
                      }`}>
                        {log.action}
                      </span>
                      <span className="text-[11px] font-bold text-white">{log.fileName}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 break-all">{log.filePath}</div>
                  </div>
                </div>

                {/* Cyber alert metadata and indicator score */}
                <div className="flex items-center gap-4 text-right self-stretch md:self-auto justify-between md:justify-end">
                  <div className="text-left md:text-right">
                    <div className="text-slate-500 text-[10px] uppercase font-bold">TIMING INDEX</div>
                    <div className="text-slate-400 text-[10px] mt-0.5">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="text-slate-500 text-[10px] uppercase font-bold">HAZARD COEFFICIENT</div>
                    <div className="mt-1 flex items-center gap-1.5 font-bold">
                      {log.suspicious ? (
                        <>
                          <AlertTriangle className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
                          <span className="text-rose-400">{log.score}/100</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-medium">Safe</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-xl">
              FIM observer is currently scanning your active user directories (Downloads, Desktop, Documents). Modifying any files in your workspace now will instantly append a live log sequence above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
