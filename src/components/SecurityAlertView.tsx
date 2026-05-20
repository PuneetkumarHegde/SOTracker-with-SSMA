import React, { useState } from "react";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Terminal, 
  Settings, 
  Layers, 
  Brain, 
  CheckCircle,
  Activity,
  User,
  Info,
  Server
} from "lucide-react";
import { SystemAlert, NetworkConnection } from "../types";

interface SecurityAlertViewProps {
  alerts: SystemAlert[];
  connections: NetworkConnection[];
  onResolve: (id: string) => void;
}

interface AiAnalysisResult {
  summary: string;
  threatLevel: string;
  recommendations: string[];
}

export default function SecurityAlertView({ alerts, connections, onResolve }: SecurityAlertViewProps) {
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<Record<string, AiAnalysisResult>>({});
  const [activeTab, setActiveTab] = useState<"alerts" | "connections">("alerts");

  const runAiForensics = async (alert: SystemAlert) => {
    setAnalyzingId(alert.id);
    try {
      const response = await fetch("/api/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertMessage: `${alert.category}: ${alert.message} [Severity: ${alert.severity}]` }),
      });
      const data = await response.json();
      setAnalysisResult(prev => ({
        ...prev,
        [alert.id]: data
      }));
    } catch (err) {
      console.error("AI Forensics analysis failed:", err);
    } finally {
      setAnalyzingId(null);
    }
  };

  const pendingAlertCount = alerts.filter(a => !a.resolved).length;

  return (
    <div className="space-y-6">
      {/* Top statistics indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Core firewall telemetry */}
        <div className="p-5 rounded-xl bg-[#0A0D14] border border-slate-800 flex items-center gap-4 shadow-md backdrop-blur-sm">
          <div className="p-3 bg-cyan-950 text-cyan-400 rounded-lg border border-cyan-500/20">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-wider">SOC Monitoring Status</span>
            <h3 className="text-lg font-mono font-bold text-white mt-1">SIEM LOOP NORMAL</h3>
          </div>
        </div>

        {/* Security Alert Counters */}
        <div className="p-5 rounded-xl bg-[#0A0D14] border border-slate-800 flex items-center gap-4 shadow-md backdrop-blur-sm">
          <div className={`p-3 rounded-lg border ${pendingAlertCount > 0 ? "bg-rose-950 text-rose-455 text-rose-400 border-rose-500/20" : "bg-emerald-905 bg-emerald-950 text-emerald-400 border-emerald-500/20"}`}>
            {pendingAlertCount > 0 ? <ShieldAlert className="h-6 w-6 animate-pulse" /> : <ShieldCheck className="h-6 w-6" />}
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-wider">Pending Incident Logs</span>
            <h3 className={`text-lg font-mono font-bold mt-1 ${pendingAlertCount > 0 ? "text-rose-400" : "text-emerald-400"}`}>
              {pendingAlertCount} Unresolved
            </h3>
          </div>
        </div>

        {/* Total sockets */}
        <div className="p-5 rounded-xl bg-[#0A0D14] border border-slate-800 flex items-center gap-4 shadow-md backdrop-blur-sm">
          <div className="p-3 bg-purple-950 text-purple-400 rounded-lg border border-purple-500/20">
            <Server className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-wider">Total Network Connections</span>
            <h3 className="text-lg font-mono font-bold text-purple-400 mt-1">{connections.length} Sessions</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab("alerts")}
          className={`px-6 py-3 text-xs font-mono font-bold uppercase tracking-widest border-b-2 transition duration-240 cursor-pointer ${
            activeTab === "alerts"
              ? "border-cyan-500 text-cyan-400 bg-cyan-950/20 font-bold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          SIEM Threat Alerts ({alerts.length})
        </button>
        <button
          onClick={() => setActiveTab("connections")}
          className={`px-6 py-3 text-xs font-mono font-bold uppercase tracking-widest border-b-2 transition duration-240 cursor-pointer ${
            activeTab === "connections"
              ? "border-cyan-500 text-cyan-400 bg-cyan-950/20 font-bold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Network Session Monitors ({connections.length})
        </button>
      </div>

      {/* Views */}
      {activeTab === "alerts" ? (
        <div className="space-y-4">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-5 rounded-xl border font-mono text-xs flex flex-col gap-4 transition duration-300 ${
                  alert.resolved 
                    ? "bg-[#0A0D14]/50 border-slate-800/40 opacity-50 text-slate-400" 
                    : alert.severity === "CRITICAL"
                    ? "bg-rose-950/10 border-rose-500/30 text-rose-105 bg-rose-950/10 border-rose-500/30 text-rose-100"
                    : "bg-yellow-950/5 border-yellow-500/20 text-yellow-100"
                }`}
              >
                {/* Meta details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] uppercase font-bold py-0.5 px-2 rounded ${
                      alert.severity === "CRITICAL" ? "bg-rose-900 text-rose-100" :
                      alert.severity === "HIGH" ? "bg-rose-950 text-rose-300 border border-rose-800/35" : "bg-yellow-950 text-yellow-101 bg-yellow-950 text-yellow-400 border border-yellow-800/20 font-bold"
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="text-slate-500 text-[10px] font-bold">CATEGORY:</span>
                    <span className="font-bold text-cyan-400">{alert.category.toUpperCase()}</span>
                  </div>
                  <div className="text-slate-500 text-[10px]">
                    {new Date(alert.timestamp).toLocaleString()}
                  </div>
                </div>

                {/* Primary Warning text */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <ShieldAlert className={`h-4 w-4 ${alert.severity === "CRITICAL" ? "text-rose-400" : "text-yellow-400"}`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-slate-205 text-slate-200 font-bold leading-relaxed">{alert.message}</p>
                    <p className="text-slate-500 text-[10px]">Source Target: Local Endpoint SIEM Telemetry Agent</p>
                  </div>
                </div>

                {/* AI forensic analysis block if run */}
                {analysisResult[alert.id] && (
                  <div className="mt-2 p-4 rounded-lg bg-cyan-950/15 border border-cyan-500/20 space-y-3">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                      <Brain className="h-4 w-4 animate-pulse" />
                      <span>Gemini LLM Forensics Assessment</span>
                    </div>
                    <div className="text-slate-350 select-text text-slate-300 leading-relaxed text-[11px] font-sans">
                      {analysisResult[alert.id].summary}
                    </div>
                    <div className="space-y-1 pt-1.5">
                      <div className="text-cyan-400 font-bold text-[10px] uppercase tracking-wide">Threat Mitigation Actions:</div>
                      <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] font-sans">
                        {analysisResult[alert.id].recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-850 border-slate-800">
                  {!alert.resolved && (
                    <>
                      {/* Run AI forensics button */}
                      <button
                        onClick={() => runAiForensics(alert)}
                        disabled={analyzingId === alert.id}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase bg-slate-900 hover:bg-cyan-950/30 text-cyan-400 border border-cyan-505 border-cyan-500/20 rounded transition duration-150 disabled:opacity-50 cursor-pointer"
                      >
                        <Brain className="h-3.5 w-3.5" />
                        <span>{analyzingId === alert.id ? "Analyzing..." : "Gemini Analysis"}</span>
                      </button>

                      {/* Resolve alert */}
                      <button
                        onClick={() => onResolve(alert.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase bg-slate-900 border border-slate-800 hover:border-slate-700 text-emerald-400 rounded transition duration-150 cursor-pointer"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Acknowledge</span>
                      </button>
                    </>
                  )}
                  {alert.resolved && (
                    <span className="flex items-center gap-1 text-[10px] uppercase text-emerald-400 font-bold py-1 px-2 bg-emerald-950/20 rounded border border-emerald-900/30">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>RESOLVED & SIGNED</span>
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl font-mono text-xs">
              SIEM log stream is green. SOT telemetry logs are normal.
            </div>
          )}
        </div>
      ) : (
        /* Network Connection Tables */
        <div className="glass-cyber-panel rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800 bg-gray-950/30 flex items-center justify-between">
            <h3 className="font-display text-xs font-medium tracking-wider uppercase text-cyan-400 flex items-center gap-2">
              <span>● ESTABLISHED PORTS SECURITY SCAN</span>
            </h3>
            <span className="text-[10px] font-mono text-gray-500 uppercase">
              TCP/UDP Connection Table
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-950 text-gray-400 text-[10px] uppercase tracking-wider">
                  <th className="p-4">Process name</th>
                  <th className="p-4">Protocol</th>
                  <th className="p-4">Local Address</th>
                  <th className="p-4">Remote IP</th>
                  <th className="p-4">State</th>
                  <th className="p-4 text-right">Sent / Recv Bytes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50 bg-[#090d16]">
                {connections.map((c) => (
                  <tr key={c.id} className="hover:bg-cyan-950/10 transition-colors">
                    <td className="p-4 font-bold text-gray-200">{c.processName}</td>
                    <td className="p-4 text-purple-400 font-bold">{c.proto}</td>
                    <td className="p-4 text-gray-400">{c.localIp}:{c.localPort}</td>
                    <td className="p-4 text-cyan-400 font-semibold">{c.remoteIp}:{c.remotePort}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 text-[9px] rounded font-bold uppercase ${
                        c.state === "ESTABLISHED" ? "bg-cyan-950 text-cyan-400 border border-cyan-800/30" : "bg-gray-900 border border-gray-800 text-gray-400"
                      }`}>
                        {c.state}
                      </span>
                    </td>
                    <td className="p-4 text-right text-gray-300 font-mono">
                      {(c.sentBytes / 1024).toFixed(1)} KB / {(c.recvBytes / 1024).toFixed(1)} KB
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
